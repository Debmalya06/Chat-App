import axios from 'axios';
// export const baseURL = "https://chat-app-backend-k642.onrender.com";
export const baseURL = "http://localhost:8080"; // Local development URL
export const httpClient = axios.create({
    baseURL: baseURL
});