import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const client = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Add response interceptor to handle auth errors
client.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Clear invalid auth data from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optionally reload the page to reset the app state
            // window.location.reload();
        }
        return Promise.reject(error);
    }
);

// Auth
export const signup = async ({ name, email, password }) => {
    const res = await client.post('/signup', { name, email, password });
    return res.data;
};

export const login = async ({ email, password }) => {
    const res = await client.post('/login', { email, password });
    return res.data;
};

// Listings
export const getListings = async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Add non-empty filters to query params
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && 
            (Array.isArray(value) ? value.length > 0 : true)) {
            if (Array.isArray(value)) {
                params.append(key, value.join(','));
            } else {
                params.append(key, value);
            }
        }
    });

    const res = await client.get('/listings', { params });
    return res.data; // { listings: [...] }
};

export const getListingById = async (id) => {
    const res = await client.get(`/listings/${id}`);
    return res.data.listing; // { listing }
};

export const getUserPublic = async (id) => {
    const res = await client.get(`/users/${id}`);
    return res.data.user; // { id, name }
};

export const uploadImages = async (files) => {
    // files can be File objects or base64 data URI strings. Use base64 endpoint directly.
    // Reject too-large files early to avoid server 413 errors.
    const MAX_BYTES = 8 * 1024 * 1024; // 8MB per file
    // Separate File objects from data URI strings
    const fileObjects = files.filter(f => f && typeof f !== 'string');
    const dataUris = files.filter(f => typeof f === 'string');

    // Quick size check for File objects
    for (const f of fileObjects) {
        if (f.size > MAX_BYTES) {
            throw new Error(`File ${f.name} is too large (${Math.round(f.size/1024/1024)}MB). Max ${Math.round(MAX_BYTES/1024/1024)}MB.`);
        }
    }

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const b64sFromFiles = await Promise.all(fileObjects.map(f => toBase64(f)));
    const allB64s = [...b64sFromFiles, ...dataUris];

    if (allB64s.length === 0) return [];

    const res = await client.post('/upload-base64', { images: allB64s });
    if (!res || !res.data || !Array.isArray(res.data.urls)) {
        throw new Error('Image upload failed');
    }
    return res.data.urls;
};

export const createListing = async (data, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await client.post('/listings', data, { headers });
    return res.data; // { listing }
};

export const updateListing = async (id, data, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await client.patch(`/listings/${id}`, data, { headers });
    return res.data;
};

// Bookmarks
export const toggleBookmark = async (listingId, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await client.post(`/bookmarks/${listingId}`, {}, { headers });
    return res.data;
};

export const getBookmarks = async (token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await client.get('/bookmarks', { headers });
    return res.data;
};

export const isBookmarked = async (listingId, token) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const res = await client.get(`/bookmarks/${listingId}`, { headers });
        return res.data.isBookmarked;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return false; // Not bookmarked if 404
        }
        throw error; // Re-throw other errors
    }
};

export default client;