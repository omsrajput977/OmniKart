import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8085/',
    headers: {
        "Content-Type": 'application/json',
    },
    withCredentials: true
})