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
                    return callback({ isSuccess: false, error: true, errorMessage: 'Illegal guild', payload: '' });
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
                callback({ isSuccess: true, error: false, errorMessage: '', payload: '' });
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

        socket.on('fetch-all-data', async (callback) => {
            let userData = await readSocketHandshake(socket.handshake.headers);
            socket
                .to(process.env.CLIENT_ID)
                .timeout(1000)
                .emit('bot-fetch-all', userData, (err, res) => {
                    if (err) return callback({ isSuccess: false, error: true, errorMessage: 'Timeout error from bot' });
                    callback({ isSuccess: true, error: false, errorMessage: '', payload: res[0] });
                });
        });

        socket.on('enable-filter', async (arg, callback) => {
            let userData = await readSocketHandshake(socket.handshake.headers);
            socket
                .to(process.env.CLIENT_ID)
                .timeout(1000)
                .emit('bot-enable-filter', { guildId: userData.url, filter: arg }, (err, res) => {
                    if (err) return callback({ isSuccess: false, error: true, errorMessage: 'Timeout error from bot' });
                    if (res[0].isSuccess === true)
                        socket.broadcast.to(userData.url).emit('filters-update', res[0].payload);
                    callback(res[0]);
                });
        });

        socket.on('disable-filter', async (arg, callback) => {
            let userData = await readSocketHandshake(socket.handshake.headers);
            socket
                .to(process.env.CLIENT_ID)
                .timeout(1000)
                .emit('bot-disable-filter', { guildId: userData.url, filter: arg }, (err, res) => {
                    if (err) return callback({ isSuccess: false, error: true, errorMessage: 'Timeout error from bot' });
                    if (res[0].isSuccess === true)
                        socket.broadcast.to(userData.url).emit('filters-update', res[0].payload);
                    callback(res[0]);
                });
        });

        socket.on('bot-queue-connection-update', (arg) => {
            socket.to(arg).timeout(1000).emit('queue-connection-update');
        });

        socket.on('bot-now-playing', (arg) => {
            socket.to(arg.guildId).timeout(1000).emit('now-playing', `${arg.title.title} by ${arg.title.author}`);
        });
    });
}
