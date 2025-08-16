<script setup>
import { useStatisticsStore } from '@/stores/statistics';
import { storeToRefs } from 'pinia';
import VChart, { THEME_KEY } from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { UniversalTransition } from 'echarts/features';
import { ref } from 'vue';

use([
    CanvasRenderer,
    BarChart,
    LineChart,
    PieChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    UniversalTransition
]);

const props = defineProps({
    from_date: [String, Date],
    to_date: [String, Date],
    provider_id: [String, Number]
});

const statisticsStore = useStatisticsStore();
const { userAboniment } = storeToRefs(statisticsStore);

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

async function getUserAbonimentUses() {
    await statisticsStore.getUserAbonimentUses(
        formatDate(props.from_date),
        formatDate(props.to_date),
        props.provider_id
    );
}

defineExpose({
    getUserAbonimentUses
});
</script>

<template>
    <div></div>
</template>

<style scoped></style>
