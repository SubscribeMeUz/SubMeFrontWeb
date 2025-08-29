import { defineStore } from 'pinia';
import { StatisticsService } from '@/service/statistics.service';

export const useStatisticsStore = defineStore('statistics', {
    state: () => ({
        dailyPurchases: [],
        activeAboniments: [],
        userAboniment: [],
        usesWithTime: []
    }),
    actions: {
        async getDailyPurchases(from_date, to_date, provider_id) {
            const data = await StatisticsService.getDailyPurchases(from_date, to_date, provider_id);
            this.dailyPurchases = data;
            return data;
        },
        async getActiveAboniments(from_date, to_date, provider_id) {
            const data = await StatisticsService.getActiveAboniments(from_date, to_date, provider_id);
            this.activeAboniments = data;
            return data;
        },
        async getUserAbonimentUses(from_date, to_date, provider_id) {
            const data = await StatisticsService.getUserAbonimentUses(from_date, to_date, provider_id);
            this.userAboniment = data;
            return data;
        },
        async getUsesWithTime(from_date, to_date, provider_id) {
            const data = await StatisticsService.getUsesWithTime(from_date, to_date, provider_id);
            this.usesWithTime = data;
            return data;
        },
        async getUserListByUseTimes(items) {
            const data = await StatisticsService.getUserListByUseTimes(items);
            return data;
        }
    }
});
