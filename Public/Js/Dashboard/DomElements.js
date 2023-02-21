function _createElement(tagName, attributes, textContent) {
    const element = document.createElement(tagName);

    if (attributes) {
        for (const [attrName, attrValue] of Object.entries(attributes)) {
            element.setAttribute(attrName, attrValue);
        }
    }

    if (textContent) {
        const textNode = document.createTextNode(textContent);
        element.appendChild(textNode);
    }

    return element;
}

function _appendChilds(parent, children) {
    children.forEach((element) => {
        parent.appendChild(element);
    });
}
