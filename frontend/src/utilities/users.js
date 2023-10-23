import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const addUser = async (user) => {
    try {
        const response = await axios.post(`${BASE_URL}/users`, user);
        return response.data;
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
};

// Add more user-related API calls as needed...
