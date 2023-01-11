const socket = io('ws://localhost:3000');

console.log('Connecting...');

socket.on('connect', () => {
    socket.emit('server-hello', (response) => {
        if (response.error) return console.log('Server declined connection. Error: ' + response.errorMessage);
        console.log('Connected');
        if (!response.payload) return console.log('Bot is not connected to voice channel.');
        nowPlaying(response.payload.nowPlaying);

        clearPlaylist();
        let i = 0;
        response.payload.queueList.forEach((track) => {
            createSongInPlaylist(i, track.title);
            i++;
        });
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
