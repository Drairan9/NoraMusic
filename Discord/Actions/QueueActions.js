import { emitClient } from '#Socket';
import { QueueRepeatMode } from 'discord-player';

export default class Queue {
    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return String with song title / false => error / null => not playing
     */
    static getNowPlaying(client, guildId) {
        const queue = client.player.nodes.get(guildId);
        const queueStatus = !queue ? false : true;
        if (!queueStatus) return false;

        if (!queue.currentTrack) {
            return null;
        } else {
            return queue.currentTrack;
        }
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return Array with queued tracks
     */
    static getQueue(client, guildId) {
        const queue = client.player.nodes.get(guildId);
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
        const queue = client.player.nodes.get(guildId);
        return !queue ? false : true;
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return {Number} Repeat mode
     */
    static getRepeatMode(client, guildId) {
        const queue = client.player.nodes.get(guildId);
        if (!queue || !queue.node.isPlaying()) return false;
        return queue.repeatMode;
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return true - success
     */
    static playPauseSong(client, guildId) {
        const queue = client.player.nodes.get(guildId);
        if (!queue) return false;
        queue.node.isPaused() ? queue.node.resume() : queue.node.pause();
        emitClient.playPause(guildId, !queue.node.isPaused());
        return true;
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return true = paused / false = playing
     */
    static isPaused(client, guildId) {
        const queue = client.player.nodes.get(guildId);
        if (!queue) return false;
        return queue.node.isPaused();
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return true - success
     */
    static skipForward(client, guildId) {
        const queue = client.player.nodes.get(guildId);
        if (!queue || !queue.node.isPlaying()) return false;

        const success = queue.node.skip();

        return success ? true : false;
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return true - success
     */
    static async skipBack(client, guildId) {
        const queue = client.player.nodes.get(guildId);
        if (!queue || !queue.node.isPlaying()) return false;

        if (queue.history.previousTrack == null) {
            return false;
        }

        try {
            await queue.history.previous();
            return true;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @param {Boolean} broadcast Is operation should be broadcasted to ws room
     * @return true - success
     */
    static async shuffleQueue(client, guildId, broadcast) {
        const queue = client.player.nodes.get(guildId);
        if (!queue) return false;

        await queue.tracks.shuffle();
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
        const queue = client.player.nodes.get(guildId);
        let modeName;
        let res;
        if (!queue || !queue.node.isPlaying()) return false;

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

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @param {Boolean} broadcast Is operation should be broadcasted to ws room
     * @return true - success
     */
    static async queueStop(client, guildId) {
        const queue = client.player.nodes.get(guildId);
        if (!queue) return false;

        queue.delete();
        return true;
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @param {Number} index
     * @return true - success
     */
    static async queueJumpto(client, guildId, index) {
        const queue = client.player.nodes.get(guildId);
        if (!queue) return false;

        await queue.node.jump(parseInt(index));
        return true;
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @param {Number} index
     * @return true - success
     */
    static async queueRemove(client, guildId, index) {
        const queue = client.player.nodes.get(guildId);
        if (!queue) return false;

        await queue.node.remove(parseInt(index));
        return true;
    }
}
