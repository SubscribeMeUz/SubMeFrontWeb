import axios from '@/library/axios';

export const purchasesService = {
    async getPurchases(aboniment_id, user_id, page, page_size, date_filter) {
        const { data } = await axios.get('/web/purchases/get', {
            params: {
                aboniment_id,
                user_id,
                page,
                page_size,
                date_filter
            }
        });
        return data;
    },
    async createPurchases(item) {
        const data = await axios.post('/web/purchases/add', item);
        return data;
    },
    async getPurchasingRequests() {
        const { data } = await axios.get('/web/purchasing-requests/get-news');
        return data;
    },
    async setPurchasingRequest(request_id, status) {
        const data = await axios.post(
            `/web/purchasing-requests/set/${request_id}`,
            {},
            {
                params: {
                    status
                }
            }
        );
        return data;
    }
};
