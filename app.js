import ConfigLoader from './Utils/ConfigLoader.js';
import express from 'express';
import session from 'express-session';
import { cassandraStore } from '#Database/Index.js';
import passport from 'passport';
import logger from '#Logger';
import * as discordStrategy from '#Strategies/discord.js';
import * as discordBot from './Discord/Index.js';
import createSocket from './Socket/Index.js';

import indexRouter from '#Root/Routes/Index.js';
import loginRouter from '#Root/Routes/Login.js';
import guildRouter from '#Root/Routes/Guild.js';

const app = express();

app.use(
    session({
        secret: 'ASDASD',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 * 60 * 24 * 7 },
        store: cassandraStore,
    })
);

// View engine
app.set('view engine', 'ejs');
app.set('views', 'Views');

// Static
app.use(express.static('./Public'));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/guild', guildRouter);

const server = app.listen(process.env.SERVER_PORT, () => {
    logger.info(`*Norabot web dj* running on port ${process.env.SERVER_PORT}`);
});
createSocket(server);
