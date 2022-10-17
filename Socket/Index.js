import { Server } from 'socket.io';
import Session from '#Models/SessionModel.js';
import { parseCookieString, readConnectSid, isAuthenticated } from '#Utils/Middlewares.js';
var io;

export default function createSocket(server) {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log(`User connected ${socket.id}`);

        socket.on('message', async (args, callback) => {
            //console.log(socket.handshake.headers);
            var requestCookies = socket.handshake.headers.cookie;

            let clientSid = readConnectSid(parseCookieString(requestCookies).get('connect.sid'));

            let DbSessionCookie = await Session.findBySid(clientSid);

            DbSessionCookie = JSON.parse(DbSessionCookie.sid);

            let uId = DbSessionCookie.passport.user;

            console.log(uId);
            try {
                callback('Success');
            } catch (e) {
                console.log('Callback removed');
            }
        });

        socket.on('play-song', async (arg, callback) => {
            var requestCookies = socket.handshake.headers.cookie;
            let requestUrl = socket.handshake.headers.referer.split('/');
            let clientSid = readConnectSid(parseCookieString(requestCookies).get('connect.sid'));
            let DbSessionCookie = await Session.findBySid(clientSid);
            DbSessionCookie = JSON.parse(DbSessionCookie.sid);
            let uId = DbSessionCookie.passport.user;
            socket.broadcast.emit('bot-play-song', { uId, url: arg, guildId: requestUrl[requestUrl.length - 1] });
            console.log('Play song');
            try {
                callback('No errors');
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        });

        socket.on('join-vc', async (arg, callback) => {
            var requestCookies = socket.handshake.headers.cookie;
            let requestUrl = socket.handshake.headers.referer.split('/');
            let clientSid = readConnectSid(parseCookieString(requestCookies).get('connect.sid'));
            let DbSessionCookie = await Session.findBySid(clientSid);
            DbSessionCookie = JSON.parse(DbSessionCookie.sid);
            let uId = DbSessionCookie.passport.user;
            socket.broadcast.emit('bot-join-vc', { uId, guildId: requestUrl[requestUrl.length - 1] });
            try {
                callback('No errors');
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        });
    });

    io.on('disconnect', (socket) => {
        console.log(`User disconnected ${socket.id}`);
    });
}
