import {performParentLookup, showPassesForPhone} from "./parent.js";

window.onload = function() {
    const savedPhone = localStorage.getItem('parentPhoneNumber');
    if (savedPhone) {
        showPassesForPhone(savedPhone).catch(error => console.log(error));
    } else {
        promptPhoneNumber();
    }
    addSettingsIcon();
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
            console.error('perform-parent-lookup button not found after template render');
        }
    } else {
        console.error('Template or container not found');
    }
    // On Submit, call performParentLookup and display QR code
}

function addSettingsIcon() {
    let settingsIcon = document.getElementById('settings-icon');
    if (!settingsIcon) {
        settingsIcon = document.createElement('span');
        settingsIcon.id = 'settings-icon';
        settingsIcon.innerHTML = '⚙️';
        settingsIcon.style.position = 'absolute';
        settingsIcon.style.top = '10px';
        settingsIcon.style.right = '10px';
        settingsIcon.style.cursor = 'pointer';
        document.body.appendChild(settingsIcon);
        settingsIcon.addEventListener('click', () => {
            localStorage.removeItem('parentPhoneNumber');
            promptPhoneNumber();
        });
    }
}