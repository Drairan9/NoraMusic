import express from 'express';
import { isAuthenticatedApi } from '#Utils/Middlewares.js';
import { getUserRecommendations } from '#Services/SpotifyUserService.js';

let router = express.Router();

router.get('/spotify', isAuthenticatedApi, async (req, res) => {
    let discordId = req.user.discord_id;
    try {
        // let spotifyRes = await getUserRecommendations(discordId);
        res.json(req.user);
        console.log(req);
        // res.json(_deconstructSpotifyTracks(spotifyRes.tracks));
    } catch (error) {
        res.json(error);
    }
});

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

export default router;
