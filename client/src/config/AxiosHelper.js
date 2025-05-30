import axios from 'axios';
export const baseURL = "https://chat-app-backend-k642.onrender.com";
export const httpClient = axios.create({
    baseURL: baseURL
});