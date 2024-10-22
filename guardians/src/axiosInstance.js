import axios from 'axios';

// Create an instance of Axios with a base URL
const api = axios.create({
  // baseURL: 'http://localhost:3001/api',
  baseURL: 'http://20.240.193.122/api',
  // baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
