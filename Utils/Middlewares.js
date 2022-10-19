import Session from '#Models/SessionModel.js';

export const isAuthenticated = (req, res, next) => (req.user ? next() : res.redirect('/login/auth/discord'));
export const hasGuilds = (req, res, next) => (req.session.guilds ? next() : res.redirect('/guild'));

/**
 * Convert Cookie String into Map with cookies
 * @param {string} cookieString Cookie string
 * @returns {MapConstructor} Map { key: cookie-name, value: cookie-value }
 */
export const parseCookieString = (cookieString) => {
    let cookieArray = cookieString.split('; ');
    let cookieMap = new Map();

    cookieArray.forEach((cookie) => {
        let splitted = cookie.split('=');
        let name = splitted[0];
        splitted.splice(0, 1); // Cut name from cookie
        let value = splitted.join('='); // Join all left parts
        cookieMap.set(name, value);
    });
    return cookieMap;
};

/**
 *  Clip Session Cookie into DB Sid
 * @param {String} sessionID
 * @returns {String} Real Sid
 */
export const readConnectSid = (sessionID) => {
    return sessionID.substring(4, 36);
};

/**
 *  Get from socket handshake discord_id & url request
 * @param {String} Headers Socket.io headers
 * @returns {Object} Object with discord_id & url
 */
export async function readSocketHandshake(headers) {
    let requestUrl = headers.referer.split('/');
    let clientSid = readConnectSid(parseCookieString(headers.cookie).get('connect.sid'));
    let DbSessionCookie = await Session.findBySid(clientSid);
    DbSessionCookie = JSON.parse(DbSessionCookie.sid);
    let uId = DbSessionCookie.passport.user;
    return {
        discord_id: uId,
        url: requestUrl[requestUrl.length - 1],
    };
}
