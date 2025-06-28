import { defineStore } from 'pinia';
import { abonimetPackageService } from '@/service/abonimentPackages.service';

export const useAbonimentPackageStore = defineStore('aboniment-package', {
    state: () => ({}),
    actions: {
        async addPackage(item) {
            const data = await abonimetPackageService.addPackage(item);
            return data;
        },
        async editPackage(id, item) {
            const data = await abonimetPackageService.editPackage(id, item);
            return data;
        },
        async deletePackage(id) {
            const data = await abonimetPackageService.deletePackage(id);
            return data;
        },
        async getAbonimentPackageByProviderId(id) {
            const data = await abonimetPackageService.getAbonimentPackageByProviderId(id);
            return data;
        }
    }
});
