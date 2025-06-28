import axios from '@/library/axios';

export const abonimetPackageService = {
    async addPackage(item) {
        const data = await axios.post('/web/packages/add', item);
        return data;
    },
    async editPackage(id, item) {
        const data = await axios.put(`/web/packages/edit/${id}`, item);
        return data;
    },
    async deletePackage(id) {
        const data = await axios.delete(`/web/packages/delete/${id}`);
        return data;
    },
    async getAbonimentPackageByProviderId(provider_id) {
        const { data } = await axios.get(`/web/packages/get-all/${provider_id}`);
        return data;
    }
};
