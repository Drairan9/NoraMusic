import axios from 'axios';
import { DISCORD_API_URL } from '#Utils/Constants.js';
import User from '#Models/UserModel.js';

export async function getUserAvatarUrlService(accessToken) {
    let userData = await axios.get(`${DISCORD_API_URL}/users/@me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    return `https://cdn.discordapp.com/avatars/${userData.data.id}/${userData.data.avatar}.jpg`;
}

export async function getUserGuildsService(id, retries = 3) {
    const user = await User.findById(id);
    if (!user) throw new Error('No user found');

    return new Promise(async (resolve, reject) => {
        async function makeCall() {
            await axios
                .get(`${DISCORD_API_URL}/users/@me/guilds`, {
                    headers: { Authorization: `Bearer ${user.access_token}` },
                })
                .then((res) => resolve(res.data))
                .catch((err) => {
                    if (retries > 0) {
                        if (err.response.status === 429) {
                            let retryTime = err.response.data.retry_after * 1000;
                            setTimeout(async () => {
                                retries--;
                                makeCall();
                            }, retryTime);
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

export async function getBotGuildsService(retries = 3) {
    return new Promise((resolve, reject) => {
        async function makeCall() {
            await axios
                .get(`${DISCORD_API_URL}/users/@me/guilds`, {
                    headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
                })
                .then((res) => resolve(res.data))
                .catch((err) => {
                    if (retries > 0) {
                        if (err.response.status === 429) {
                            let retryTime = err.response.data.retry_after * 1000;
                            setTimeout(async () => {
                                retries--;
                                makeCall();
                            }, retryTime);
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

export async function getLegalUserGuilds(id) {
    const userGuilds = (await getUserGuildsService(id).catch((err) => console.log(err))) || false;
    const botGuilds = (await getBotGuildsService().catch((err) => console.log(err))) || false;

    if (!userGuilds || !botGuilds) {
        return {};
    }

    var mutualGuilds = userGuilds.filter((guild) => botGuilds.some((botGuild) => botGuild.id === guild.id));

    mutualGuilds.forEach((guild) => {
        delete guild.features;
        delete guild.permissions;
        guild.avatarUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg`;
    });
    return mutualGuilds;
}

export async function isInGuild(id, guildId) {
    let legal = await getLegalUserGuilds(id);

    if (Object.keys(legal).length === 0) {
        return [];
    }

    return legal.filter((guild) => guild.id === guildId);
}
