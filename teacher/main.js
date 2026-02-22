import { startScanner, stopVideoStream, toggleCamera } from "./scanner.js";
import { loadAttendance } from "./attendance.js";
import { initAuth, attemptLogin, logout } from "./auth.js";

window.onload = () => {
    initAuth(
        () => initApp(), // On Login
        () => showPinEntry() // On Logout
    );
};

function showPinEntry() {
    stopVideoStream();
    const template = document.getElementById('tpl-pin-entry');
    const container = document.getElementById('app-container');
    const nav = document.getElementById('bottom-nav');
    
    // Hide navigation
    if (nav) nav.classList.add('hidden');
    
    container.innerHTML = '';
    if (template && container) {
        container.appendChild(template.content.cloneNode(true));
        
        const pinInput = document.getElementById('pin-input');
        const errorMsg = document.getElementById('pin-error');
        
        if (pinInput) {
            pinInput.focus();
            pinInput.addEventListener('input', (e) => {
                const val = e.target.value;
                
                // Clear error on input
                if (errorMsg) errorMsg.style.opacity = '0';
                e.target.classList.remove('ring-red-500', 'border-red-500');
                
                if (val.length === 4) {
                    if (attemptLogin(val)) {
                        // Success handled by callback
                    } else {
                        // Error
                        if (errorMsg) errorMsg.style.opacity = '1';
                        e.target.value = '';
                        e.target.classList.add('ring-red-500', 'border-red-500');
                    }
                }
            });
        }
    }
}

function initApp() {
    const nav = document.getElementById('bottom-nav');
    if (nav) nav.classList.remove('hidden');
    
    // Initialize with Scanner view
    showScanner();
    
    // Attach Tab Bar Events
    const tabScanner = document.getElementById('tab-scanner');
    const tabAttendance = document.getElementById('tab-attendance');
    
    if (tabScanner) tabScanner.onclick = showScanner;
    if (tabAttendance) tabAttendance.onclick = showAttendance;
}

function updateTabUI(activeTabId) {
    const tabs = ['tab-scanner', 'tab-attendance'];
    tabs.forEach(tabId => {
        const tab = document.getElementById(tabId);
        if (tabId === activeTabId) {
            tab.classList.add('text-indigo-600');
            tab.classList.remove('text-slate-400');
        } else {
            tab.classList.remove('text-indigo-600');
            tab.classList.add('text-slate-400');
        }
    });
}

function showScanner() {
    updateTabUI('tab-scanner');
    const template = document.getElementById('tpl-scanner');
    const container = document.getElementById('app-container');
    
    // Clean up previous view
    container.innerHTML = '';
    
    if (template && container) {
        container.appendChild(template.content.cloneNode(true));
        startScanner();
        
        // Re-attach scanner specific events
        const toggleBtn = document.getElementById('toggle-camera');
        if (toggleBtn) toggleBtn.onclick = toggleCamera;
    }
}

function showAttendance() {
    updateTabUI('tab-attendance');
    stopVideoStream(); // Ensure camera is off when leaving scanner tab
    
    const template = document.getElementById('tpl-dashboard');
    const container = document.getElementById('app-container');
    
    // Clean up previous view
    container.innerHTML = '';
    
    if (template && container) {
        container.appendChild(template.content.cloneNode(true));
        loadAttendance();
        
        // Re-attach attendance specific events
        const reloadBtn = document.getElementById('reload-attendance');
        if (reloadBtn) reloadBtn.onclick = loadAttendance;
    }
}