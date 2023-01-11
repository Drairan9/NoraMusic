import { emitClient } from '#Socket';

export const registerPlayerEvents = (player) => {
    player.on('connectionCreate', (queue, connection) => {
        console.log('Connection created!');
    });

    player.on('botDisconnect', (queue, connection) => {
        emitClient.nowPlaying(queue.guild.id, null);
        emitClient.queueUpdate(queue.guild.id, queue.tracks);
        console.log('Bot disconnected!');
    });

    player.on('connectionError', (queue, connection) => {
        console.log('Connection error!', connection);
    });

    player.on('queueEnd', (queue, connection) => {
        emitClient.queueUpdate(queue.guild.id, queue.tracks);
        console.log('End of queue!');
    });

    player.on('trackAdd', (queue, track) => {
        emitClient.queueUpdate(queue.guild.id, queue.tracks);
        console.log(`Added track ${track}`);
    });

    player.on('trackStart', (queue, track) => {
        emitClient.nowPlaying(queue.guild.id, track);
        emitClient.queueUpdate(queue.guild.id, queue.tracks);
        console.log(`Started track ${track}`);
    });
};
