import filterActions from '#Discord/Actions/FilterActions.js';
import { emitClient } from '#Socket';

export const registerPlayerEvents = (player) => {
    player.events.on('connection', (queue, connection) => {
        emitClient.filtersUpdate(queue.guild.id, filterActions.getQueueFilters(player.client, queue.guild.id));
        console.log('Connection created!');
    });

    player.events.on('disconnect', (queue, connection) => {
        console.log('Bot disconnected!');
        emitClient.nowPlaying(queue.guild.id, null);
        emitClient.queueUpdate(queue.guild.id, queue.tracks);
        emitClient.playPause(queue.guild.id, false);
    });

    player.events.on('playerError', (queue, connection) => {
        console.log('Connection error!', connection);
    });

    player.events.on('emptyQueue', (queue, connection) => {
        emitClient.queueUpdate(queue.guild.id, queue.tracks);
        emitClient.nowPlaying(queue.guild.id, null);
        emitClient.filtersUpdate(queue.guild.id, filterActions.getQueueFilters(player.client, queue.guild.id));
        emitClient.playPause(queue.guild.id, false);
        console.log('End of queue!');
    });

    player.events.on('audioTrackAdd', (queue, track) => {
        emitClient.queueUpdate(queue.guild.id, queue.tracks);
        console.log(`Added track ${track}`);
    });

    player.events.on('audioTrackRemove', (queue, track) => {
        emitClient.queueUpdate(queue.guild.id, queue.tracks);
        console.log(`Removed track ${track}`);
    });

    player.events.on('playerStart', (queue, track) => {
        emitClient.nowPlaying(queue.guild.id, track);
        emitClient.queueUpdate(queue.guild.id, queue.tracks);
        emitClient.playPause(queue.guild.id, true);
        console.log(`Started track ${track}`);
    });
};
