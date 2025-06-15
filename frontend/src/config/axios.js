import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request:', config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error - Please check if the backend server is running');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
