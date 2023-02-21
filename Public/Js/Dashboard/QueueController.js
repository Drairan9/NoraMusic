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
