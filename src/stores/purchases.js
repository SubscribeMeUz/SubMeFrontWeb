import { purchasesService } from '@/service/purchases.service';
import { defineStore } from 'pinia';

export const usePurchasesStore = defineStore('purchases', {
    state: () => ({
        purchases: [],
        purchasesRequests: []
    }),
    actions: {
        async getPurchases(aboniment_id, user_id, page, page_size, date_filter) {
            const data = await purchasesService.getPurchases(
                aboniment_id,
                user_id,
                page,
                page_size,
                date_filter
            );
            this.purchases = data;
            return data;
        },
        async createPurchases(item) {
            const data = await purchasesService.createPurchases(item);
            return data;
        },
        async getPurchasingRequests() {
            const data = await purchasesService.getPurchasingRequests();
            this.purchasesRequests = data;
            return data;
        },
        async setPurchasingRequest(id, status) {
            const data = await purchasesService.setPurchasingRequest(id, status);
            return data;
        }
    }
});
