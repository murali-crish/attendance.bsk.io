// CONFIG
const TEACHER_PIN = "2011";
const INACTIVITY_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

let isAppRunning = false;
let onLogoutCallback = null;
let onLoginCallback = null;

export function initAuth(onLogin, onLogout) {
    onLoginCallback = onLogin;
    onLogoutCallback = onLogout;

    // Initial check
    checkAuth();

    // Check auth when app comes to foreground
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            checkAuth();
        }
    });

    // Track user activity to reset timer
    ['click', 'touchstart', 'mousemove', 'keydown', 'scroll'].forEach(evt =>
        document.addEventListener(evt, updateActivityTimestamp, { passive: true })
    );

    // Periodic check every minute
    setInterval(checkAuth, 60000);
}

function updateActivityTimestamp() {
    if (isAppRunning) {
        sessionStorage.setItem('teacher_last_active', Date.now().toString());
    }
}

function checkAuth() {
    const isAuth = sessionStorage.getItem('teacher_auth') === 'true';
    const lastActive = parseInt(sessionStorage.getItem('teacher_last_active') || '0');
    const now = Date.now();

    if (isAuth) {
        // Check for timeout
        if (now - lastActive > INACTIVITY_LIMIT_MS) {
            console.log("Session timed out due to inactivity");
            logout();
        } else if (!isAppRunning) {
            // Valid session, start app if not running
            loginSuccess();
        }
    } else {
        // Not authenticated
        if (isAppRunning) {
            logout();
        } else {
            // If app is not running and not authenticated, ensure we are on login screen
            if (onLogoutCallback) onLogoutCallback();
        }
    }
}

export function logout() {
    isAppRunning = false;
    sessionStorage.removeItem('teacher_auth');
    sessionStorage.removeItem('teacher_last_active');
    if (onLogoutCallback) onLogoutCallback();
}

function loginSuccess() {
    isAppRunning = true;
    if (onLoginCallback) onLoginCallback();
}

export function attemptLogin(pin) {
    if (pin === TEACHER_PIN) {
        sessionStorage.setItem('teacher_auth', 'true');
        sessionStorage.setItem('teacher_last_active', Date.now().toString());
        loginSuccess();
        return true;
    }
    return false;
}