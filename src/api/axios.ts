import axios from "axios";

// base url from the env
// const base_url = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoibG9rZXNoQGdtYWlsLmNvbSIsImlhdCI6MTc4MzUwMjY5NiwiZXhwIjoxNzg0MTA3NDk2fQ.6MUgBBrnqiL2bdRZzSBsRD6NwBQOl6bl-wOYqXlTaxM"
    },
});

export default axiosInstance;