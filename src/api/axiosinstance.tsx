// axiosInstance.ts

import axios, { AxiosRequestConfig } from 'axios';
import { baseURL } from './endpoint';

export const axiosInstance = axios.create({
    baseURL,
});

axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            if (!config.headers) config.headers = {};
            config.headers['x-access-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
