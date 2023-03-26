import logger from '#Logger';
import { getLegalUserGuilds } from '#Services/UserService.js';
import { getUserRecommendations } from '#Services/SpotifyUserService.js';

export async function spotify(req, res) {
    let discordId = req.user.discord_id;
    try {
        // let spotifyRes = await getUserRecommendations(discordId);
        res.json('Success');
        console.log(req);
        // res.json(_deconstructSpotifyTracks(spotifyRes.tracks));
    } catch (error) {
        res.json(error);
    }
}
