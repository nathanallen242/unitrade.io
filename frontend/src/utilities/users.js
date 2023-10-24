import { get, post, isAuthenticated } from '../middleware/auth.js';

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
    try {
        const response = await post('/users', user);
        return response.data;
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
};
