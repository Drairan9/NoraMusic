const socket = io('ws://localhost:3000');

console.log('Connecting...');

socket.on('connect', () => {
    socket.emit('server-hello', (response) => {
        if (!response.isSuccess) return console.log('Server declined connection. Error: ' + response.errorMessage);
        console.log('Connected');
        SnackBar({
            status: 'success',
            message: 'Connected',
        });

        if (!response.payload.queue) console.log('Bot is not connected to voice channel.');
        console.log(response.payload);
        SnackBar({
            status: 'warning',
            message: 'Bot is not connected to voice channel.',
        });

        if (response.payload.filters) {
            response.payload.filters.forEach((filter) => {
                createFilter(filter.filter, filter.state);
            });
        }
    });
});

socket.on('now-playing', (trackName) => {
    setNowPlaying(trackName);
    console.log(trackName);
});

socket.on('queue-update', (trackList) => {
    queueClearList();
    trackList.forEach((track, index) => {
        createQueueElement(track.author, track.title, track.thumbnail, index.toString());
    });
});

socket.on('loop-update', (mode) => {});

socket.on('filter-update', (filterList) => {
    updateFilters(filterList.filters);
});
