const socket = io('ws://localhost:3000');

socket.on('connect', () => {
    socket.emit('server-hello', (response) => {
        if (response.error) return console.log('Server declined connection. Error: ' + response.errorMessage);
        console.log('Connected');
    });
});

socket.on('track-add', (res) => {
    console.log(res);
});
