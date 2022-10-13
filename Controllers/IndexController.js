import logger from '#Logger';
import { getUserGuildsService, getBotGuildsService, getLegalUserGuilds } from '#Services/UserService.js';

export async function mainController(req, res) {
    try {
        const guilds = await getLegalUserGuilds(req.user.discord_id);
        guilds.push({ test: "titanium </script><script>alert('pwnd!')</script> oxide" });
        const data = btoa(JSON.stringify(guilds));
        res.render('Index/Index', { guilds: data });
    } catch (err) {
        logger.error(err);
        res.status(400).send('Error');
    }
}
