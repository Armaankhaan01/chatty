import axios from 'axios';

export let BASE_ENDPOINT = '';

// when developing locally, change this value to local
export const APP_ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;

if (APP_ENVIRONMENT === 'local') {
  BASE_ENDPOINT = 'http://localhost:5000';
} else if (APP_ENVIRONMENT === 'development') {
  BASE_ENDPOINT = 'http://localhost:5000';
} else if (APP_ENVIRONMENT === 'staging') {
  BASE_ENDPOINT = process.env.REACT_APP_BASE_ENDPOINT;
} else if (APP_ENVIRONMENT === 'production') {
  BASE_ENDPOINT = process.env.REACT_APP_BASE_ENDPOINT;
}

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;

export default axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true
});
