import { abonimentsService } from '@/service/aboniments.service';
import { defineStore } from 'pinia';

export const useAbonimentStore = defineStore('aboniments', {
    state: () => ({
        aboniments: []
    }),
    actions: {
        async getAboniments(page, page_size, query) {
            const data = await abonimentsService.getAboniments(page, page_size, query);
            this.aboniments = data;
            return data;
        },
        async addAboniment(item) {
            const data = await abonimentsService.addAboniment(item);
            return data;
        },
        async deleteAboniment(id) {
            const data = await abonimentsService.deleteAboniment(id);
            return data;
        },
        async getAbonimentById(id) {
            const data = await abonimentsService.getAbonimentById(id);
            return data;
        },
        async getAbonimentByProviderId(id) {
            const data = await abonimentsService.getAbonimentByProviderId(id);
            return data;
        },
        async editAboniment(id, item) {
            const data = await abonimentsService.editAboniment(id, item);
            return data;
        }
    }
});
