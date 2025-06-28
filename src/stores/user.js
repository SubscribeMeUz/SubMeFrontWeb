import { userService } from '@/service/user.service';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        users: []
    }),
    actions: {
        async getUsers(page, page_size, query) {
            const data = await userService.getUsers(page, page_size, query);
            this.users = data;
            return data;
        },
        async addUser(item) {
            const data = await userService.addUser(item);
            return data;
        },
        async getUserRole() {
            const data = await userService.getUserRole();
            return data;
        },
        async getUserInfoById(id) {
            const data = await userService.getUserInfoById(id);
            return data;
        },
        async editUser(id, item) {
            const data = await userService.editUser(id, item);
            return data;
        },
        async editSelfUser(item) {
            const data = await userService.editSelfUser(item);
            return data;
        },
        async getAllUsers() {
            const data = await userService.getAllUsers();
            return data;
        }
    }
});
