import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Utility functions for local storage access
const setLocalStorageItem = (key, value) => localStorage.setItem(key, value);
const getLocalStorageItem = (key) => localStorage.getItem(key);
const removeLocalStorageItem = (key) => localStorage.removeItem(key);

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, credentials);
        const { access_token, user } = response.data;

        setLocalStorageItem('accessToken', access_token);
        setLocalStorageItem('user', JSON.stringify(user));

        return { user, access_token };
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await makeAuthenticatedRequest('/logout', 'POST');
        removeLocalStorageItem('accessToken');
        removeLocalStorageItem('user');
    } catch (error) {
        console.error("Error during logout:", error);
        throw error;
    }
};

const makeAuthenticatedRequest = async (url, method, data = null) => {
    const token = getAccessToken();
    if (!token) {
        throw new Error("No access token found");
    }

    try {
        const response = await axios({
            method,
            url: `${BASE_URL}${url}`,
            headers: { 'Authorization': `Bearer ${token}` },
            data
        });

        if (response.data.access_token) {
            setLocalStorageItem('accessToken', response.data.access_token);
        }

        return response.data;
    } catch (error) {
        console.error(`Error during ${method} request:`, error);
        throw error;
    }
};


export const get = async (url) => {
    return makeAuthenticatedRequest(url, 'GET');
};

export const post = async (url, data) => {
    return makeAuthenticatedRequest(url, 'POST', data);
};

export const put = async (url, data) => {
    return makeAuthenticatedRequest(url, 'PUT', data);
};

export const del = async (url, data) => {
    return makeAuthenticatedRequest(url, 'DELETE', data);
};

export const getUnauthenticated = async (url) => {
    try {
        const response = await axios.get(`${BASE_URL}${url}`);
        return response.data;
    } catch (error) {
        console.error("Error during unauthenticated GET request:", error);
        throw error;
    }
};

export const postUnauthenticated = async (url) => {
    try {
        const response = await axios.post(`${BASE_URL}${url}`);
        return response.data;
    } catch (error) {
        console.error("Error during unauthenticated POST request:", error);
        throw error;
    }
}

export const getAccessToken = () => getLocalStorageItem('accessToken');


export const isAuthenticated = () => {
    const token = getAccessToken();
    return Boolean(token && token.trim());
};


