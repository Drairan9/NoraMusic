const socket = io('ws://localhost:3000');

console.log('Connecting...');

socket.on('connect', () => {
    socket.emit('server-hello', (response) => {
        if (!response.isSuccess) return console.log('Server declined connection. Error: ' + response.errorMessage);
        console.log('Connected');
        if (!response.payload.queue) console.log('Bot is not connected to voice channel.');
        if (response.payload.nowPlaying) nowPlaying(response.payload.nowPlaying);

        if (response.payload.queueList) {
            clearPlaylist();
            let i = 0;
            response.payload.queueList.forEach((track) => {
                createSongInPlaylist(i, track.title);
                i++;
            });
        }

        if (response.payload.filters) {
            response.payload.filters.forEach((filter) => {
                console.log(filter);
                createAudioFilter(filter.filter, filter.state);
            });
        }
    });
});

socket.on('now-playing', (trackName) => {
    console.log(trackName);
    nowPlaying(trackName.title);
});

socket.on('queue-update', (trackList) => {
    console.log(trackList);
    clearPlaylist();
    let i = 0;
    trackList.forEach((track) => {
        createSongInPlaylist(i, track.title);
        i++;
    });
});

socket.on('loop-update', (mode) => {
    console.log(`Loop mode is now ${mode}`);
});

socket.on('filter-update', (filterList) => {
    updateFilters(filterList);
});
// TODO: xd \/
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

document.querySelectorAll(`[data-action]`).forEach((button) => {
    button.addEventListener('click', () => {
        if (
            !['play-pause', 'pervious-song', 'next-song', 'shuffle-queue', 'stop-queue', 'repeat-queue'].includes(
                button.dataset.action
            )
        ) {
            return console.log('Unknown option.');
        }

        socket.emit('control-song', { option: button.dataset.action }, (response) => {
            console.log(response);
        });
    });
});
