import logger from '#Logger';
import { getUserGuildsService, getBotGuildsService, getLegalUserGuilds } from '#Services/UserService.js';

export async function mainController(req, res) {
    try {
        const guilds = await getLegalUserGuilds(req.user.discord_id);
        res.send(guilds);
    } catch (err) {
        logger.error(err);
        res.status(400).send('Error');
    }
}
