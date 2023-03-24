import logger from '#Logger';
import axios from 'axios';
import { SPOTIFY_API_URL } from '#Utils/Constants.js';
import User from '#Models/UserModel.js';
import SpotifyUser from '#Models/SpotifyUserModel.js';

export async function getUserRecommendations(discordId, retries = 3) {
    const user = await User.findById(discordId);
    if (!user) reject('No user found');

    return new Promise(async (resolve, reject) => {
        async function makeCall() {
            const spotifyUser = await SpotifyUser.findById(discordId);
            if (!spotifyUser) return reject('No linked spotify account');
            await axios
                .get(`${SPOTIFY_API_URL}/recommendations?limit=10&seed_genres=hip-hop`, {
                    headers: { Authorization: `Bearer ${spotifyUser.access_token}` },
                })
                .then((res) => {
                    resolve(res.data);
                })
                .catch(async (err) => {
                    if (retries > 0) {
                        if (err.response.status === 429) {
                            let retryTime = err.response.data.retry_after * 1500;
                            setTimeout(async () => {
                                retries--;
                                makeCall();
                            }, retryTime);
                        }
                        if (err.response.status === 401) {
                            // Request new access token
                            let reqres = await requestAccessToken(discordId, spotifyUser.refresh_token).catch(
                                reject('API refreshing token failed')
                            );
                            console.log(reqres);
                            makeCall();
                        } else {
                            retries--;
                            makeCall();
                        }
                    } else {
                        reject(`API request failed. with code ${err.response.status}`);
                    }
                });
        }
        makeCall();
    });
}

function requestAccessToken(discordId, refreshToken) {
    return new Promise((resolve, reject) => {
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
                await SpotifyUser.updateAccessToken(discordId, res.data.access_token)
                    .then(resolve(true))
                    .catch(reject('DB update failed'));
            })
            .catch((err) => {
                logger.error(err);
                reject(err);
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
            logger.error(err);
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
