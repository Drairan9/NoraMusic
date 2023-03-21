function setNowPlaying(title) {
    let nowPlaying = document.querySelector('.now-playing-title');
    nowPlaying.textContent = title;
}

function setNowPlayingMetadata(title, author, thumbnail) {
    let nowPlaying = document.querySelector('.now-playing-title');
    nowPlaying.dataset.title = title;
    nowPlaying.dataset.author = author;
    nowPlaying.dataset.thumbnail = thumbnail;
}
