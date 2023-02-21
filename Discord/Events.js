import filterActions from '#Discord/Actions/FilterActions.js';
import { emitClient } from '#Socket';

export const registerPlayerEvents = (player) => {
    player.on('connectionCreate', (queue, connection) => {
        emitClient.filtersUpdate(queue.guild.id, filterActions.getQueueFilters(player.client, queue.guild.id));
        console.log('Connection created!');
    });

    player.on('botDisconnect', (queue, connection) => {
        console.log('Bot disconnected!');
        emitClient.nowPlaying(queue.guild.id, null);
        emitClient.queueUpdate(queue.guild.id, queue.tracks);
    });

    player.on('connectionError', (queue, connection) => {
        console.log('Connection error!', connection);
    });

    player.on('queueEnd', (queue, connection) => {
        emitClient.queueUpdate(queue.guild.id, queue.tracks);
        emitClient.nowPlaying(queue.guild.id, null);
        emitClient.filtersUpdate(queue.guild.id, filterActions.getQueueFilters(player.client, queue.guild.id));
        console.log('End of queue!');
    });

    player.on('trackAdd', (queue, track) => {
        emitClient.queueUpdate(queue.guild.id, queue.tracks);
        console.log(queue.tracks);
        console.log(`Added track ${track}`);
    });

    player.on('trackStart', (queue, track) => {
        emitClient.nowPlaying(queue.guild.id, track);
        emitClient.queueUpdate(queue.guild.id, queue.tracks);
        console.log(`Started track ${track}`);
    });
};
