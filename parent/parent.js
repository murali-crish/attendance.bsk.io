import {appState} from "../shared/state.js";
import {promptPhoneNumber} from "./main.js";
import {supabaseClient} from "../shared/supabase.js";
import QRCode from "qrcode";

// --- PARENT LOOKUP LOGIC ---
export function performParentLookup() {
    const phoneInput = document.getElementById('lookup-phone');
    if (!phoneInput) return;

    const phone = phoneInput.value;
    appState.cleanPhone = phone.replace(/\D/g, ''); // Remove all non-digit characters

    // Save to localStorage for future visits
    localStorage.setItem('parentPhoneNumber', appState.cleanPhone);
    showPassesForPhone(appState.cleanPhone).catch(error => console.log(error));
}

export async function showPassesForPhone(phone) {
    const { data: kids, error } = await supabaseClient
        .from('students')
        .select('*')
        .or(`parent1_phone.eq.${phone},parent2_phone.eq.${appState.cleanPhone}`);

    if (kids && kids.length > 0) {
        const template = document.getElementById('tpl-parent-hub');
        const container = document.getElementById('app-container');

        if (!template || !container) {
            alert("Template or container not found.");
            return;
        }
        container.innerHTML = '';
        container.appendChild(template.content.cloneNode(true));
        renderAllPasses(kids);

        const backButton = document.getElementById('parent-hub-back-button');
        if (backButton) {
            backButton.addEventListener('click', promptPhoneNumber);
        }
    } else {
        alert("No students found with that number.")
    }
}

function generateQRCodeForKid(canvas, kidId, phone) {
    const qrData = `${kidId}|${phone}`;
    QRCode.toCanvas(canvas, qrData, {
        width: 220,
        margin: 2,
        color: { dark: '#1e293b', light: '#f8fafc' }
    });
}

export function renderAllPasses(kids) {
    const passesContainer = document.getElementById('passes-container');
    const childCount = document.getElementById('child-count');
    const tpl = document.getElementById('tpl-student');

    if (!passesContainer || !childCount || !tpl) {
        alert("Required elements for rendering passes not found.");
        return;
    }

    childCount.innerText = kids.length;
    passesContainer.innerHTML = '';

    kids.forEach(kid => {
        const clone = tpl.content.cloneNode(true);
        const nameEl = clone.querySelector('#pass-name');
        const canvasEl = clone.querySelector('.pass-qr');

        if (nameEl) nameEl.innerText = kid.name;
        if (canvasEl) {
            canvasEl.setAttribute('data-student-id', kid.id);
            generateQRCodeForKid(canvasEl, kid.id, appState.cleanPhone);
        }

        passesContainer.appendChild(clone);
    });
}