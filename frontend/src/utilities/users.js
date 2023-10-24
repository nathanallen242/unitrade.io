import { get, isAuthenticated } from '../middleware/auth.js';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchUsers = async () => {
    try {
        if (!isAuthenticated()) throw new Error('Not Authenticated');
        const response = await get('/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const addUser = async (user) => {
    // Constructing the form data using URLSearchParams
    const formData = new URLSearchParams();
    formData.append('username', user.username);
    formData.append('password_hash', user.password_hash);
    formData.append('email', user.email);

    try {
        const response = await axios.post(`${BASE_URL}/users`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
};
