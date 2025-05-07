import axios from "axios";

const axiosConfig = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://mind-map-server.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosConfig;
