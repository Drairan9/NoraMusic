import logger from '#Logger';
import { getLegalUserGuilds } from '#Services/UserService.js';

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

export async function dashboard(req, res) {
    try {
        let savedGuilds = req.session.guilds.filter((guild) => guild.id === req.params.serverid);
        if (savedGuilds.length <= 0) return res.status(400).send('No guild');

        res.render('Guild/Dashboard', { name: savedGuilds[0].name, avatarUrl: savedGuilds[0].avatarUrl });
    } catch (err) {
        logger.error(err);
        res.status(400).send('Error'); // TODO: Better error handling (Error page)
    }
}
