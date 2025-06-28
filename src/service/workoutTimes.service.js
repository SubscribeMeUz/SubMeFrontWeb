import axios from '@/library/axios';

export const workoutService = {
    async addWorkout(item) {
        const data = await axios.post('/web/workout-times/add', item);
        return data;
    },
    async deleteWorkout(id) {
        const data = await axios.delete(`/web/workout-times/delete/${id}`);
        return data;
    },
    async editWorkout(id, item) {
        const data = await axios.put(`/web/workout-times/edit/${id}`, item);
        return data;
    },
    async getWorkoutByProviderId(provider_id) {
        const { data } = await axios.get(`/web/workout-times/get-all/${provider_id}`);
        return data;
    }
};
