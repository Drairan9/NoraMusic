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
}
