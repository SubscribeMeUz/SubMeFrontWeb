import { providerService } from '@/service/provider.service';
import { defineStore } from 'pinia';

export const useProviderStore = defineStore('provider', {
    state: () => ({
        providers: []
    }),
    actions: {
        async getProviders(page, page_size, query) {
            const data = await providerService.getProviders(page, page_size, query);
            this.providers = data;
            return data;
        },
        async addProvider(item) {
            const data = await providerService.addProvider(item);
            return data;
        },
        async getProviderByProviderId(id) {
            const data = await providerService.getProviderByProviderId(id);
            return data;
        },
        async editProvider(id, item) {
            const data = await providerService.editProvider(id, item);
            return data;
        },
        async deleteProvider(id) {
            const data = await providerService.deleteProvider(id);
            return data;
        },
        async getProviderAllList() {
            const data = await providerService.getProviderAllList();
            return data;
        },
        async addProviderTab(item) {
            const data = await providerService.addProviderTab(item);
            return data;
        },
        async deleteProviderTab(id) {
            const data = await providerService.deleteProviderTab(id);
            return data;
        },
        async editProviderTab(id, item) {
            const data = await providerService.editProviderTab(id, item);
            return data;
        },
        async getProviderTabsById(id) {
            const data = await providerService.getProviderTabsById(id);
            return data;
        },
        async addPhotoToProvider(id, item) {
            const data = await providerService.addPhotoToProvider(id, item);
            return data;
        }
    }
});
