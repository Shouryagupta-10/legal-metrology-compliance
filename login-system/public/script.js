// State & Elements
const tabs = document.querySelectorAll('.tab-btn');
const forms = {
    login: document.getElementById('login-form'),
    register: document.getElementById('register-form'),
    demo: document.getElementById('demo-pane')
};
const alertBanner = document.getElementById('alert-banner');
const successModal = document.getElementById('success-modal');

// Tab Switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        Object.values(forms).forEach(f => f.classList.remove('active'));
        
        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');
        if (forms[target]) {
            forms[target].classList.add('active');
        }
        hideAlert();
    });
});

function showAlert(message, type = 'error') {
    alertBanner.textContent = message;
    alertBanner.className = `alert-banner ${type}`;
}

function hideAlert() {
    alertBanner.className = 'alert-banner hidden';
    alertBanner.textContent = '';
}

function setBtnLoading(btn, isLoading) {
    const textSpan = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    if (isLoading) {
        btn.disabled = true;
        textSpan.style.opacity = '0.5';
        spinner.classList.remove('hidden');
    } else {
        btn.disabled = false;
        textSpan.style.opacity = '1';
        spinner.classList.add('hidden');
    }
}

// 1. Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-submit-btn');

    setBtnLoading(btn, true);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showAlert(data.error || 'Authentication failed. Check credentials.', 'error');
            setBtnLoading(btn, false);
            return;
        }

        showAlert('Welcome! Connecting to Delhi Safety Grid...', 'success');
        localStorage.setItem('rakshak_token', data.token);
        localStorage.setItem('rakshak_user', JSON.stringify(data.user));

        setTimeout(() => {
            showModal(data.user, data.token);
            setBtnLoading(btn, false);
        }, 600);

    } catch (err) {
        showAlert('Network or server connection failed. Ensure backend is running.', 'error');
        setBtnLoading(btn, false);
    }
});

// 2. Handle Registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const role = document.getElementById('reg-role').value;
    const district = document.getElementById('reg-district').value;
    const password = document.getElementById('reg-password').value;
    const btn = document.getElementById('register-submit-btn');

    setBtnLoading(btn, true);

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, role, district, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showAlert(data.error || 'Registration failed. Please check inputs.', 'error');
            setBtnLoading(btn, false);
            return;
        }

        showAlert('Citizen account created! Loading safety dashboard...', 'success');
        localStorage.setItem('rakshak_token', data.token);
        localStorage.setItem('rakshak_user', JSON.stringify(data.user));

        setTimeout(() => {
            showModal(data.user, data.token);
            setBtnLoading(btn, false);
        }, 600);

    } catch (err) {
        showAlert('Network error during registration.', 'error');
        setBtnLoading(btn, false);
    }
});

// Quickfill Helper for Demo Credentials
function quickFill(email, password) {
    // Switch to login tab
    tabs[0].click();
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = password;
    showAlert(`Demo credentials loaded for ${email}. Click Sign In below!`, 'success');
}

function quickGuest() {
    const guestUser = {
        name: "Delhi Citizen Explorer",
        email: "citizen@delhi.gov.in",
        role: "Public Citizen",
        district: "Delhi NCR"
    };
    localStorage.setItem('rakshak_token', 'demo-citizen-token');
    localStorage.setItem('rakshak_user', JSON.stringify(guestUser));
    showModal(guestUser, 'demo-citizen-token');
}

// Modal Handling
function showModal(user, token) {
    document.getElementById('modal-name').textContent = `Welcome, ${user.name}`;
    document.getElementById('modal-role-info').textContent = `${user.role} • ${user.district}`;
    document.getElementById('modal-token').textContent = token;
    successModal.classList.remove('hidden');
}

function logout() {
    localStorage.removeItem('rakshak_token');
    localStorage.removeItem('rakshak_user');
    successModal.classList.add('hidden');
    location.reload();
}

// Auto Check Existing Session on Load
window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('rakshak_token');
    const userJson = localStorage.getItem('rakshak_user');
    if (token && userJson && token !== 'demo-citizen-token') {
        try {
            const res = await fetch('/api/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                showModal(data.user, token);
            } else {
                localStorage.removeItem('rakshak_token');
                localStorage.removeItem('rakshak_user');
            }
        } catch (e) {
            // Offline or server down, retain view
        }
    }
});
