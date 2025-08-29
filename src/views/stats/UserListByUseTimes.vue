<script setup>
import { useStatisticsStore } from '@/stores/statistics';
import { ref, reactive, onMounted } from 'vue';
import { useProviderStore } from '@/stores/provider';
import { useAbonimentStore } from '@/stores/aboniments';

const statisticsStore = useStatisticsStore();
const providerStore = useProviderStore();
const abonimentStore = useAbonimentStore();

const tableLoading = ref(false);
const credentials = reactive({
    provider_id: null,
    name: '',
    phone: '',
    from_date: '',
    to_date: '',
    aboniment_id: null
});

const providerList = ref(null);
const abonimentList = ref(null);

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
    }
}

onMounted(() => {
    getProviderAllList();
});
</script>

<template>
    <div></div>
</template>
