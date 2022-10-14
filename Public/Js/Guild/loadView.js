// TODO: Refactor
const elementContainer = document.querySelector('.elements-container');
guilds = JSON.parse(guilds);

guilds.forEach((item) => {
    renderElement(item.name, item.id, item.avatarUrl);
});

function renderElement(name, id, avatarUrl) {
    // Prepare containers
    let container = document.createElement('div');
    container.classList.add('element');
    container.setAttribute('onclick', 'test(this)');
    container.setAttribute('data-serverid', id);

    let containerIcon = document.createElement('div');
    containerIcon.classList.add('element-icon');

    let containerText = document.createElement('div');
    containerText.classList.add('element-main-text-container');

    // Prepare elements
    let image = document.createElement('img');
    image.src = avatarUrl;
    image.alt = 'Server icon';

    let serverName = document.createElement('h4');
    serverName.textContent = name;

    let idText = document.createElement('h6');
    idText.classList.add('element-id');
    idText.textContent = `ID: ${id}`;

    // Construct element
    containerIcon.appendChild(image);
    containerText.appendChild(serverName);
    containerText.appendChild(idText);
    container.appendChild(containerIcon);
    container.appendChild(containerText);

    elementContainer.appendChild(container);
}

function test(data) {
    console.log(data.dataset.serverid);
    window.location.href = `guild/${data.dataset.serverid}`;
}
