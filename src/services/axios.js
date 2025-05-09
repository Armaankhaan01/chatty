import axios from 'axios';

export let BASE_ENDPOINT = '';

// when developing locally, change this value to local
export const APP_ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;

if (APP_ENVIRONMENT === 'local') {
  BASE_ENDPOINT = 'http://localhost:5000';
} else if (APP_ENVIRONMENT === 'development') {
  BASE_ENDPOINT = 'http://localhost:5000';
} else if (APP_ENVIRONMENT === 'staging') {
  BASE_ENDPOINT = 'https://chatty-backend.arkarman.xyz';
} else if (APP_ENVIRONMENT === 'production') {
  BASE_ENDPOINT = process.env.REACT_APP_BASE_ENDPOINT;
}

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});

// Add a request interceptor to include token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
