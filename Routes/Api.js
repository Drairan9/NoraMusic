import express from 'express';
import { isAuthenticatedApi } from '#Utils/Middlewares.js';
import * as ApiController from '#Controllers/ApiController.js';

let router = express.Router();

router.get('/spotify', isAuthenticatedApi, ApiController.spotify);

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
