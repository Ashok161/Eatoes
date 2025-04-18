import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchMenuItems = (category = '') => {
    const params = category ? { category } : {};
    return api.get('/menu', { params });
};

export const placeOrder = (orderData) => {
    return api.post('/orders', orderData);
};

export const fetchOrdersByPhone = (phone) => {
    if (!phone) {
        return Promise.reject(new Error("Phone number is required"));
    }
    return api.get(`/orders/${phone}`);
};

export default api;