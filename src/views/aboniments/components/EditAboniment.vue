<script setup>
import { useAbonimentStore } from '@/stores/aboniments';
import { ref, reactive, onMounted } from 'vue';
import { useProviderStore } from '@/stores/provider';
import { useWorkoutStore } from '@/stores/workoutTimes';
import { useAbonimentPackageStore } from '@/stores/abonimentPackage';
import { useToast } from 'primevue';

const props = defineProps({
    aboniment_id: [String, Number]
});

const emit = defineEmits(['edited']);

const toast = useToast();

const abonimentStore = useAbonimentStore();
const abonimentPackageStore = useAbonimentPackageStore();
const providerStore = useProviderStore();
const workoutTimesStore = useWorkoutStore();

const abonimentDetail = ref(null);
const providerList = ref(null);
const workoutTimesList = ref(null);
const providerTabsList = ref(null);
const abonimentPackagesList = ref(null);
const editLoading = ref(false);
const provider_id = ref(null);
const credentials = reactive({
    name: '',
    price: 0,
    workout_time_id: null,
    provider_tab_id: null,
    aboniment_package_id: null
});

async function getAbonimentById() {
    try {
        const data = await abonimentStore.getAbonimentById(props.aboniment_id);
        abonimentDetail.value = data;
        provider_id.value = abonimentDetail.value.provider_id;
        getWorkoutByProviderId(provider_id.value);
        getProviderTabsById(provider_id.value);
        getAbonimentPackageByProviderId(provider_id.value);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error,
            life: 3000
        });
    }
}

async function getProviderAllList() {
    const data = await providerStore.getProviderAllList();
    providerList.value = data;
}

async function getWorkoutByProviderId(id) {
    const workoutTimes = await workoutTimesStore.getWorkoutByProviderId(id);
    workoutTimesList.value = workoutTimes;
}

async function getProviderTabsById(id) {
    const tabs = await providerStore.getProviderTabsById(id);
    providerTabsList.value = tabs;
}

async function getAbonimentPackageByProviderId(id) {
    const packageList = await abonimentPackageStore.getAbonimentPackageByProviderId(id);
    abonimentPackagesList.value = packageList;
}

async function selectProvider(id) {
    try {
        if (id) {
            getWorkoutByProviderId(id);
            getProviderTabsById(id);
            getAbonimentPackageByProviderId(id);
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

async function edit() {
    try {
        editLoading.value = true;
        credentials.name = abonimentDetail.value.name;
        credentials.price = abonimentDetail.value.price;
        credentials.workout_time_id = abonimentDetail.value.workout_time_id;
        credentials.provider_tab_id = abonimentDetail.value.provider_tab_id;
        credentials.aboniment_package_id = abonimentDetail.value.aboniment_package_id;
        const data = await abonimentStore.editAboniment(props.aboniment_id, credentials);
        emit('edited', data);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error,
            life: 3000
        });
    } finally {
        editLoading.value = false;
    }
}

onMounted(() => {
    getAbonimentById();
    getProviderAllList();
});
</script>

<template>
    <form ref="editForm" @submit.prevent="edit">
        <div v-if="abonimentDetail" class="flex flex-col gap-6 mt-6">
            <div class="flex flex-wrap gap-4">
                <FloatLabel>
                    <InputText v-model="abonimentDetail.name" required class="w-96" />
                    <label>Name</label>
                </FloatLabel>
                <FloatLabel>
                    <InputNumber v-model="abonimentDetail.price" :min="0" class="w-96" />
                    <label>Price</label>
                </FloatLabel>
            </div>
            <div class="flex flex-wrap gap-4">
                <FloatLabel>
                    <Select
                        v-model="abonimentDetail.provider_id"
                        class="w-96"
                        :options="providerList"
                        option-value="id"
                        option-label="name"
                        filter
                        show-clear
                        @change="selectProvider(abonimentDetail.provider_id)"
                    />
                    <label>provider</label>
                </FloatLabel>
                <FloatLabel>
                    <Select
                        v-model="abonimentDetail.workout_time_id"
                        class="w-96"
                        :options="workoutTimesList"
                        option-value="id"
                        option-label="title"
                        filter
                        show-clear
                    />
                    <label>wokout times list</label>
                </FloatLabel>
            </div>
            <div class="flex flex-wrap gap-4">
                <FloatLabel>
                    <Select
                        v-model="abonimentDetail.provider_tab_id"
                        class="w-96"
                        :options="providerTabsList"
                        option-value="id"
                        option-label="title"
                        filter
                        show-clear
                    />
                    <label>provider tabs</label>
                </FloatLabel>
                <FloatLabel>
                    <Select
                        v-model="abonimentDetail.aboniment_package_id"
                        class="w-96"
                        :options="abonimentPackagesList"
                        option-value="id"
                        option-label="title"
                        filter
                        show-clear
                    />
                    <label>Aboniment packages</label>
                </FloatLabel>
            </div>
            <div class="flex justify-end">
                <Button label="Обновить" raised :loading="editLoading" type="submit" />
            </div>
        </div>
        <div v-else>
            <Skeleton />
        </div>
    </form>
</template>
