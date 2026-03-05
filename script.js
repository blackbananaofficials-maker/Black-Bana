/**
 * BLACK BANANA - SHARED LOGIC (API VERSION)
 * Handles data fetching and authentication via Node.js backend.
 */

const API_Base = 'http://localhost:3000/api'; // Point to backend server
let authToken = localStorage.getItem('bb_auth_token');

// --- LOADER COMPONENT ---
(function injectLoader() {
    const loaderHTML = `
    <div id="bb-global-loader" class="fixed inset-0 z-[9999] bg-bb-black/95 flex flex-col items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
        <div class="relative">
            <!-- Pulsing 'B' -->
            <div class="text-bb-gold text-7xl font-bold font-sans animate-pulse-loader select-none">B</div>
            <!-- Glow Effect -->
            <div class="absolute inset-0 bg-bb-gold/20 blur-2xl rounded-full scale-150 animate-pulse-glow"></div>
        </div>
        <div class="mt-8 overflow-hidden w-48 h-[2px] bg-white/5 rounded-full relative">
            <div class="absolute top-0 left-0 h-full bg-bb-gold animate-progress-line"></div>
        </div>
    </div>
    <style>
        @keyframes pulse-loader {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes pulse-glow {
            0%, 100% { opacity: 0.2; transform: scale(1.2); }
            50% { opacity: 0.4; transform: scale(1.6); }
        }
        @keyframes progress-line {
            0% { width: 0%; left: -100%; }
            50% { width: 100%; left: 0%; }
            100% { width: 0%; left: 100%; }
        }
        .animate-pulse-loader { animation: pulse-loader 1.5s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-progress-line { animation: progress-line 2s ease-in-out infinite; }
    </style>
    `;
    document.body.insertAdjacentHTML('beforeend', loaderHTML);
})();

function showLoader() {
    const loader = document.getElementById('bb-global-loader');
    if (loader) {
        loader.classList.remove('opacity-0', 'pointer-events-none');
        loader.classList.add('opacity-100');
    }
}

function hideLoader() {
    const loader = document.getElementById('bb-global-loader');
    if (loader) {
        loader.classList.add('opacity-0', 'pointer-events-none');
        loader.classList.remove('opacity-100');
    }
}

// --- API HELPERS ---

async function fetchAPI(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    showLoader();
    try {
        const res = await fetch(`${API_Base}${endpoint}`, options);
        hideLoader();

        if (res.status === 401 || res.status === 403) {
            let errorMsg = 'Unauthorized';
            try {
                const err = await res.json();
                errorMsg = err.error || errorMsg;
            } catch (e) { }

            // Only logout if we are in admin panel (session expired)
            if (window.location.pathname.includes('admin.html')) {
                logout();
            }
            throw new Error(errorMsg);
        }

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'API Error');
        }

        return res.json();
    } catch (e) {
        hideLoader();
        throw e;
    }
}

// --- AUTH METHODS ---

async function login(email, password) {
    const res = await fetchAPI('/auth/login', 'POST', { username: email, password });
    if (res.token) {
        authToken = res.token;
        localStorage.setItem('bb_auth_token', authToken);
        localStorage.setItem('bb_auth_username', email);
    }
    return res;
}

async function register(email, password, secret) {
    return fetchAPI('/auth/register', 'POST', { username: email, password, secret });
}

function logout() {
    localStorage.removeItem('bb_auth_token');
    localStorage.removeItem('bb_auth_username');
    window.location.href = 'blackbanana.html';
}

function checkAuth() {
    if (!localStorage.getItem('bb_auth_token')) {
        window.location.href = 'login.html';
    }
}

// --- DATA ACCESS METHODS (Async now) ---

// Projects
async function getProjects() {
    // Return empty array on error for safety in UI rendering
    try { return await fetchAPI('/projects'); } catch (e) { console.error(e); return []; }
}
async function addProject(p) { return fetchAPI('/projects', 'POST', p); }
async function deleteProject(id) { return fetchAPI(`/projects/${id}`, 'DELETE'); }

// Reviews
async function getReviews() {
    try { return await fetchAPI('/reviews'); } catch (e) { console.error(e); return []; }
}
async function addReview(r) { return fetchAPI('/reviews', 'POST', r); } // Public
async function toggleReviewFeature(id, isFeatured) {
    return fetchAPI(`/reviews/${id}/feature`, 'PUT', { is_featured: isFeatured });
}
async function deleteReview(id) { return fetchAPI(`/reviews/${id}`, 'DELETE'); }

// Expertise
async function getExpertise() {
    try { return await fetchAPI('/expertise'); } catch (e) { console.error(e); return []; }
}
async function addExpertise(e) { return fetchAPI('/expertise', 'POST', e); }
async function deleteExpertise(id) { return fetchAPI(`/expertise/${id}`, 'DELETE'); }

// Contact
async function submitContact(data) { return fetchAPI('/contact', 'POST', data); }


// --- EXPORTS ---
window.BB_DB = {
    login,
    register,
    logout,
    checkAuth,

    getProjects,
    addProject,
    deleteProject,

    getReviews,
    addReview,
    deleteReview,

    getExpertise,
    addExpertise,
    deleteExpertise,
    submitContact
};
