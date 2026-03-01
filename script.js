/**
 * BLACK BANANA - SHARED LOGIC (API VERSION)
 * Handles data fetching and authentication via Node.js backend.
 */

const API_Base = 'http://localhost:3000/api'; // Point to backend server
let authToken = localStorage.getItem('bb_auth_token');

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

    const res = await fetch(`${API_Base}${endpoint}`, options);

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
}

// --- AUTH METHODS ---

async function login(email, password) {
    const res = await fetchAPI('/auth/login', 'POST', { username: email, password });
    if (res.token) {
        authToken = res.token;
        localStorage.setItem('bb_auth_token', authToken);
    }
    return res;
}

async function register(email, password, secret) {
    return fetchAPI('/auth/register', 'POST', { username: email, password, secret });
}

function logout() {
    localStorage.removeItem('bb_auth_token');
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
async function deleteProject(idx) { return fetchAPI(`/projects/${idx}`, 'DELETE'); }

// Reviews
async function getReviews() {
    try { return await fetchAPI('/reviews'); } catch (e) { console.error(e); return []; }
}
async function addReview(r) { return fetchAPI('/reviews', 'POST', r); } // Public
async function deleteReview(idx) { return fetchAPI(`/reviews/${idx}`, 'DELETE'); }

// Expertise
async function getExpertise() {
    try { return await fetchAPI('/expertise'); } catch (e) { console.error(e); return []; }
}
async function addExpertise(e) { return fetchAPI('/expertise', 'POST', e); }
async function deleteExpertise(idx) { return fetchAPI(`/expertise/${idx}`, 'DELETE'); }

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
