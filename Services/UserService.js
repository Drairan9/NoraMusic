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
    return axios.get(`${DISCORD_API_URL}/users/@me/guilds`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
    });
}
