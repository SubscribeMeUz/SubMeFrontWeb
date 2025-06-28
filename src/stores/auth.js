import { defineStore } from 'pinia';
import AuthService from '@/service/auth.service';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: {}
    }),
    actions: {
        async login(userCredentials) {
            try {
                const data = await AuthService.login(userCredentials);
                this.user = data;
                localStorage.setItem('user_role', data.data.user.role);
                localStorage.setItem('user_id', data.data.user.id);
                localStorage.setItem('user_name', data.data.user.username);
                localStorage.setItem('phone', data.data.user.phone);
                localStorage.setItem('full_name', data.data.user.full_name);
                localStorage.setItem('access_token', data.data.token);
                return data;
            } catch (error) {
                return false;
            }
        }
    }
});
