import passport from 'passport';
import { Strategy } from 'passport-spotify';
import SpotifyUser from '#Models/SpotifyUserModel.js';

passport.use(
    new Strategy(
        {
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_ORIGIN}/login/auth/spotify/redirect`,
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await SpotifyUser.findOneAndUpdate(
                    req.user.discord_id,
                    accessToken,
                    refreshToken,
                    profile.id
                );
                if (existingUser) return done(null, existingUser);
                const newUser = await SpotifyUser.createUserAsync(
                    req.user.discord_id,
                    accessToken,
                    refreshToken,
                    profile.id
                );
                return done(null, newUser);
            } catch (err) {
                logger.error(err);
                return done(err, undefined);
            }
        }
    )
);
