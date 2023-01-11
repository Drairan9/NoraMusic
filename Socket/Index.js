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
            let legalGuilds = await isInGuild(userData.discord_id, userData.url);
            if (legalGuilds.length <= 0) {
                try {
                    callback({ isSuccess: false, errorMessage: 'Illegal guild', payload: '' });
                    return socket.disconnect(0);
                } catch (err) {
                    logger.error(err);
                    socket.disconnect(0);
                }
            }
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
                        payload: false,
                    });
                } else {
                    let nowPlaying = queueActions.getNowPlaying(client, userData.url);
                    let filters = filterActions.getQueueFilters(client, userData.url);
                    let queueList = queueActions.getQueue(client, userData.url);

                    return callback({
                        isSuccess: true,
                        errorMessage: '',
                        payload: { nowPlaying, filters, queueList },
                    });
                }
            } catch (err) {
                logger.error(err);
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
}
