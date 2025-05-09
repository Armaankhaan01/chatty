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
  BASE_ENDPOINT = 'https://chatty-backend.arkarman.xyz';
}

const BASE_URL = `https://chatty-backend.arkarman.xyz/api/v1`;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true // Keep this for cookie support as fallback
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

// Add a response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      // For example, redirect to login page
      // localStorage.removeItem('token');
      // You could redirect here or dispatch a logout action
      // window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
