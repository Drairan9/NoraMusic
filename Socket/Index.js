import { Server } from 'socket.io';
import { readSocketHandshake } from '#Utils/Middlewares.js';
import { isInGuild } from '#Services/UserService.js';
import logger from '#Utils/Logger.js';

let io;

export default function createSocket(server) {
    io = new Server(server);

    io.on('connection', (socket) => {
        socket.on('server-hello', async (callback) => {
            let userData = await readSocketHandshake(socket.handshake.headers);
            // Make sure that user is connecting with allowed guild
            let legalGuilds = await isInGuild(userData.discord_id, userData.url);
            if (legalGuilds.length <= 0) {
                try {
                    return callback({ isSuccess: false, error: true, errorMessage: 'Illegal guild' });
                } catch (err) {
                    logger.error(err);
                }
            }
            // Clear rooms
            socket.rooms.forEach((room) => {
                socket.leave(room);
            });
            socket.join(userData.url);
            try {
                callback({ isSuccess: true, error: false, errorMessage: '' });
            } catch (err) {
                logger.error(err);
            }
        });

        socket.on('bot-hello-relay', async (arg, callback) => {
            if (arg !== process.env.CLIENT_ID) {
                try {
                    return callback({ isSuccess: false, error: true, errorMessage: 'Invalid credentials.' });
                } catch (err) {
                    logger.error(err);
                }
            }
            // Clear rooms
            socket.rooms.forEach((room) => {
                socket.leave(room);
            });
            socket.join(process.env.CLIENT_ID);
            try {
                callback({ isSuccess: true, error: false, errorMessage: '' });
                logger.info('Bot connected with server.');
            } catch (err) {
                logger.error(err);
            }
        });
    });
}
