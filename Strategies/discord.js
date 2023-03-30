import passport from 'passport';
import { Strategy } from 'passport-discord';
import logger from '#Logger';
import User from '#Models/UserModel.js';
import { getUserAvatarUrlService } from '#Services/UserService.js';

const scopes = ['identify', 'guilds'];

passport.serializeUser((user, done) => {
    return done(null, user.discord_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        return user ? done(null, user) : done(null, null);
    } catch (err) {
        logger.error(err);
        return done(err, null);
    }
});

passport.use(
    new Strategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_ORIGIN}/login/auth/discord/redirect`,
            scope: scopes,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let avatarUrl = await getUserAvatarUrlService(accessToken);
                const existingUser = await User.findOneAndUpdate(profile.id, accessToken, refreshToken, avatarUrl);
                if (existingUser) return done(null, existingUser);
                const newUser = await User.createUserAsync(profile.id, accessToken, refreshToken, avatarUrl);
                return done(null, newUser);
            } catch (err) {
                logger.error(err);
                return done(err, undefined);
            }
        }
    )
);
