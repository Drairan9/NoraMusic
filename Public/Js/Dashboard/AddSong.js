document.querySelector('.input-button').addEventListener('click', () => {
    let query = document.querySelector('.input-core').value;

    if (!query) {
        return SnackBar({
            status: 'Error',
            message: 'Provide song input',
        });
    }
    emitServer.addSong(query);
});
