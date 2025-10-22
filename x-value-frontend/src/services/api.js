import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const client = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

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
export const getListings = async () => {
    const res = await client.get('/listings');
    return res.data; // { listings: [...] }
};

export const getListingById = async (id) => {
    const res = await client.get(`/listings/${id}`);
    return res.data.listing; // { listing }
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