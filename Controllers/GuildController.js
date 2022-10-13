import logger from '#Logger';
import { getUserGuildsService, getBotGuildsService, getLegalUserGuilds } from '#Services/UserService.js';

export async function mainController(req, res) {
    try {
        var guilds = await getLegalUserGuilds(req.user.discord_id);
        guilds = btoa(JSON.stringify(guilds));
        res.render('Guild/Index', { guilds: guilds });
    } catch (err) {
        logger.error(err);
        res.status(400).send('Error');
    }
}
