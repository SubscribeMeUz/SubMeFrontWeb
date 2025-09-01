<script setup>
import { useStatisticsStore } from '@/stores/statistics';
import { ref, reactive, onMounted } from 'vue';
import { useProviderStore } from '@/stores/provider';
import { useAbonimentStore } from '@/stores/aboniments';

const statisticsStore = useStatisticsStore();
const providerStore = useProviderStore();
const abonimentStore = useAbonimentStore();

const tableLoading = ref(false);
const today = new Date();
const previousDate = new Date(today);
previousDate.setDate(today.getDate() - 30);

const credentials = reactive({
    provider_id: null,
    name: '',
    phone: '',
    from_date: previousDate,
    to_date: today,
    abonoment_id: null
});

const providerList = ref(null);
const abonimentList = ref(null);
const userListByUsesTime = ref(null);

async function getProviderAllList() {
    const data = await providerStore.getProviderAllList();
    providerList.value = data;
}

async function getAbonimentByProviderId(id) {
    if (id) {
        const data = await abonimentStore.getAbonimentByProviderId(id);
        abonimentList.value = data;
    } else {
        abonimentList.value = null;
        credentials.aboniment_id = null;
    }
}

async function getPurchasesHistory() {
    try {
        tableLoading.value = true;
        const data = await statisticsStore.getPurchasesHistory(credentials);
        userListByUsesTime.value = data;
    } catch (error) {
        return error;
    } finally {
        tableLoading.value = false;
    }
}

function resetFilter() {
    credentials.provider_id = null;
    credentials.abonoment_id = null;
    credentials.name = '';
    credentials.phone = '';
    credentials.from_date = previousDate;
    credentials.to_date = today;
    getPurchasesHistory();
}

onMounted(() => {
    getProviderAllList();
    getPurchasesHistory();
});
</script>

<template>
    <DataTable :value="userListByUsesTime" :loading="tableLoading" class="card" paginator :rows="20">
        <template #empty>Информация не найдена</template>

        <template #header>
            <form ref="searchForm" class="flex gap-4 flex-col" @submit.prevent="getPurchasesHistory">
                <div class="flex flex-wrap gap-4">
                    <FloatLabel>
                        <DatePicker v-model="credentials.from_date" date-format="yy-mm-dd" class="w-80" />
                        <label>Дата начала</label>
                    </FloatLabel>
                    <FloatLabel>
                        <DatePicker v-model="credentials.to_date" date-format="yy-mm-dd" class="w-80" />
                        <label>Дата окончания</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText v-model="credentials.phone" class="w-80" />
                        <label>Телефон номер</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText v-model="credentials.name" class="w-80" />
                        <label>Поиск по названию</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-wrap gap-4">
                    <FloatLabel>
                        <Select
                            v-model="credentials.provider_id"
                            :options="providerList"
                            option-value="id"
                            option-label="name"
                            filter
                            show-clear
                            class="w-80"
                            @change="getAbonimentByProviderId(credentials.provider_id)"
                        />
                        <label>Список провайдеров</label>
                    </FloatLabel>
                    <FloatLabel>
                        <Select
                            v-model="credentials.abonoment_id"
                            :options="abonimentList"
                            option-value="id"
                            option-label="name"
                            filter
                            show-clear
                            class="w-80"
                        />
                        <label>Список абонементов</label>
                    </FloatLabel>
                    <Button icon="pi pi-filter" raised type="submit" />
                    <Button icon="pi pi-filter-slash" raised severity="danger" @click="resetFilter" />
                </div>
            </form>
        </template>

        <Column field="user_name" header="Название" />
        <Column field="user_phone" header="Телефон номер" />
        <Column field="provider_name" header="Провайдеры" />
        <Column field="abonoment_package_name" header="Абонементные пакеты" />
        <Column field="aboniment_name" header="Абонементы" />
        <Column field="total_amount" header="Общее количество" />
    </DataTable>
</template>
