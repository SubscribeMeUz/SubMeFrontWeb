<script setup>
import { useStatisticsStore } from '@/stores/statistics';
import { ref } from 'vue';

import VChart, { THEME_KEY } from 'vue-echarts';
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout]);

const props = defineProps({
    from_date: [String, Date],
    to_date: [String, Date],
    provider_id: [String, Number]
});

const option = ref({
    title: {
        text: 'Запросы на закупки',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: '',
        top: 'center'
    },
    series: [
        {
            name: 'Запросы на закупки',
            type: 'pie',
            radius: '60%',
            data: [
                { value: 0, name: 'Новый' },
                { value: 0, name: 'Принято' },
                { value: 0, name: 'Отказано' }
            ],
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
});

const statisticsStore = useStatisticsStore();

const response = ref(null);

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

async function getRejectionAndAcceptCount() {
    try {
        const data = await statisticsStore.getRejectionAndAcceptCount(
            formatDate(props.from_date),
            formatDate(props.to_date)
        );
        response.value = data;

        option.value.series[0].data[0].value = response.value?.new;
        option.value.series[0].data[1].value = response.value?.accessed;
        option.value.series[0].data[2].value = response.value?.denied || 0;
    } catch (error) {
        return error;
    }
}

defineExpose({
    getRejectionAndAcceptCount
});
</script>

<template>
    <div v-if="option">
        <v-chart :option="option" autoresize class="chart" />
    </div>
</template>

<style scoped>
.chart {
    height: 36dvh;
}
</style>
