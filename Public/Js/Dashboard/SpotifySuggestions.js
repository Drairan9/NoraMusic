const API_URL = `${document.location.origin}/api/spotify`;

if (document.querySelector('.recommendations-list')) renderSpotifySuggestions();

function renderSpotifySuggestions() {
    axios
        .get(API_URL)
        .then((response) => {
            clearSpotifyList();
            response.data.forEach((song) => {
                renderSpotifyElement(song.cover, song.title, song.artists, song.url);
            });
            setBacklight();
        })
        .catch((error) => {
            console.log(error);
        });
}

function renderSpotifyElement(thumbnail, title, author, url) {
    const mainList = document.querySelector('.recommendations-list');
    let li = _createElement('li', { class: 'recommendations-element' });

    let img = _createElement('img', {
        class: 'recommendations-element-img',
        src: thumbnail,
        alt: 'Spotify cover',
    });

    let textDiv = _createElement('div', { class: 'recommendations-element-text-wrapper' });
    let titleHeader = _createElement('h4', { title: title, class: 'recommendations-element-title' }, title);
    let authorSpan = _createElement('span', { class: 'recommendations-element-authors' }, author);
    _appendChilds(textDiv, [titleHeader, authorSpan]);

    _appendChilds(li, [img, textDiv]);

    _addSpotifyEventListener(li, url);
    mainList.appendChild(li);
}

function clearSpotifyList() {
    document.querySelector('.recommendations-list').innerHTML = '';
}

function _addSpotifyEventListener(element, url) {
    element.addEventListener('click', () => {
        emitServer.addSong(url);
    });
}

function setBacklight() {
    let elementsArray = document.querySelectorAll('.recommendations-element');
    let targetSize = 0;
    elementsArray.forEach((element) => {
        if (element.offsetWidth > targetSize) {
            targetSize = element.offsetWidth;
        }
    });

    elementsArray.forEach((element) => {
        element.style.width = `${targetSize + 10}px`;
    });
}
