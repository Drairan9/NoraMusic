import axios from 'axios';
import { DISCORD_API_URL } from '#Utils/Constants.js';
import User from '#Models/UserModel.js';

export async function getUserAvatarUrlService(accessToken) {
    let userData = await axios.get(`${DISCORD_API_URL}/users/@me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    return `https://cdn.discordapp.com/avatars/${userData.data.id}/${userData.data.avatar}.jpg`;
}

export async function getUserGuildsService(id) {
    const user = await User.findById(id);
    if (!user) throw new Error('No user found');

    var res = await axios.get(`${DISCORD_API_URL}/users/@me/guilds`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
    });

    return res.data;
}

export async function getBotGuildsService() {
    const res = await axios.get(`${DISCORD_API_URL}/users/@me/guilds`, {
        headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
    });

    return res.data;
}

export async function getLegalUserGuilds(id) {
    const userGuilds = await getUserGuildsService(id);
    const botGuilds = await getBotGuildsService();
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

    return legal.filter((guild) => guild.id === guildId);
}
