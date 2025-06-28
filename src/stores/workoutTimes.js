import { workoutService } from '@/service/workoutTimes.service';
import { defineStore } from 'pinia';

export const useWorkoutStore = defineStore('workout', {
    state: () => ({}),
    actions: {
        async addWorkout(item) {
            const data = await workoutService.addWorkout(item);
            return data;
        },
        async deleteWorkout(id) {
            const data = await workoutService.deleteWorkout(id);
            return data;
        },
        async editWorkout(id, item) {
            const data = await workoutService.editWorkout(id, item);
            return data;
        },
        async getWorkoutByProviderId(id) {
            const data = await workoutService.getWorkoutByProviderId(id);
            return data;
        }
    }
});
