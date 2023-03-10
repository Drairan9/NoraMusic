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

        if (!response.payload.queue) {
            SnackBar({
                status: 'warning',
                message: 'Bot is not connected to voice channel.',
            });
        }

        if (response.payload.filters) {
            clearFilters();
            response.payload.filters.forEach((filter) => {
                createFilter(filter.filter, filter.state);
            });
            console.log('Generated filters.');
        }

        if (response.payload.nowPlaying) {
            setNowPlaying(response.payload.nowPlaying);
            console.log(response.payload.nowPlaying);
        }

        if (response.payload.queueList) {
            queueClearList();
            response.payload.queueList.forEach((track, index) => {
                createQueueElement(track.author, track.title, track.thumbnail, index.toString());
            });
        }
    });
});

socket.on('now-playing', (trackName) => {
    if (trackName === null) setNowPlaying('');

    setNowPlaying(trackName.title);
});

socket.on('queue-update', (trackList) => {
    queueClearList();
    trackList.forEach((track, index) => {
        createQueueElement(track.author, track.title, track.thumbnail, index.toString());
    });
});

socket.on('loop-update', (mode) => {});

socket.on('filter-update', (filterList) => {
    updateFilters(filterList);
});
