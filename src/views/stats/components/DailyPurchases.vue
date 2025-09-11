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
const { dailyPurchases } = storeToRefs(statisticsStore);

const lineChartOption = ref({
    title: { text: 'Dailiy Purchases', left: 'center', top: 15 },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: true
        }
    },
    legend: {
        data: ['Sales count'],
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
            name: 'Sales count',
            data: [],
            type: 'line',
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

async function getDailyPurchases() {
    try {
        await statisticsStore.getDailyPurchases(
            formatDate(props.from_date),
            formatDate(props.to_date),
            props.provider_id
        );
        const names = [];
        const values = [];

        dailyPurchases.value.forEach((item) => {
            names.push(item.date);
            values.push(item.total_sales);
        });

        lineChartOption.value.xAxis.data = names;
        lineChartOption.value.series[0].data = values;
    } catch (error) {
        return error;
    }
}

defineExpose({
    getDailyPurchases
});
</script>

<template>
    <div v-if="lineChartOption">
        <v-chart :option="lineChartOption" autoresize class="chart" />
    </div>
</template>

<style scoped>
.chart {
    height: 35.4dvh;
}
</style>
