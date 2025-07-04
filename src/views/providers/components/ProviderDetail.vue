<script setup>
import { useProviderStore } from '@/stores/provider';
import { onMounted, ref } from 'vue';
import ProviderTabs from './ProviderTabs.vue';
import { useToast } from 'primevue';
import WorkoutTimes from './WorkoutTimes.vue';
import AbonimentPackages from './AbonimentPackages.vue';
import PhotoProviders from './PhotoProviders.vue';
import router from '@/router';

const props = defineProps({
    id: [String, Number]
});

const toast = useToast();

const providerStore = useProviderStore();

const providerDetail = ref(null);
const providerTabs = ref(null);
const workoutTimes = ref(null);
const abonimentPackages = ref(null);
const loading = ref(false);
const tab = ref(3);
const photos = ref(null);

async function getProviderDetail() {
    try {
        loading.value = true;
        const data = await providerStore.getProviderByProviderId(props.id);
        providerDetail.value = data;
        if (providerDetail.value.provider_tabs && providerDetail.value.provider_tabs.length > 0) {
            providerTabs.value = providerDetail.value?.provider_tabs;
        }
        if (providerDetail.value.workout_times && providerDetail.value.workout_times.length > 0) {
            workoutTimes.value = providerDetail.value?.workout_times;
        }
        if (providerDetail.value.aboniment_packages && providerDetail.value.aboniment_packages.length > 0) {
            abonimentPackages.value = providerDetail.value?.aboniment_packages;
        }
        if (providerDetail.value.photos && providerDetail.value.photos.length > 0) {
            photos.value = providerDetail.value?.photos;
        }
    } catch (error) {
        return error;
    } finally {
        loading.value = false;
    }
}

function createdItem(data) {
    if (data.status == 201 || data.status == 200) {
        toast.add({
            severity: 'success',
            summary: 'Успешно!',
            detail: 'Создано успешно',
            life: 3000
        });
        getProviderDetail();
    } else {
        toast.add({
            severity: 'error',
            summary: 'Ошибка!',
            detail: data.response.data.detail?.error_message || data.response.data.detail[0].msg,
            life: 3000
        });
    }
}

async function deletedItem(data) {
    providerTabs.value = [];
    workoutTimes.value = [];
    if (data.status == 200) {
        toast.add({
            severity: 'success',
            summary: 'Удалено',
            detail: 'Успешно удалено',
            life: 3000
        });
        getProviderDetail();
    } else {
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'При удалении произошла ошибка',
            life: 3000
        });
    }
}

function editedItem(data) {
    if (data.status == 200) {
        toast.add({
            severity: 'success',
            summary: 'Успешно!',
            detail: 'Успешно обновлено',
            life: 3000
        });
        getProviderDetail();
    } else {
        toast.add({
            severity: 'error',
            summary: 'Ошибка!',
            detail: data.response.data.detail?.error_message || data.response.data.detail[0].msg,
            life: 3000
        });
    }
}

onMounted(() => {
    getProviderDetail();
});
</script>

<template>
    <div class="card p-6">
        <ProgressBar v-if="loading" mode="indeterminate" class="my-2" style="height: 8px" />

        <Tabs :value="tab">
            <TabList>
                <div class="flex justify-between items-center w-full pr-3">
                    <div>
                        <Tab :value="0">Панели провайдеров</Tab>
                        <Tab :value="1">Время работы</Tab>
                        <Tab :value="2">Абонементные пакеты</Tab>
                        <Tab :value="3">Фото провайдеров</Tab>
                    </div>
                    <Button
                        icon="pi pi-arrow-left"
                        label="Назад"
                        severity="secondary"
                        @click="router.push('/provider/list')"
                    />
                </div>
            </TabList>

            <Tabpanels>
                <TabPanel :value="0">
                    <ProviderTabs
                        :providerTabs="providerTabs"
                        :providerId="props.id"
                        @created="createdItem"
                        @deleted="deletedItem"
                        @edited="editedItem"
                /></TabPanel>
                <TabPanel :value="1">
                    <WorkoutTimes
                        :workoutTimes="workoutTimes"
                        :providerId="props.id"
                        @created="createdItem"
                        @deleted="deletedItem"
                        @edited="editedItem"
                    />
                </TabPanel>
                <TabPanel :value="2">
                    <AbonimentPackages
                        :providerId="props.id"
                        :abonimentPackages="abonimentPackages"
                        @created="createdItem"
                        @deleted="deletedItem"
                        @edited="editedItem"
                    />
                </TabPanel>
                <TabPanel :value="3">
                    <PhotoProviders
                        :providerId="props.id"
                        :photos="photos"
                        @created="createdItem"
                        @deleted="deletedItem"
                    />
                </TabPanel>
            </Tabpanels>
        </Tabs>
    </div>
</template>
