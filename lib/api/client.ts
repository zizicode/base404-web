import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ej: https://api.vimovies.com/v1
  timeout: 8000,
});
