import axios from "axios";

// base url from the env
// const base_url = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
    baseURL: "http://52.66.162.16/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNzg0ODk1NjkzLCJleHAiOjE3ODU1MDA0OTN9.Obk-mCyS6sMJ3IbmZPlTsprbuKQrHs8Wxv3N-8cq2Io"
    },
});

export default axiosInstance;