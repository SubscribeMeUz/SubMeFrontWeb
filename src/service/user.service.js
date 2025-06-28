import axios from '@/library/axios';

export const userService = {
    async getUsers(page, page_size, query) {
        const { data } = await axios.get('/web/users/get/all/users', {
            params: {
                page,
                page_size,
                query
            }
        });
        return data;
    },
    async addUser(item) {
        const data = await axios.post('/web/auth/admin/add-user', item);
        return data;
    },
    async getUserRole() {
        const { data } = await axios.get('/web/users/roles');
        return data;
    },
    async getUserInfoById(user_id) {
        const { data } = await axios.get(`/web/users/get/${user_id}`);
        return data;
    },
    async editUser(user_id, item) {
        const data = await axios.put(`/web/users/change/${user_id}`, item);
        return data;
    },
    async editSelfUser(item) {
        const data = await axios.put('/web/users/change/self', item);
        return data;
    },
    async getAllUsers() {
        const { data } = await axios.get('/web/users/get/all');
        return data;
    }
};
