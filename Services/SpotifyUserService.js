import logger from '#Logger';
import axios from 'axios';
import { SPOTIFY_API_URL } from '#Utils/Constants.js';
import User from '#Models/UserModel.js';
import SpotifyUser from '#Models/SpotifyUserModel.js';

export async function getUserRecommendations(discordId, retries = 3) {
    return new Promise(async (resolve, reject) => {
        const user = await User.findById(discordId);
        if (!user) reject({ status: 401 }); // No user found

        async function makeCall() {
            const spotifyUser = await SpotifyUser.findById(discordId);
            if (!spotifyUser) return reject({ status: 403 }); // No linked spotify account

            logger.debug(`Making spotify API call for user: ${discordId}`);
            await axios
                .get(`${SPOTIFY_API_URL}/recommendations?limit=10&seed_genres=hip-hop`, {
                    headers: { Authorization: `Bearer ${spotifyUser.access_token}` },
                })
                .then((res) => {
                    logger.debug('Spotify API successful response.');
                    resolve(_deconstructSpotifyTracks(res.data.tracks));
                })
                .catch(async (err) => {
                    logger.debug(`Spotify API error detected.`);
                    console.log(err);
                    if (retries > 0) {
                        if (err.response.status === 429) {
                            logger.debug('Spotify API code 429');
                            let retryTime = err.response.data.retry_after * 1500;
                            setTimeout(async () => {
                                retries--;
                                makeCall();
                            }, retryTime);
                        }
                        if (err.response.status === 401) {
                            logger.debug('Spotify API code 401');
                            // Request new access token
                            await requestAccessToken(discordId, spotifyUser.refresh_token)
                                .then(() => {
                                    makeCall();
                                })
                                .catch(() => {
                                    reject({ status: 502 }); // API refreshing token failed
                                });
                        } else {
                            logger.debug('Spotify API code XXX');
                            retries--;
                            makeCall();
                        }
                    } else {
                        logger.error(
                            `API request for user ${discordId} failed with status code ${err.response.status}`
                        );
                        reject({ status: 500 });
                    }
                });
        }
        makeCall();
    });
}

function requestAccessToken(discordId, refreshToken) {
    return new Promise((resolve, reject) => {
        logger.debug(`Requesting new token for user ${discordId}...`);
        const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString(
            'base64'
        );
        axios
            .post('https://accounts.spotify.com/api/token', `grant_type=refresh_token&refresh_token=${refreshToken}`, {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then(async (res) => {
                logger.debug(`Requesting new token for user ${discordId} was successful. Now updating DB...`);
                await SpotifyUser.updateAccessToken(discordId, res.data.access_token)
                    .then(() => {
                        logger.debug(`Successfully updated spotify token for user ${discordId}`);
                        resolve(true);
                    })
                    .catch(() => {
                        logger.error(`Failed inserting spotify access token into DB for user ${discordId}`);
                        reject(false);
                    });
            })
            .catch((err) => {
                logger.error(`Refreshing spotify token for user ${discordId} failed with error: ${err}`);
                reject(false);
            });
    });
}

export async function isSpotifyExist(discordId) {
    await SpotifyUser.findById(discordId)
        .then((result) => {
            if (!result) return false;
            return true;
        })
        .catch((err) => {
            logger.error(`Failed searching spotify data inside DB for user ${discordId} with error: ${err}`);
            return false;
        });
}

function _deconstructSpotifyTracks(tracks) {
    let tracksArray = [];
    tracks.forEach((track) => {
        const url = track.external_urls.spotify;
        const cover = track.album.images[0].url;
        const title = track.name;
        const artists = track.artists.map((artist) => artist.name).join(', ');
        tracksArray.push({ url, cover, title, artists });
    });
    return tracksArray;
}
