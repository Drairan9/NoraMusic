export const isAuthenticated = (req, res, next) => (req.user ? next() : res.redirect('/login/auth/discord'));

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
