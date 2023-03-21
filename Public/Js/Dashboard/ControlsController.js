document.querySelector('#play-pause').addEventListener('click', () => emitServer.playPause());

document.querySelector('#skip-back').addEventListener('click', () => emitServer.skipBack());

document.querySelector('#skip-forward').addEventListener('click', () => emitServer.skipForward());

document.querySelector('#shuffle').addEventListener('click', () => emitServer.shuffle());

document.querySelector('#queue-stop').addEventListener('click', () => emitServer.queueStop());

document.querySelectorAll('#repeat').forEach((button) => {
    let repeatType = button.dataset.repeatType;
    button.addEventListener('click', () => {
        emitServer.setRepeatMode(repeatType);
    });
});

function setPlayStatus(status) {
    let button = document.querySelector('#play-pause');
    // 0 - paused | 1 - playing (status)
    if (status) {
        //set paused
        button.innerHTML = '<ion-icon name="pause-sharp"></ion-icon>';
    } else {
        //set playing
        button.innerHTML = '<ion-icon name="play-sharp"></ion-icon>';
    }
    console.log(`PlayPause STATUS: ${status}`);
}
