import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; // Adjust this URL as needed

export default axios.create({
    baseURL: BASE_URL,
    timeout: 5000, // 5 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
})