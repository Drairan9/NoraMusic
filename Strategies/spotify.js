import passport from 'passport';
import { Strategy } from 'passport-spotify';

passport.use(
    new Strategy(
        {
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/login/auth/spotify/redirect',
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(accessToken);
            console.log(refreshToken);
            console.log(profile);
            done();
        }
    )
);
