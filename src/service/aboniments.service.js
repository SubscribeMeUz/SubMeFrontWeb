import axios from '@/library/axios';

export const abonimentsService = {
    async getAboniments(page, page_size, query) {
        const { data } = await axios.get('/web/aboniments/get/all', {
            params: {
                page,
                page_size,
                query
            }
        });
        return data;
    },
    async addAboniment(item) {
        const data = await axios.post('/web/aboniments/add', item);
        return data;
    },
    async deleteAboniment(aboniment_id) {
        const data = await axios.delete(`/web/aboniments/delete/${aboniment_id}`);
        return data;
    },
    async getAbonimentById(aboniment_id) {
        const { data } = await axios.get(`/web/aboniments/get/${aboniment_id}`);
        return data;
    },
    async getAbonimentByProviderId(provider_id) {
        const { data } = await axios.get(`/web/aboniments/get/by-provider/${provider_id}`);
        return data;
    },
    async editAboniment(aboniment_id, item) {
        const data = await axios.put(`/web/aboniments/change/${aboniment_id}`, item);
        return data;
    }
};
