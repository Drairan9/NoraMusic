export const isAuthenticated = (req, res, next) => (req.user ? next() : res.redirect('/login/auth/discord'));
