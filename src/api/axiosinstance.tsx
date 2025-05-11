// axiosInstance.ts

import axios, { InternalAxiosRequestConfig } from 'axios';
import { baseURL } from './endpoint';

export const axiosInstance = axios.create({
    baseURL,
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            // if (!config.headers) config.headers = {};
            config.headers['x-access-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
