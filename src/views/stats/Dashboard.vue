<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { useProviderStore } from '@/stores/provider';
import ActiveAboniments from './components/ActiveAboniments.vue';
import DailyPurchases from './components/DailyPurchases.vue';
import UserAboniments from './components/UserAboniments.vue';
import UsesWithTime from './components/UsesWithTime.vue';
import RejectAndAccepts from './components/RejectAndAccepts.vue';

const providerStore = useProviderStore();

const today = new Date();
const previousDate = new Date(today);
previousDate.setDate(today.getDate() - 90);
const from_date = ref(formatDate(previousDate));
const to_date = ref(formatDate(today));
const provider_id = ref(null);
const providerList = ref(null);
const filterLoading = ref(false);
const resetLoading = ref(false);
const activeAbonimentsRef = ref();
const dailyPurchasesRef = ref();
const userAbonimentsRef = ref();
const usesWithTimeRef = ref();
const rejectAndAcceptsRef = ref();

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

async function getProviderAllList() {
    const data = await providerStore.getProviderAllList();
    providerList.value = data;
}

async function getAllStatistics() {
    try {
        filterLoading.value = true;
        getStatistics();
    } catch (error) {
        return error;
    } finally {
        filterLoading.value = false;
    }
}

async function resetFilter() {
    try {
        resetLoading.value = true;
        from_date.value = formatDate(previousDate);
        to_date.value = formatDate(today);
        provider_id.value = null;
        await nextTick();

        getStatistics();
    } catch (error) {
        return error;
    } finally {
        resetLoading.value = false;
    }
}

async function getStatistics() {
    try {
        await activeAbonimentsRef.value.getActiveAboniments();
        await dailyPurchasesRef.value.getDailyPurchases();
        await userAbonimentsRef.value.getUserAbonimentUses();
        await usesWithTimeRef.value.getUsesWithTime();
        await rejectAndAcceptsRef.value.getRejectionAndAcceptCount();
    } catch (error) {
        return error;
    }
}

onMounted(() => {
    getProviderAllList();
    getAllStatistics();
});
</script>

<template>
    <div class="card">
        <form ref="searchForm" class="flex flex-wrap gap-4 py-2" @submit.prevent="getAllStatistics">
            <FloatLabel>
                <DatePicker v-model="from_date" date-format="yy-mm-dd" />
                <label>Дата начала</label>
            </FloatLabel>
            <FloatLabel>
                <DatePicker v-model="to_date" date-format="yy-mm-dd" />
                <label>Дата окончания</label>
            </FloatLabel>
            <FloatLabel>
                <Select
                    v-model="provider_id"
                    :options="providerList"
                    option-value="id"
                    option-label="name"
                    class="w-80"
                    filter
                    show-clear
                />
                <label>Список провайдеров</label>
            </FloatLabel>
            <Button icon="pi pi-filter" raised :loading="filterLoading" type="submit" />
            <Button
                icon="pi pi-filter-slash"
                raised
                severity="danger"
                :loading="resetLoading"
                @click="resetFilter"
            />
        </form>
    </div>

    <div class="card">
        <div class="grid grid-cols-12">
            <div class="col-span-6">
                <DailyPurchases
                    ref="dailyPurchasesRef"
                    :from_date="from_date"
                    :to_date="to_date"
                    :provider_id="provider_id"
                />
            </div>
            <div class="col-span-6">
                <ActiveAboniments
                    ref="activeAbonimentsRef"
                    :from_date="from_date"
                    :to_date="to_date"
                    :provider_id="provider_id"
                />
            </div>
        </div>
        <div class="grid grid-cols-12">
            <div class="col-span-8">
                <UsesWithTime
                    ref="usesWithTimeRef"
                    :from_date="from_date"
                    :to_date="to_date"
                    :provider_id="provider_id"
                />
            </div>
            <div class="col-span-4 mt-8">
                <RejectAndAccepts ref="rejectAndAcceptsRef" :from_date="from_date" :to_date="to_date" />
            </div>
        </div>
        <div class="grid grid-cols-12">
            <div class="col-span-12">
                <UserAboniments
                    ref="userAbonimentsRef"
                    :from_date="from_date"
                    :to_date="to_date"
                    :provider_id="provider_id"
                />
            </div>
        </div>
    </div>
</template>
