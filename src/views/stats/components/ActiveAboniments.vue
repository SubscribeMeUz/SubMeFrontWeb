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
const { activeAboniments } = storeToRefs(statisticsStore);

const chartOption = ref({
    title: { text: 'Active Aboniments', left: 'center', top: 20 },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: true
        }
    },
    legend: {
        data: ['Active Aboniments'],
        top: 'bottom'
    },
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: { type: 'value', name: 'Amount' },
    series: [
        {
            name: 'Active Aboniments',
            data: [],
            type: 'bar',
            smooth: true
        }
    ]
});

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

async function getActiveAboniments() {
    try {
        await statisticsStore.getActiveAboniments(
            formatDate(props.from_date),
            formatDate(props.to_date),
            props.provider_id
        );
        const names = [];
        const values = [];

        activeAboniments.value.forEach((item) => {
            names.push(item.aboniment_name);
            values.push(item.active_count);
        });

        chartOption.value.xAxis.data = names;
        chartOption.value.series[0].data = values;
    } catch (error) {
        return error;
    }
}

defineExpose({
    getActiveAboniments
});
</script>

<template>
    <div v-if="chartOption" class="mt-4">
        <v-chart :option="chartOption" autoresize class="chart" />
    </div>
</template>

<style scoped>
.chart {
    height: 35.4dvh;
}
</style>
