function createQueueElement(author, title, thumbnail, index) {
    const mainList = document.querySelector('.queue-list');

    let li = _createElement('li', { class: 'queue-item' });
    let spanTitle = _createElement('span', { class: 'queue-item-index' }, index);
    let img = _createElement('img', {
        class: 'queue-item-image',
        src: thumbnail,
        alt: 'Song thumbnail',
    });

    let textDiv = _createElement('div', { class: 'queue-item-text-wrapper' });
    let songTitle = _createElement('h4', { class: 'queue-item-title' }, title);
    let songArtist = _createElement('span', { class: 'queue-item-artist' }, author);
    _appendChilds(textDiv, [songTitle, songArtist]);

    let controlsDiv = _createElement('div', { class: 'queue-item-controls' });
    let buttonRemove = _createElement('button', { class: 'queue-item-button' }, 'Remove');
    let buttonJump = _createElement('button', { class: 'queue-item-button' }, 'Jump to');
    _appendChilds(controlsDiv, [buttonRemove, buttonJump]);

    _appendChilds(li, [spanTitle, img, textDiv, controlsDiv]);
    mainList.appendChild(li);
}

function queueClearList() {
    const mainList = document.querySelector('.queue-list');
    mainList.innerHTML = '';
}

function queueNowPlaying() {
    let nowPlaying = document.querySelector('.now-playing-title');
    createQueueElement(nowPlaying.dataset.author, nowPlaying.dataset.title, nowPlaying.dataset.thumbnail, 'NP');
}

function setRepeatMode(type) {
    // 0 = OFF, 1 = TRACK, 2 = QUEUE, 3 = AUTOPLAY
    let queue = document.querySelector('.queue-container');
    switch (parseInt(type)) {
        case 0:
            _clearQueueBlock();
            break;
        case 1:
            _clearQueueBlock();
            queue.classList.add('queue-loop-one');
            break;
        case 2:
            _clearQueueBlock();
            queue.classList.add('queue-loop-all');
            break;
        default:
            _clearQueueBlock();
            break;
    }
}

function _clearQueueBlock() {
    let queue = document.querySelector('.queue-container');
    queue.classList.remove('queue-loop-all');
    queue.classList.remove('queue-loop-one');
}
