import { Server } from 'socket.io';
import { readSocketHandshake } from '#Utils/Middlewares.js';
import { isInGuild } from '#Services/UserService.js';
import logger from '#Utils/Logger.js';
import filterActions from '#Discord/Actions/FilterActions.js';
import queueActions from '#Discord/Actions/QueueActions.js';

let io;

export default function createSocket(server, client) {
    io = new Server(server, {
        maxHttpBufferSize: 2e6, // 4Mb
    });

    io.on('connection', (socket) => {
        socket.on('server-hello', async (callback) => {
            let userData = await readSocketHandshake(socket.handshake.headers);
            // Make sure that user is connecting with allowed guild
            // let legalGuilds = await isInGuild(userData.discord_id, userData.url);
            // if (legalGuilds.length <= 0) {
            //     try {
            //         callback({ isSuccess: false, errorMessage: 'Illegal guild', payload: '' });
            //         return socket.disconnect(0);
            //     } catch (err) {
            //         logger.error(err);
            //         socket.disconnect(0);
            //     }
            // }
            // Clear rooms
            socket.rooms.forEach((room) => {
                socket.leave(room);
            });
            socket.join(userData.url);
            try {
                if (!queueActions.isQueueExist(client, userData.url)) {
                    return callback({
                        isSuccess: true,
                        errorMessage: '',
                        payload: { queue: false, filters: filterActions.getQueueFilters(client, userData.url) },
                    });
                } else {
                    let nowPlaying = queueActions.getNowPlaying(client, userData.url);
                    let filters = filterActions.getQueueFilters(client, userData.url);
                    let queueList = queueActions.getQueue(client, userData.url);
                    let repeatMode = queueActions.getRepeatMode(client, userData.url);

                    return callback({
                        isSuccess: true,
                        errorMessage: '',
                        payload: { queue: true, nowPlaying, filters, queueList, repeatMode },
                    });
                }
            } catch (err) {
                logger.error(err);
            }
        });
        //TODO: error handling
        socket.on('enable-filter', async (name, callback) => {
            let userData = await readSocketHandshake(socket.handshake.headers);
            let res = await filterActions.enableFilter(client, userData.url, name);
            emitClient.filtersUpdate(userData.url, res.payload.filters);
            return callback({
                isSuccess: true,
                errorMessage: '',
                payload: '',
            });
        });
        //TODO: error handling
        socket.on('disable-filter', async (name, callback) => {
            let userData = await readSocketHandshake(socket.handshake.headers);
            let res = await filterActions.disableFilter(client, userData.url, name);
            emitClient.filtersUpdate(userData.url, res.payload.filters);
            return callback({
                isSuccess: true,
                errorMessage: '',
                payload: '',
            });
        });

        socket.on('control-song', async (option, callback) => {
            let userData = await readSocketHandshake(socket.handshake.headers);
            let res;

            switch (option.option) {
                case 'play-pause':
                    res = queueActions.playPauseSong(client, userData.url);
                    callback(res ? true : 'Something went wrong.');
                    break;
                case 'pervious-song':
                    res = queueActions.perviousSong(client, userData.url);
                    callback(res ? true : 'Something went wrong.');
                    break;
                case 'next-song':
                    res = queueActions.nextSong(client, userData.url);
                    callback(res ? true : 'Something went wrong.');
                    break;
                case 'shuffle-queue':
                    res = queueActions.shuffleQueue(client, userData.url, true);
                    callback(res ? true : 'Something went wrong.');
                    break;
                case 'stop-queue':
                    // res = queueActions.nextSong(client, userData.url);
                    // callback(res ? true : 'Something went wrong.');
                    break;
                case 'repeat-queue':
                    res = await queueActions.loopQueue(client, userData.url, 2);
                    callback(res.success ? true : res.errorMessage);
                    break;
                default:
                    callback({ isSuccess: false, error: true, errorMessage: 'Unknown option.' });
                    break;
            }
        });
    });
}

export class emitClient {
    static nowPlaying(guildId, trackName) {
        io.in(guildId).emit('now-playing', trackName);
    }

    static queueUpdate(guildId, trackList) {
        io.in(guildId).emit('queue-update', trackList);
    }

    static filtersUpdate(guildId, filterList) {
        io.in(guildId).emit('filter-update', filterList);
    }

    static loopUpdate(guildId, mode) {
        io.in(guildId).emit('loop-update', mode);
    }
}
