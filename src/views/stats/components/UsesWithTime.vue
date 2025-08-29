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
const { usesWithTime } = storeToRefs(statisticsStore);

const barChartOption = ref({
    title: { text: 'Uses with time', left: 'center', top: 15 },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: true
        }
    },
    legend: {
        data: ['Uses with time'],
        top: 'bottom'
    },
    xAxis: {
        type: 'category',
        data: [],
        axisPointer: {
            type: 'shadow'
        }
    },
    yAxis: {
        type: 'value',
        name: 'Amount',
        axisLabel: {
            formatter: '{value}'
        }
    },
    series: [
        {
            name: 'Uses with time',
            data: [],
            type: 'bar',
            smooth: true,
            tooltip: {
                valueFormatter: function (value) {
                    return value + '';
                }
            }
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

async function getUsesWithTime() {
    await statisticsStore.getUsesWithTime(
        formatDate(props.from_date),
        formatDate(props.to_date),
        props.provider_id
    );
    const names = [];
    const values = [];

    usesWithTime.value.forEach((item) => {
        names.push(item.hour);
        values.push(item.total_sales);
    });

    barChartOption.value.xAxis.data = names;
    barChartOption.value.series[0].data = values;
}

defineExpose({
    getUsesWithTime
});
</script>

<template>
    <div v-if="barChartOption" class="mt-4">
        <v-chart :option="barChartOption" autoresize class="chart" />
    </div>
</template>

<style scoped>
.chart {
    height: 35.4dvh;
}
</style>
