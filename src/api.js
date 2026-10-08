import axios from "axios";
import { getToken, removeToken } from "./auth";
import { isDemo, demoAdapter } from "./demo";

const api = axios.create({
  baseURL: "https://expense-api-1p6n.onrender.com",
});

api.interceptors.request.use((config) => {
  if (isDemo()) {
    // Demo mode: never touch the network or send credentials.
    config.adapter = demoAdapter;
    return config;
  }

  const token = getToken();

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default api;
