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
            queueClearList();
            setNowPlaying('');
            setPlayStatus(0);
            setRepeatMode(0);
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
            setNowPlaying(response.payload.nowPlaying.title);
            setNowPlayingMetadata(
                response.payload.nowPlaying.title,
                response.payload.nowPlaying.author,
                response.payload.nowPlaying.thumbnail
            );
        }

        if (response.payload.queueList) {
            queueClearList();
            queueNowPlaying();
            response.payload.queueList.forEach((track, index) => {
                createQueueElement(track.author, track.title, track.thumbnail, index.toString());
            });
        }

        if (response.payload.playingStatus) {
            setPlayStatus(response.payload.playingStatus);
        }

        if (response.payload.repeatMode) {
            setRepeatMode(response.payload.repeatMode);
        }
    });
});

socket.on('now-playing', (trackName) => {
    if (trackName === null) return setNowPlaying('');

    setNowPlaying(trackName.title);
    setNowPlayingMetadata(trackName.title, trackName.author, trackName.thumbnail);
});

socket.on('queue-update', (trackList) => {
    queueClearList();
    queueNowPlaying();
    trackList.forEach((track, index) => {
        console.log(track);
        createQueueElement(track.author, track.title, track.thumbnail, index.toString());
    });
});

socket.on('loop-update', (mode) => {
    setRepeatMode(mode);
});

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
            this.displayResponse(response);
        });
    }

    static skipBack() {
        console.log('back');
        socket.emit('skip-back', (response) => {
            this.displayResponse(response);
        });
    }

    static skipForward() {
        console.log('forward');
        socket.emit('skip-forward', (response) => {
            this.displayResponse(response);
        });
    }

    static shuffle() {
        socket.emit('shuffle', (response) => {
            this.displayResponse(response);
        });
    }

    static queueStop() {
        socket.emit('queue-stop', (response) => {
            this.displayResponse(response);
        });
    }

    static setRepeatMode(mode) {
        socket.emit('set-repeat-mode', mode, (response) => {
            this.displayResponse(response);
        });
    }

    static jumpTo(index) {
        socket.emit('jump-to', index, (response) => {
            this.displayResponse(response);
        });
    }

    static remove(index) {
        socket.emit('remove', index, (response) => {
            this.displayResponse(response);
        });
    }

    static async addSong(url) {
        return new Promise((resolve, reject) => {
            socket.emit('add-song', url, (response) => {
                if (!response) {
                    SnackBar({
                        status: 'error',
                        message: 'Error',
                    });
                    reject();
                } else {
                    SnackBar({
                        status: 'success',
                        message: 'Success',
                    });
                    resolve();
                }
            });
        });
    }

    static displayResponse(response) {
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
    }
}
