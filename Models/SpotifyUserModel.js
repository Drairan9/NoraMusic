import cassandra from '#Database/Index.js';

export default class SpotifyUser {
    constructor(discordId, accessToken, refreshToken, spotifyId) {
        this.discordId = discordId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.spotifyId = spotifyId;
        createUserAsync(discordId, accessToken, refreshToken, spotifyId);
    }

    static async createUserAsync(discordId, accessToken, refreshToken, spotifyId) {
        return new Promise(async (resolve, reject) => {
            const query =
                'INSERT INTO spotify_users(access_token, refresh_token, discord_id, spotify_id) VALUES (?, ?, ?, ?)';
            const params = [accessToken, refreshToken, discordId, spotifyId];
            await cassandra.execute(query, params, { prepare: true }, (err, res) => {
                if (err) reject(err);
                resolve({
                    discord_id: discordId,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    spotify_id: spotifyId,
                });
            });
        });
    }

    static async findOneAndUpdate(discordId, accessToken, refreshToken, spotifyId) {
        return new Promise(async (resolve, reject) => {
            const query =
                'UPDATE spotify_users SET access_token = ?, refresh_token = ?, spotify_id = ? WHERE discord_id = ? IF EXISTS';
            const params = [accessToken, refreshToken, spotifyId, discordId];
            await cassandra.execute(query, params, { prepare: true }, (err, res) => {
                if (err) reject(err);
                if (res.rows[0]['[applied]']) {
                    resolve({
                        discord_id: discordId,
                        access_token: accessToken,
                        refresh_token: refreshToken,
                        spotify_id: spotifyId,
                    });
                }
                resolve(false);
            });
        });
    }

    static async findById(discordId) {
        return new Promise(async (resolve, reject) => {
            const query = 'SELECT * FROM spotify_users WHERE discord_id = ?';
            const params = [discordId];
            await cassandra.execute(query, params, { prepare: true }, (err, res) => {
                if (err) reject(err);
                //TODO: Check this return
                if (res.rowLength <= 0) return resolve(false);
                resolve({
                    discord_id: discordId,
                    access_token: res.rows[0].access_token,
                    refresh_token: res.rows[0].refresh_token,
                    spotify_id: res.rows[0].spotify_id,
                });
            });
        });
    }

    static async updateAccessToken(discordId, accessToken) {
        return new Promise(async (resolve, reject) => {
            const query = 'UPDATE spotify_users SET access_token = ? WHERE discord_id = ? IF EXISTS';
            const params = [accessToken, discordId];
            await cassandra.execute(query, params, { prepare: true }, (err, res) => {
                if (err) reject(err);
                if (res.rows[0]['[applied]']) {
                    resolve(true);
                }
                reject(false);
            });
        });
    }
}
