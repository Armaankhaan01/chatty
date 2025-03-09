import axios from 'axios';

// const BASE_URL = `${process.env.REACT_APP_BASE_ENDPOINT}/api/v1`;
const BASE_URL = `http://localhost:5000/api/v1`;

export default axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true
});
