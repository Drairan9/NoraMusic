function _addFilterListener(element) {
    element.addEventListener('change', () => {
        emitServer.updateFilter(element.getAttribute('data-filter-id'), element.checked);
    });
}

function createFilter(name, state) {
    const mainList = document.querySelector('.filters-list');

    let li = document.createElement('li');
    li.classList.add('filter-element');
    li.textContent = name;

    let input = document.createElement('input');
    input.type = 'checkbox';
    input.classList.add('filter-checkbox');
    input.checked = state;

    input.setAttribute('data-filter-id', name);
    //input.setAttribute('onclick', `controlFilter('${name}', this.checked)`);

    if (state === null) input.classList.add('filter-checkbox-inactive');

    li.appendChild(input);

    mainList.appendChild(li);
    _addFilterListener(input);
}

function clearFilters() {
    const mainList = document.querySelector('.filters-list');
    mainList.innerHTML = '';
}

function updateFiltersState(filtersArray) {
    filtersArray.forEach((filter) => {});
}

function updateFilters(array) {
    array.forEach((filter) => {
        let filterElement = document.querySelector(`[data-filter-id='${filter.filter}']`);
        if (!filterElement) return;

        filterElement.checked = filter.state;

        if (filter.state === null) {
            if (!filterElement.classList.contains('filter-checkbox-inactive')) {
                filterElement.classList.add('filter-checkbox-inactive');
            }
        } else {
            if (filterElement.classList.contains('filter-checkbox-inactive')) {
                filterElement.classList.remove('filter-checkbox-inactive');
            }
        }
    });
}
