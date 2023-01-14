import { emitClient } from '#Socket';
import { QueueRepeatMode } from 'discord-player';

export default class Queue {
    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return String with song title / false => error / null => not playing
     */
    static getNowPlaying(client, guildId) {
        const queue = client.player.getQueue(guildId);
        const queueStatus = !queue ? false : true;
        if (!queueStatus) return false;

        if (!queue.current) {
            return null;
        } else {
            return `${queue.current.title} by ${queue.current.author}`;
        }
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return Array with queued tracks
     */
    static getQueue(client, guildId) {
        const queue = client.player.getQueue(guildId);
        const queueStatus = !queue ? false : true;
        if (!queueStatus) return false;

        return queue.tracks;
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return Array with queued tracks
     */
    static isQueueExist(client, guildId) {
        const queue = client.player.getQueue(guildId);
        return !queue ? false : true;
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return {Number} Repeat mode
     */
    static getRepeatMode(client, guildId) {
        const queue = client.player.getQueue(guildId);
        if (!queue || !queue.playing) return false;
        return queue.repeatMode;
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return true - success
     */
    static playPauseSong(client, guildId) {
        const queue = client.player.getQueue(guildId);
        if (!queue || !queue.playing) return false;
        queue.connection.paused ? queue.setPaused(false) : queue.setPaused(true);
        return true;
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return true - success
     */
    static nextSong(client, guildId) {
        const queue = client.player.getQueue(guildId);
        if (!queue || !queue.playing) return false;

        const success = queue.skip();

        return success ? true : false;
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return true - success
     */
    static perviousSong(client, guildId) {
        const queue = client.player.getQueue(guildId);
        if (!queue || !queue.playing) return false;

        if (queue.previousTracks.length > 1) {
            queue.back();
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @param {Boolean} broadcast Is operation should be broadcasted to ws room
     * @return true - success
     */
    static async shuffleQueue(client, guildId, broadcast) {
        const queue = client.player.getQueue(guildId);
        if (!queue || !queue.playing) return false;

        await queue.shuffle();
        if (broadcast) emitClient.queueUpdate(guildId, queue.tracks);
        return true;
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @param {Number} mode 0 = OFF, 1 = TRACK, 2 = QUEUE, 3 = AUTOPLAY
     * @param {Boolean} broadcast Is operation should be broadcasted to ws room
     * @return {Object} {success: boolean, errorMessage: string}
     */
    static async loopQueue(client, guildId, mode, broadcast) {
        const queue = client.player.getQueue(guildId);
        let modeName;
        let res;
        if (!queue || !queue.playing) return false;

        switch (mode) {
            case 0:
                modeName = 'Off';
                res = await queue.setRepeatMode(QueueRepeatMode.OFF);
                break;
            case 1:
                modeName = 'Track';
                res = await queue.setRepeatMode(QueueRepeatMode.TRACK);
                break;
            case 2:
                modeName = 'Queue';
                res = await queue.setRepeatMode(QueueRepeatMode.QUEUE);
                break;
            case 3:
                modeName = 'Autoplay';
                res = await queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                break;
            default:
                modeName = null;
                return { success: false, errorMessage: 'Mode out of range.' };
        }
        if (broadcast) emitClient.loopUpdate(guildId, mode);
        return { success: true, errorMessage: '' };
    }
}
