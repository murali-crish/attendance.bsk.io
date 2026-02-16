// --- QR Code Scanner Logic
import {appState} from "../shared/state.js";
import {recordAttendance} from "./attendance.js";
import {supabaseClient} from "../shared/supabase.js";

// Initialize context
appState.context = appState.canvas.getContext('2d');

export function startScanner(mode = appState.cameraMode) {
    appState.cameraMode = mode;
    resetScanFeedback();
    stopVideoStream();
    appState.video.setAttribute('playsinline', true);
    
    // Ensure video fills the container
    appState.video.style.width = '100%';
    appState.video.style.height = '100%';
    appState.video.style.objectFit = 'cover';
    
    const reader = document.getElementById('reader');
    if (reader) {
        reader.appendChild(appState.video);
        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: appState.cameraMode,
            }
        }).then(stream => {
            appState.video.srcObject = stream;
            appState.video.play();
            requestAnimationFrame(scanTick);
        }).catch(err => {
            console.error("Camera access denied:", err);
            setScanFeedback("Camera access denied", true);
        });
    }
}

export function stopVideoStream() {
    if (appState.video.parentNode) appState.video.parentNode.removeChild(appState.video);
    if (appState.video.srcObject) appState.video.srcObject.getTracks().forEach(track => track.stop());
}

export function scanTick() {
    if (appState.scanCooldown) {
        requestAnimationFrame(scanTick);
        return;
    }

    if (appState.video.readyState === appState.video.HAVE_ENOUGH_DATA) {
        appState.canvas.width = appState.video.videoWidth;
        appState.canvas.height = appState.video.videoHeight;
        appState.context.drawImage(appState.video, 0, 0, appState.canvas.width, appState.canvas.height);
        const imageData = appState.context.getImageData(0, 0, appState.canvas.width, appState.canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) handleQRCodeScan(code.data);
    }
    requestAnimationFrame(scanTick);
}

export function toggleCamera() {
    appState.cameraMode = appState.cameraMode === 'user' ? 'environment' : 'user';
    startScanner(appState.cameraMode);
}

export async function handleQRCodeScan(data) {
    appState.scanCooldown = true;
    const [studentId, scannedPhone] = data.split('|');
    const { data: student, error } = await supabaseClient
        .from('students')
        .select('name')
        .eq('id', studentId)
        .single();

    if (student && student.name) {
        await recordAttendance(studentId, scannedPhone, student.name);
        playSuccessSound()
    } else {
        setScanFeedback('Student not found', true);
    }
    setTimeout(() => {
        resetScanFeedback();
        appState.scanCooldown = false;
    }, 2000);
}

export function setScanFeedback(message, isError = false) {
    const feedback = document.getElementById('scan-feedback');
    if (!feedback) return;
    
    feedback.innerHTML = isError
        ? `<div class="text-red-600 font-bold">${message}</div>`
        : `<div class="flex items-center justify-center space-x-3">
                <div class="bg-emerald-100 rounded-full p-2">
                    <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <div class="text-lg font-bold text-emerald-700">${message}</div>
            </div>`;
}

function resetScanFeedback() {
    const feedback = document.getElementById('scan-feedback');
    if (feedback) {
        feedback.innerHTML = `Point camera at student QR`;
        feedback.className = "text-center p-4 rounded-2xl bg-slate-100 text-slate-600 font-medium";
    }
}

function playSuccessSound() {
    console.log('play success sound');
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.play();
}