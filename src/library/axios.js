import axios from 'axios';
import router from '@/router';

axios.defaults.baseURL = 'https://api.subme.uz/';
// axios.defaults.baseURL = 'http://193.31.28.118:8000/';
// axios.defaults.baseURL = 'http://172.29.64.76:9000/';

axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.withCredentials = false;
axios.defaults.timeout = 30000;

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401 || error.response.status === 403) {
            localStorage.clear();
            router.push('/auth/login');
        }
        if (error.response.status == 404) {
            router.push('/pages/notfound');
        }
        return error;
    }
);

export default axios;
