import axios from "axios";

const axiosConfig = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === "development"
      ? "http://localhost:3000/api"
      : "https://mind-map-server.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const openrouterAxiosConfig = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
});

export default axiosConfig;
export { openrouterAxiosConfig };
