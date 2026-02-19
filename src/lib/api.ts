import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
    // CRITICAL: Enable credentials to send/receive cookies
    withCredentials: true,
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors
        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
            console.error('API Error:', message);
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error: Unable to connect to server');
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
