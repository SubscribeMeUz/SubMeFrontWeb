import axios from '@/library/axios';

const AuthService = {
    login: async (userCredentials) => {
        const data = await axios.post('/web/auth/login', userCredentials);
        return data;
    }
};
export default AuthService;
