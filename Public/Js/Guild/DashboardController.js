function hamburger() {
    let hamburger = document.querySelector('.hamburger');
    let sidebar = document.querySelector('.side-navbar');

    if (hamburger.getAttribute('data-status') === 'closed') {
        hamburger.classList.add('hamburger-open');
        hamburger.setAttribute('data-status', 'open');
        sidebar.classList.add('side-navbar-unfolded');
        sidebar.classList.remove('side-navbar-folded');
    } else {
        hamburger.classList.remove('hamburger-open');
        hamburger.setAttribute('data-status', 'closed');
        sidebar.classList.remove('side-navbar-unfolded');
        sidebar.classList.add('side-navbar-folded');
    }
}

function foldBlock(id, icon) {
    let block = document.querySelector(`#${id}`);
    if (block.getAttribute('data-status') === 'closed') {
        // OPEN
        block.classList.remove('block-content-folded');
        block.classList.add('block-content-unfolded');
        block.setAttribute('data-status', 'open');
        icon.style.rotate = '180deg';
    } else {
        // CLOSE
        block.classList.remove('block-content-unfolded');
        block.classList.add('block-content-folded');
        block.setAttribute('data-status', 'closed');
        icon.style.rotate = '0deg';
    }
}

function unfoldAll(width) {
    if (width.matches) {
        let blocks = document.querySelectorAll('.block-content-folded');
        blocks.forEach((block) => {
            if (block.getAttribute('data-status') === 'closed') {
                // OPEN
                block.classList.remove('block-content-folded');
                block.classList.add('block-content-unfolded');
                block.setAttribute('data-status', 'open');
            } else {
                // CLOSE
                block.classList.remove('block-content-unfolded');
                block.classList.add('block-content-folded');
                block.setAttribute('data-status', 'closed');
            }
        });
    }
}

let screenWidth = window.matchMedia('(min-width: 1024px)');
unfoldAll(screenWidth);
screenWidth.addListener(unfoldAll);

function createAudioFilter(name, state) {
    let li = document.createElement('li');
    li.textContent = name;

    let input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = state;
    input.setAttribute('data-filter-id', name);
    input.setAttribute('onclick', `controlFilter('${name}', this.checked)`);
    if (state === null) input.classList.add('filter-checkbox-inactive');

    li.appendChild(input);

    document.querySelector('.audio-filters-list').appendChild(li);
}

createSuggestedSong(
    'https://i.ytimg.com/vi/LsROcBEyKGI/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBCDJnibWX94hlPOhzhBZ2zN6rxBg',
    'Slip on a Banana Clip',
    '2:17'
);

function createSuggestedSong(thumbnailUrl, title, time) {
    let li = document.createElement('li');

    let thumbnailDiv = document.createElement('div');
    thumbnailDiv.style.backgroundImage = `url(${thumbnailUrl})`;
    thumbnailDiv.classList.add('thumbnail');
    thumbnailDiv.setAttribute('data-time', time);
    li.appendChild(thumbnailDiv);

    let titleDiv = document.createElement('div');
    titleDiv.classList.add('suggested-title');
    titleDiv.textContent = title;
    li.appendChild(titleDiv);

    document.querySelector('.suggested-list').appendChild(li);
}

createSongInPlaylist('0', 'Song title');

function createSongInPlaylist(index, title) {
    let li = document.createElement('li');

    let indexDiv = document.createElement('div');
    indexDiv.classList.add('playlist-song-index');
    indexDiv.textContent = index;
    li.appendChild(indexDiv);

    let titleDiv = document.createElement('div');
    titleDiv.classList.add('playlist-song-title');
    titleDiv.textContent = title;
    li.appendChild(titleDiv);

    let controlsDiv = document.createElement('div');
    controlsDiv.classList.add('playlist-song-controls');
    li.appendChild(controlsDiv);

    let ionClose = document.createElement('ion-icon');
    ionClose.setAttribute('name', 'close-outline');
    controlsDiv.appendChild(ionClose);

    let ionPlay = document.createElement('ion-icon');
    ionPlay.setAttribute('name', 'play-outline');
    controlsDiv.appendChild(ionPlay);

    document.querySelector('.playlist-list').appendChild(li);
}

function nowPlaying(title) {
    document.querySelector('.now-playing-title').textContent = title;
}
