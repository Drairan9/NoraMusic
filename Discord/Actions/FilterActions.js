import { FILTERS } from '#Utils/Constants.js';

export default class filterActions {
    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     * @return Array with object {name, status} or null when queue is undefinied
     */
    static getQueueFilters(client, guildId) {
        let queueStatus = !client.player.getQueue(guildId) ? false : true;
        if (!queueStatus) {
            let outputArray = [];
            FILTERS.forEach((filter) => {
                outputArray.push({ filter: filter, state: null });
            });
            return outputArray;
        }

        let queue = client.player.createQueue(guildId);
        let enabledFilters = queue.getFiltersEnabled();
        let filtersOutputArray = [];

        FILTERS.forEach((filter) => {
            // prettier-ignore
            enabledFilters.includes(filter) ? filtersOutputArray.push({ filter: filter, state: true }) : filtersOutputArray.push({ filter: filter, state: false });
        });
        return filtersOutputArray;
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     */
    static async enableFilter(client, guildId, filter) {
        if (!FILTERS.includes(filter)) return { isSuccess: false, errorMessage: 'Bad filter name.', payload: '' };
        let queueStatus = !client.player.getQueue(guildId) ? false : true;
        if (!queueStatus) return { isSuccess: false, errorMessage: 'Queue is not created.', payload: '' };

        let queue = client.player.createQueue(guildId);
        let enabledFilters = queue.getFiltersEnabled();
        if (enabledFilters.includes(filter)) return { isSuccess: true, errorMessage: '', payload: '' };

        enabledFilters.push(filter);
        await queue.setFilters(
            enabledFilters.reduce(function (acc, cur) {
                acc[cur] = true;
                return acc;
            }, {})
        );
        return { isSuccess: true, errorMessage: '', payload: { filters: this.getQueueFilters(client, guildId) } };
    }

    /**
     * @param {DiscordClient} client
     * @param {String} guildId
     */
    static async disableFilter(client, guildId, filter) {
        if (!FILTERS.includes(filter)) return { isSuccess: false, errorMessage: 'Bad filter name', payload: '' };
        let queueStatus = !client.player.getQueue(guildId) ? false : true;
        if (!queueStatus) return false;

        let queue = client.player.createQueue(guildId);
        let enabledFilters = queue.getFiltersEnabled();
        if (!enabledFilters.includes(filter))
            return { isSuccess: true, errorMessage: '', payload: { filters: this.getQueueFilters(client, guildId) } };

        let index = enabledFilters.indexOf(filter);

        if (index > -1) enabledFilters.splice(index, 1);
        if (enabledFilters.length === 0) {
            queue.setFilters({ filter: false });
            return { isSuccess: true, errorMessage: '', payload: { filters: this.getQueueFilters(client, guildId) } };
        }

        await queue.setFilters(
            enabledFilters.reduce(function (acc, cur) {
                acc[cur] = true;
                return acc;
            }, {})
        );
        return { isSuccess: true, errorMessage: '', payload: { filters: this.getQueueFilters(client, guildId) } };
    }
}
