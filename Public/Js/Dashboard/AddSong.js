document.querySelector('.input-button').addEventListener('click', async () => {
    let query = document.querySelector('.input-core').value;

    if (!query) {
        return SnackBar({
            status: 'Error',
            message: 'Provide song input',
        });
    }
    await emitServer
        .addSong(query)
        .then(() => {
            clearPrompt();
        })
        .catch((err) => {
            console.error(err);
        });
});

function clearPrompt() {
    document.querySelector('.input-core').value = '';
}
