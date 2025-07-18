import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1"

const axiosIntance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000
})

export default axiosIntance;