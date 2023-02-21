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

export async function dashboard(req, res) {
    try {
        let savedGuilds = req.session.guilds.filter((guild) => guild.id === req.params.serverid);
        if (savedGuilds.length <= 0) return res.status(400).send('No guild');
        let spotify;
        //TODO: Spaghettii
        await getUserRecommendations(req.user.discord_id)
            .then((result) => (spotify = result))
            .catch((err) => (spotify = false));

        if (spotify)
            spotify = Buffer.from(JSON.stringify(_deconstructSpotifyTracks(spotify.tracks)).toString('base64'));

        res.render('Guild/Dashboard', {
            name: savedGuilds[0].name,
            avatarUrl: savedGuilds[0].avatarUrl,
            spotifyTracks: spotify,
        });
    } catch (err) {
        logger.error(err);
        res.status(400).send('Error'); // TODO: Better error handling (Error page)
    }
}

//TODO: TEMPORARY
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
