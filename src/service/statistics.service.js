import axios from '@/library/axios';

export const StatisticsService = {
    async getDailyPurchases(from_date, to_date, provider_id) {
        const { data } = await axios.get('/statistics/get-daily-purchases', {
            params: {
                from_date,
                to_date,
                provider_id
            }
        });
        return data;
    },
    async getActiveAboniments(from_date, to_date, provider_id) {
        const { data } = await axios.get('/statistics/get-active-aboniments', {
            params: {
                from_date,
                to_date,
                provider_id
            }
        });
        return data;
    },
    async getUserAbonimentUses(from_date, to_date, provider_id) {
        const { data } = await axios.get('/statistics/get-user-aboniment-uses', {
            params: {
                from_date,
                to_date,
                provider_id
            }
        });
        return data;
    },
    async getUsesWithTime(from_date, to_date, provider_id, interval_hours) {
        const { data } = await axios.get('/statistics/get-uses-with-time', {
            params: {
                from_date,
                to_date,
                provider_id,
                interval_hours
            }
        });
        return data;
    },
    async getUserListByUseTimes(items) {
        const { data } = await axios.post('/statistics/get-user-list-by-usetimes', items);
        return data;
    },
    async getPurchasesHistory(item) {
        const { data } = await axios.post('/statistics/get-purchase-history', item);
        return data;
    },
    async getAllClientInfo(items) {
        const { data } = await axios.post('/statistics/get-all-client-info', items);
        return data;
    }
};
