import axios from '@/library/axios';

export const providerService = {
    async getProviders(page, page_size, query) {
        const { data } = await axios.get('/web/providers/get/all/providers', {
            params: {
                page,
                page_size,
                query
            }
        });
        return data;
    },
    async addProvider(item) {
        const data = await axios.post('/web/providers/add', item);
        return data;
    },
    async getProviderByProviderId(provider_id) {
        const { data } = await axios.get(`/web/providers/get/${provider_id}`);
        return data;
    },
    async editProvider(provider_id, item) {
        const data = await axios.put(`/web/providers/edit/${provider_id}`, item);
        return data;
    },
    async deleteProvider(provider_id) {
        const data = await axios.delete(`/web/providers/delete/${provider_id}`);
        return data;
    },
    async getProviderAllList() {
        const { data } = await axios.get('/web/providers/get/all');
        return data;
    },
    async addProviderTab(item) {
        const data = await axios.post('/web/tabs/add', item);
        return data;
    },
    async deleteProviderTab(id) {
        const data = await axios.delete(`/web/tabs/delete/${id}`);
        return data;
    },
    async editProviderTab(id, item) {
        const data = await axios.put(`/web/tabs/edit/${id}`, item);
        return data;
    },
    async getProviderTabsById(provider_id) {
        const { data } = await axios.get(`/web/tabs/get-all/${provider_id}`);
        return data;
    },
    async addPhotoToProvider(provider_id, item) {
        const data = await axios.post(`/web/providers/add-photo/${provider_id}`, item);
        return data;
    }
};
