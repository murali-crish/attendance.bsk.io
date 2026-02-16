import { startScanner, stopVideoStream, toggleCamera } from "./scanner.js";
import { loadAttendance } from "./attendance.js";

window.onload = () => {
    // Initialize with Scanner view
    showScanner();
    
    // Attach Tab Bar Events
    document.getElementById('tab-scanner').onclick = showScanner;
    document.getElementById('tab-attendance').onclick = showAttendance;
};

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