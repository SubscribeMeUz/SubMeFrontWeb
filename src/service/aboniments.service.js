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
    },
    async getAbonimentQrCode(aboniment_id) {
        const { data } = await axios.get(`/web/aboniments/qr-code/${aboniment_id}`, {
            responseType: 'blob'
        });
        const blob = new Blob([data], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');

        // const url = URL.createObjectURL(new Blob([data]));
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', `QR-${aboniment_id}.png`);
        // document.body.appendChild(link);
        // link.click();
        return data;
    }
};
