const socket = io(`ws://${document.location.host}`);

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

        if (response.payload.playingStatus) {
            console.log(response.payload.playingStatus);
            setPlayStatus(response.payload.playingStatus);
        }
    });
});

socket.on('now-playing', (trackName) => {
    if (trackName === null) return setNowPlaying('');

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

socket.on('play-pause', (state) => {
    setPlayStatus(state);
});

class emitServer {
    static updateFilter(filterId, enabled) {
        socket.emit('update-filter', { filter: filterId, enabled: enabled });
    }

    static playPause() {
        socket.emit('play-pause', (response) => {
            if (!response) {
                SnackBar({
                    status: 'error',
                    message: 'Error',
                });
            } else {
                SnackBar({
                    status: 'success',
                    message: 'Success',
                });
            }
        });
    }

    static skipBack() {
        console.log('back');
        socket.emit('skip-back', (response) => {
            if (!response) {
                SnackBar({
                    status: 'error',
                    message: 'Error',
                });
            } else {
                SnackBar({
                    status: 'success',
                    message: 'Success',
                });
            }
        });
    }

    static skipForward() {
        console.log('forward');
        socket.emit('skip-forward', (response) => {
            if (!response) {
                SnackBar({
                    status: 'error',
                    message: 'Error',
                });
            } else {
                SnackBar({
                    status: 'success',
                    message: 'Success',
                });
            }
        });
    }
}
