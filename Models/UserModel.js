import cassandra from '#Database/Index.js';

export default class User {
    constructor(discordId, accessToken, refreshToken, avatarUrl) {
        this.discordId = discordId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.avatarUrl = avatarUrl;
        createUserAsync(discordId, accessToken, refreshToken, avatarUrl);
    }

    static async createUserAsync(discordId, accessToken, refreshToken, avatarUrl) {
        return new Promise(async (resolve, reject) => {
            const query =
                'INSERT INTO app_users(access_token, refresh_token, discord_id, avatar_url) VALUES (?, ?, ?, ?)';
            const params = [accessToken, refreshToken, discordId, avatarUrl];
            await cassandra.execute(query, params, { prepare: true }, (err, res) => {
                if (err) reject(err);
                resolve({
                    discord_id: discordId,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    avatar_url: avatarUrl,
                });
            });
        });
    }

    static async findOneAndUpdate(discordId, accessToken, refreshToken, avatarUrl) {
        return new Promise(async (resolve, reject) => {
            const query =
                'UPDATE app_users SET access_token = ?, refresh_token = ?, avatar_url = ? WHERE discord_id = ? IF EXISTS';
            const params = [accessToken, refreshToken, avatarUrl, discordId];
            await cassandra.execute(query, params, { prepare: true }, (err, res) => {
                if (err) reject(err);
                if (res.rows[0]['[applied]']) {
                    resolve({
                        discord_id: discordId,
                        access_token: accessToken,
                        refresh_token: refreshToken,
                        avatar_url: avatarUrl,
                    });
                }
                resolve(false);
            });
        });
    }

    static async findById(discordId) {
        return new Promise(async (resolve, reject) => {
            const query = 'SELECT * FROM app_users WHERE discord_id = ?';
            const params = [discordId];
            await cassandra.execute(query, params, { prepare: true }, (err, res) => {
                if (err) reject(err);
                if (res.rows.length <= 0) resolve(false);
                resolve({
                    discord_id: discordId,
                    access_token: res.rows[0].access_token,
                    refresh_token: res.rows[0].refresh_token,
                    avatar_url: res.rows[0].avatar_url,
                });
            });
        });
    }

    static async clearDb() {
        await cassandra.execute('TRUNCATE norausers', (err, res) => {
            console.log(err);
        });
        await cassandra.execute('TRUNCATE sessions', (err, res) => {
            console.log(err);
        });
        await cassandra.execute('TRUNCATE avatars_by_id', (err, res) => {
            console.log(err);
        });
        await cassandra.execute('TRUNCATE points_by_id', (err, res) => {
            console.log(err);
        });
    }
}
