import {performParentLookup} from "./parent.js";

window.onload = function() {
    promptPhoneNumber();
}

export function promptPhoneNumber() {
    // Render parent lookup template
    const template = document.getElementById('tpl-parent-lookup');
    const container = document.getElementById('app-container');

    container.innerHTML = '';
    if (template && container) {
        container.appendChild(template.content.cloneNode(true));
        // Attach event listener after rendering template
        const performParentLookupButton = document.getElementById('perform-parent-lookup');
        if (performParentLookupButton) {
            performParentLookupButton.addEventListener('click', performParentLookup);
        } else {
            console.error('perform-parent-app-lookup button not found after template render');
        }
    } else {
        console.error('Template or container not found');
    }
    // On Submit, call performParentLookup and display QR code
}