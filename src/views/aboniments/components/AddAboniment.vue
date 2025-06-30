<script setup>
import { useAbonimentStore } from '@/stores/aboniments';
import { ref, reactive, onMounted } from 'vue';
import { useProviderStore } from '@/stores/provider';
import { useWorkoutStore } from '@/stores/workoutTimes';
import { useAbonimentPackageStore } from '@/stores/abonimentPackage';
import { useToast } from 'primevue';

const emit = defineEmits(['created']);

const toast = useToast();

const abonimentStore = useAbonimentStore();
const abonimentPackageStore = useAbonimentPackageStore();
const providerStore = useProviderStore();
const workoutTimesStore = useWorkoutStore();

const providerList = ref(null);
const workoutTimesList = ref(null);
const providerTabsList = ref(null);
const abonimentPackagesList = ref(null);
const createLoading = ref(false);
const credentials = reactive({
    name: '',
    price: 0,
    provider_id: null,
    workout_time_id: null,
    provider_tab_id: null,
    aboniment_package_id: null
});

async function getProviderAllList() {
    const data = await providerStore.getProviderAllList();
    providerList.value = data;
}

async function selectProvider(id) {
    try {
        if (id) {
            const workoutTimes = await workoutTimesStore.getWorkoutByProviderId(id);
            const tabs = await providerStore.getProviderTabsById(id);
            const packageList = await abonimentPackageStore.getAbonimentPackageByProviderId(id);
            workoutTimesList.value = workoutTimes;
            providerTabsList.value = tabs;
            abonimentPackagesList.value = packageList;
        } else {
            workoutTimesList.value = [];
            providerTabsList.value = [];
            abonimentPackagesList.value = [];
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error,
            life: 3000
        });
    }
}

async function create() {
    try {
        createLoading.value = true;
        const data = await abonimentStore.addAboniment(credentials);
        emit('created', data);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error,
            life: 3000
        });
    } finally {
        createLoading.value = false;
    }
}

onMounted(() => {
    getProviderAllList();
});
</script>

<template>
    <form ref="createForm" @submit.prevent="create">
        <div class="flex flex-col gap-6 mt-6">
            <div class="flex flex-wrap gap-4">
                <FloatLabel>
                    <InputText v-model="credentials.name" required class="w-96" />
                    <label>Название</label>
                </FloatLabel>
                <FloatLabel>
                    <InputNumber v-model="credentials.price" :min="0" class="w-96" />
                    <label>Цена</label>
                </FloatLabel>
            </div>
            <div class="flex flex-wrap gap-4">
                <FloatLabel>
                    <Select
                        v-model="credentials.provider_id"
                        class="w-96"
                        :options="providerList"
                        option-value="id"
                        option-label="name"
                        filter
                        show-clear
                        @change="selectProvider(credentials.provider_id)"
                    />
                    <label>Список провайдеров</label>
                </FloatLabel>
                <FloatLabel>
                    <Select
                        v-model="credentials.workout_time_id"
                        class="w-96"
                        :options="workoutTimesList"
                        option-value="id"
                        option-label="title"
                        filter
                        show-clear
                    />
                    <label>Время работы</label>
                </FloatLabel>
            </div>
            <div class="flex flex-wrap gap-4">
                <FloatLabel>
                    <Select
                        v-model="credentials.provider_tab_id"
                        class="w-96"
                        :options="providerTabsList"
                        option-value="id"
                        option-label="title"
                        filter
                        show-clear
                    />
                    <label>Список вкладок поставщиков</label>
                </FloatLabel>
                <FloatLabel>
                    <Select
                        v-model="credentials.aboniment_package_id"
                        class="w-96"
                        :options="abonimentPackagesList"
                        option-value="id"
                        option-label="title"
                        filter
                        show-clear
                    />
                    <label>Абонементные пакеты</label>
                </FloatLabel>
            </div>
            <div class="flex justify-end">
                <Button label="Создать" raised :loading="createLoading" type="submit" />
            </div>
        </div>
    </form>
</template>
