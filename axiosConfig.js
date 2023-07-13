import axios from "axios";

const axiosConfig = axios.create({
 baseURL: process.env.NEXTAUTH_URL || "http://localhost:3000",
});

export default axiosConfig;