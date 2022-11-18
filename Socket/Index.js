import { Server } from 'socket.io';
import { readSocketHandshake } from '#Utils/Middlewares.js';
import { isInGuild } from '#Services/UserService.js';
import logger from '#Utils/Logger.js';

let io;

export default function createSocket(server) {
    io = new Server(server, {
        maxHttpBufferSize: 2e6, // 4Mb
    });

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

        socket.on('bot-new-track', (arg) => {
            socket
                .to(arg.guildId)
                .timeout(1000)
                .emit('new-track', { title: `${arg.title.title} by ${arg.title.author}`, queue: arg.queue });
        });

        socket.on('control-song', async (arg, callback) => {
            if (!['play-pause', 'pervious-song', 'next-song'].includes(arg.option)) {
                return callback({ isSuccess: false, error: true, errorMessage: 'Unknown option.' });
            }
            let userData = await readSocketHandshake(socket.handshake.headers);
            socket
                .to(process.env.CLIENT_ID)
                .timeout(1000)
                .emit('bot-control-song', { guildId: userData.url, option: arg.option }, (err, res) => {
                    if (err) return callback({ isSuccess: false, error: true, errorMessage: 'Timeout error from bot' });
                    callback(res[0]);
                });
        });

        // socket.on('stop-playing', async (arg, callback) => {
        //     let userData = await readSocketHandshake(socket.handshake.headers);
        //     socket
        //         .to(process.env.CLIENT_ID)
        //         .timeout(1000)
        //         .emit('bot-stop-playing', { guildId: userData.url }, (err, res) => {
        //             if (err) return callback({ isSuccess: false, error: true, errorMessage: 'Timeout error from bot' });
        //             callback(res[0]);
        //         });
        // });

        // socket.on('repeat-song', async (arg, callback) => {
        //     let userData = await readSocketHandshake(socket.handshake.headers);
        //     socket
        //         .to(process.env.CLIENT_ID)
        //         .timeout(1000)
        //         .emit('bot-repeat-song', { guildId: userData.url }, (err, res) => {
        //             if (err) return callback({ isSuccess: false, error: true, errorMessage: 'Timeout error from bot' });
        //             callback(res[0]);
        //         });
        // });

        // socket.on('shuffle-queue', async (arg, callback) => {
        //     let userData = await readSocketHandshake(socket.handshake.headers);
        //     socket
        //         .to(process.env.CLIENT_ID)
        //         .timeout(1000)
        //         .emit('bot-shuffle-queue', { guildId: userData.url }, (err, res) => {
        //             if (err) return callback({ isSuccess: false, error: true, errorMessage: 'Timeout error from bot' });
        //             callback(res[0]);
        //         });
        // });

        // socket.on('play-pause', async (arg, callback) => {
        //     let userData = await readSocketHandshake(socket.handshake.headers);
        //     socket
        //         .to(process.env.CLIENT_ID)
        //         .timeout(1000)
        //         .emit('bot-play-pause', { guildId: userData.url }, (err, res) => {
        //             if (err) return callback({ isSuccess: false, error: true, errorMessage: 'Timeout error from bot' });
        //             callback(res[0]);
        //         });
        // });

        // socket.on('previous-song', async (arg, callback) => {
        //     let userData = await readSocketHandshake(socket.handshake.headers);
        //     socket
        //         .to(process.env.CLIENT_ID)
        //         .timeout(1000)
        //         .emit('bot-previous-song', { guildId: userData.url }, (err, res) => {
        //             if (err) return callback({ isSuccess: false, error: true, errorMessage: 'Timeout error from bot' });
        //             callback(res[0]);
        //         });
        // });

        // socket.on('next-song', async (arg, callback) => {
        //     let userData = await readSocketHandshake(socket.handshake.headers);
        //     socket
        //         .to(process.env.CLIENT_ID)
        //         .timeout(1000)
        //         .emit('bot-next-song', { guildId: userData.url }, (err, res) => {
        //             if (err) return callback({ isSuccess: false, error: true, errorMessage: 'Timeout error from bot' });
        //             callback(res[0]);
        //         });
        // });

        // socket.on('jump-to-song', async (arg, callback) => {
        //     let userData = await readSocketHandshake(socket.handshake.headers);
        //     socket
        //         .to(process.env.CLIENT_ID)
        //         .timeout(1000)
        //         .emit('bot-jump-to-song', { guildId: userData.url, songId: arg.songId }, (err, res) => {
        //             if (err) return callback({ isSuccess: false, error: true, errorMessage: 'Timeout error from bot' });
        //             callback(res[0]);
        //         });
        // });

        // socket.on('remove-song', async (arg, callback) => {
        //     let userData = await readSocketHandshake(socket.handshake.headers);
        //     socket
        //         .to(process.env.CLIENT_ID)
        //         .timeout(1000)
        //         .emit('bot-remove-song', { guildId: userData.url, songId: arg.songId }, (err, res) => {
        //             if (err) return callback({ isSuccess: false, error: true, errorMessage: 'Timeout error from bot' });
        //             callback(res[0]);
        //         });
        // });
    });
}

/**
 * TODO: Add communication
 *  STOP  -- 50% done
 *  repeat -- 50% done
 *  shuffle -- 50% done
 *  play/pause -- 50% done
 *  previous song -- 50% done
 *  next song -- 50% done
 *  jump to song -- 50% done
 *  remove from queue -- 50% done
 *
 */
