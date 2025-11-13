import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // all requests go here
  withCredentials: true,               // send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
