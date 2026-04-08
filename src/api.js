import axios from 'axios';
import { supabase } from './lib/supabaseClient';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add interceptor to automatically attach auth token
API.interceptors.request.use(async (config) => {
    console.log('🔵 Interceptor running for:', config.url); // ✅ Debug
    
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('🔵 Session exists?', !!session); // ✅ Debug
        console.log('🔵 Token exists?', !!session?.access_token); // ✅ Debug
        
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
            console.log('🔵 Token added to headers'); // ✅ Debug
        } else {
            console.warn('⚠️ No active session found');
        }
    } catch (error) {
        console.error('❌ Error getting session:', error);
    }
    
    console.log('🔵 Final headers:', config.headers); // ✅ Debug
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