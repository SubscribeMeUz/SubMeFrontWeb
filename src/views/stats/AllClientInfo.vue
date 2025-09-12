<script setup>
import { useStatisticsStore } from '@/stores/statistics';
import { ref, reactive, onMounted } from 'vue';

const statisticsStore = useStatisticsStore();

const filterCredentials = reactive({
    name: '',
    phone_number: '',
    min_count: null,
    max_count: null,
    from_date: null,
    to_date: null
});
const tableLoading = ref(false);
const allClientInfo = ref(null);

async function getAllClientInfo() {
    try {
        tableLoading.value = true;
        const data = await statisticsStore.getAllClientInfo(filterCredentials);
        allClientInfo.value = data;
    } catch (error) {
        return error;
    } finally {
        tableLoading.value = false;
    }
}

function resetFilter() {
    filterCredentials.name = '';
    filterCredentials.phone_number = '';
    filterCredentials.min_count = null;
    filterCredentials.max_count = null;
    filterCredentials.from_date = null;
    filterCredentials.to_date = null;
    getAllClientInfo();
}

onMounted(() => {
    getAllClientInfo();
});
</script>

<template>
    <DataTable :value="allClientInfo" :loading="tableLoading" class="card" paginator :rows="20">
        <template #empty>Информация не найдена</template>

        <template #header>
            <form ref="searchForm" class="flex gap-6 flex-col" @submit.prevent="getAllClientInfo">
                <div class="flex flex-wrap gap-4">
                    <FloatLabel>
                        <DatePicker
                            v-model="filterCredentials.from_date"
                            date-format="yy-mm-dd"
                            class="w-80"
                        />
                        <label>Дата начала</label>
                    </FloatLabel>
                    <FloatLabel>
                        <DatePicker v-model="filterCredentials.to_date" date-format="yy-mm-dd" class="w-80" />
                        <label>Дата окончания</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText v-model="filterCredentials.phone" class="w-80" />
                        <label>Телефон номер</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText v-model="filterCredentials.name" class="w-80" />
                        <label>Поиск по названию</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-wrap gap-4">
                    <FloatLabel>
                        <InputNumber v-model="filterCredentials.min_count" class="w-80" />
                        <label>Мин. количество</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputNumber v-model="filterCredentials.max_count" class="w-80" />
                        <label>Макс. количество</label>
                    </FloatLabel>
                    <Button icon="pi pi-filter" type="submit" />
                    <Button icon="pi pi-filter-slash" raised severity="danger" @click="resetFilter" />
                </div>
            </form>
        </template>

        <Column field="full_name" header="Название" />
        <Column field="phone_number" header="Телефон номер" />
        <Column field="purchase_count" header="Количество покупок" />
        <Column field="last_purchase_date" header="Дата покупки">
            <template #body="slotProps">
                {{ slotProps.data.last_purchase_date.split('T')[0] }}
            </template>
        </Column>
    </DataTable>
</template>
