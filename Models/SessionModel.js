import cassandra from '#Database/Index.js';

export default class Session {
    static async findBySid(sessionId) {
        return new Promise(async (resolve, reject) => {
            const query = 'SELECT session FROM user_sessions WHERE sid = ?';
            const params = [sessionId];
            await cassandra.execute(query, params, { prepare: true }, (err, res) => {
                if (err) reject(err);
                if (res.rows.length === 0) return resolve(false);
                resolve({
                    sid: res.rows[0].session,
                });
            });
        });
    }
}
