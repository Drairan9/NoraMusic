import logger from '#Logger';
import axios from 'axios';
import { SPOTIFY_API_URL } from '#Utils/Constants.js';
import User from '#Models/UserModel.js';
import SpotifyUser from '#Models/SpotifyUserModel.js';

export async function getUserRecommendations(discordId, retries = 0) {
    const user = await User.findById(discordId);
    if (!user) throw new Error('No user found');

    return new Promise(async (resolve, reject) => {
        async function makeCall() {
            const spotifyUser = await SpotifyUser.findById(discordId);
            if (!user) throw new Error('No linked spotify account');
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
                            let retryTime = err.response.data.retry_after * 1000;
                            setTimeout(async () => {
                                retries--;
                                makeCall();
                            }, retryTime);
                        }
                        if (err.response.status === 401) {
                            // Request new access token
                            await requestAccessToken(discordId, spotifyUser.refresh_token).catch(
                                reject('API refreshing token failed')
                            );
                            makeCall();
                        } else {
                            retries--;
                            makeCall();
                        }
                    } else {
                        reject('API request failed.');
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
