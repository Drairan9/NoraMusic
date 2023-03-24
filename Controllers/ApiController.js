import logger from '#Logger';
import { getLegalUserGuilds } from '#Services/UserService.js';
import { getUserRecommendations } from '#Services/SpotifyUserService.js';

export async function index(req, res) {
    try {
        let guilds = await getLegalUserGuilds(req.user.discord_id);
        req.session.guilds = guilds;
        // Encode data with base64 for transport and avoiding XSS
        res.render('Guild/Index', { guilds: Buffer.from(JSON.stringify(guilds)).toString('base64') });
    } catch (err) {
        logger.error(err);
        res.status(400).send('Error'); // TODO: Better error handling (Error page)
    }
}
