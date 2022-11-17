const socket = io('ws://localhost:3000');

console.log('Connecting...');

socket.on('connect', () => {
    socket.emit('server-hello', (response) => {
        if (response.error) return console.log('Server declined connection. Error: ' + response.errorMessage);
        console.log('Connected');
        socket.emit('fetch-all-data', (response) => {
            console.log(response);
            if (!response.payload.botQueue) console.log('Bot is not in voice channel');
            response.payload.filters.forEach((filter) => {
                createAudioFilter(filter.filter, filter.state);
            });
            nowPlaying(response.payload.nowPlaying ? response.payload.nowPlaying : 'Nothing');

            if (response.payload.queue) {
                response.payload.queue.forEach((track, index) => {
                    createSongInPlaylist(index, track.title);
                });
                createSongInPlaylist(response.payload.queue.length, `Total: ${response.payload.queueLength}`);
            }
        });
    });
});

socket.on('filters-update', (res) => updateFilters(res));

socket.on('new-track', (res) => {
    nowPlaying(res.title ? res.title : 'Nothing');
    clearPlaylist();
    console.log(res.queue.length);
    res.queue.forEach((track, index) => {
        createSongInPlaylist(index, track.title);
    });
    createSongInPlaylist(response.payload.queue.length, `Total: ${response.payload.queueLength}`);
});

socket.on('queue-connection-update', () => {
    console.log('Need to update dashboard info!');
    socket.emit('fetch-all-data', (response) => {
        console.log(response.payload);
        updateFilters(response.payload.filters);
        nowPlaying(response.payload.nowPlaying ? response.payload.nowPlaying : 'Nothing');
        clearPlaylist();
        if (response.payload.queue) {
            response.payload.queue.forEach((track, index) => {
                createSongInPlaylist(index, track.title);
            });
            createSongInPlaylist(response.payload.queue.length, `Total: ${response.payload.queueLength}`);
        } else {
            console.log('no queue err');
        }
    });
});

function controlFilter(name, state) {
    if (state === null) return;

    state
        ? socket.emit('enable-filter', name, (response) => {
              if (!response.isSuccess) {
                  console.log(response.errorMessage);
                  document.querySelector(`[data-filter-id='${name}']`).checked = false;
              }
          })
        : socket.emit('disable-filter', name, (response) => {
              if (!response.isSuccess) {
                  console.log(response.errorMessage);
                  document.querySelector(`[data-filter-id='${name}']`).checked = false;
              }
          });
}

function updateFilters(array) {
    array.forEach((filter) => {
        let filterElem = document.querySelector(`[data-filter-id='${filter.filter}']`);
        if (!filterElem) return;

        filterElem.checked = filter.state;

        if (filter.state === null) {
            if (!filterElem.classList.contains('filter-checkbox-inactive')) {
                filterElem.classList.add('filter-checkbox-inactive');
            }
        } else {
            if (filterElem.classList.contains('filter-checkbox-inactive')) {
                filterElem.classList.remove('filter-checkbox-inactive');
            }
        }
    });
}
