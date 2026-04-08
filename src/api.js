import axios from 'axios';
import { supabase } from './lib/supabaseClient';

// ✅ Use production URL when deployed, localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
    baseURL: API_URL,
});

// Add interceptor to automatically attach auth token
API.interceptors.request.use(async (config) => {
    console.log('🔵 Interceptor running for:', config.url);

    try {
        const { data: { session } } = await supabase.auth.getSession();

        console.log('🔵 Session exists?', !!session);
        console.log('🔵 Token exists?', !!session?.access_token);

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
            console.log('🔵 Token added to headers');
        } else {
            console.warn('⚠️ No active session found');
        }
    } catch (error) {
        console.error('❌ Error getting session:', error);
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor for debugging
API.interceptors.response.use(
    (response) => {
        console.log('🟢 Response success:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('🔴 Response error:', error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
            console.error('Authentication failed. Please login again.');
        }
        return Promise.reject(error);
    }
);

export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('🔵 Auth token set manually');
    } else {
        delete API.defaults.headers.common['Authorization'];
        console.log('🔵 Auth token removed');
    }
};

export default API;