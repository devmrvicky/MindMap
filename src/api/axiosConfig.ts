import { env } from "@/env/env";
import axios from "axios";

const axiosConfig = axios.create({
  baseURL: env.VITE_SERVER_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const openrouterAxiosConfig = axios.create({
  baseURL: env.VITE_OPENROUTER_BASE_URL,
});

export { axiosConfig, openrouterAxiosConfig };
