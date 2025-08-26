import axios from "axios"; 

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:5001/api" 
    : "/api",

  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && 
        !error.config.url.includes('/auth/logout') && 
        !error.config.url.includes('/auth/login')) {
      console.log('Authentication error:', error.response?.data?.message);
    }
    return Promise.reject(error);
  }
);