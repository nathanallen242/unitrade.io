import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, credentials);
        // Assuming the response body directly contains the token
        const token = response.data;
        // Store token in local storage
        localStorage.setItem('accessToken', token);
        return token;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

// Silent refreshing of the access token
const makeAuthenticatedRequest = async (url, method, data = null) => {
    const token = getAccessToken();
    if (!token) {
        throw new Error("No access token found");
    }

    try {
        const response = await axios({
            method,
            url: `${BASE_URL}${url}`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data
        });

        // Check if a new access token is provided in the response
        if (response.data.access_token) {
            localStorage.setItem('accessToken', response.data.access_token);
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

export const getUnauthenticated = async (url) => {
    try {
        const response = await axios.get(`${BASE_URL}${url}`);
        return response.data;
    } catch (error) {
        console.error("Error during unauthenticated GET request:", error);
        throw error;
    }
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


export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

export const isAuthenticated = () => {
    return !!getAccessToken();
};

export const logout = async () => {
    try {
        await makeAuthenticatedRequest('/logout', 'POST');
        localStorage.removeItem('accessToken');
    } catch (error) {
        console.error("Error during logout:", error);
        throw error;
    }
};
