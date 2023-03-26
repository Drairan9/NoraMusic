import { getUserRecommendations } from '#Services/SpotifyUserService.js';

export async function spotify(req, res) {
    let discordId = req.user.discord_id;
    await getUserRecommendations(discordId)
        .then((response) => {
            res.json(response);
        })
        .catch((error) => {
            res.status(error.status);
        });
}
