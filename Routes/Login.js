import express from 'express';
import { isAuthenticated } from '#Utils/Middlewares.js';
import passport from 'passport';

var router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
    res.send('Login page');
});

// All logic is in ./Strategies/discord.js
router.get(
    '/auth/discord',
    passport.authenticate('discord', {
        failureRedirect: '/login',
    })
);

router.get(
    '/auth/discord/redirect',
    passport.authenticate('discord', {
        failureRedirect: '/login',
    }),
    function (req, res) {
        res.redirect('/guild'); // Successful auth
    }
);

export default router;
