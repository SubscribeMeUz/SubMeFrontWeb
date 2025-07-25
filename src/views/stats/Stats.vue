<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import VChart, { THEME_KEY } from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { UniversalTransition } from 'echarts/features';

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

const monthSales = ref(null);
const yearSales = ref(null);
const customerChange = ref(null);

onMounted(() => {
    gsap.to(monthSales.value, {
        innerText: 21718.73,
        duration: 2,
        snap: { innerText: 0.01 },
        onUpdate() {
            monthSales.value.innerText = `$${(+monthSales.value.innerText).toFixed(2)}`;
        }
    });

    gsap.to(yearSales.value, {
        innerText: 808696.5,
        duration: 2,
        snap: { innerText: 0.1 },
        onUpdate() {
            yearSales.value.innerText = `$${(+yearSales.value.innerText).toFixed(2)}`;
        }
    });

    gsap.to(customerChange.value, {
        innerText: 5,
        duration: 1.5,
        snap: { innerText: 1 },
        onUpdate() {
            customerChange.value.innerText = `+${Math.round(customerChange.value.innerText)}`;
        }
    });
});

const lineChartOption = {
    title: { text: 'Последние транзакции', left: 'center', top: 10 },
    xAxis: { type: 'category', data: Array.from({ length: 30 }, (_, i) => `Sep ${i + 8}`) },
    yAxis: { type: 'value' },
    series: [
        {
            data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000)),
            type: 'line',
            smooth: true
        }
    ]
};

const pieChartOption = {
    title: { text: 'Типы продаж', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { bottom: 'bottom' },
    series: [
        {
            type: 'pie',
            radius: '50%',
            data: [
                { value: 40, name: 'обновление' },
                { value: 30, name: 'новый' },
                { value: 30, name: 'отмена' }
            ]
        }
    ]
};

const barChartOption = {
    title: { text: 'Показатели продаж по месяцам', left: 'center' },
    xAxis: {
        type: 'category',
        data: ['1/19', '3/19', '5/19', '7/19', '9/19', '10/19']
    },
    yAxis: { type: 'value' },
    series: [
        {
            data: [85000, 47000, 78000, 83000, 75000, 12000],
            type: 'bar'
        }
    ]
};

const barCompareOption = {
    title: { text: 'Прогнозируемый доход', left: 'center' },
    legend: { data: ['Прогнозируемый', 'Фактический'], top: 'bottom' },
    xAxis: {
        type: 'category',
        data: ['1/19', '3/19', '5/19', '7/19', '9/19', '10/19']
    },
    yAxis: { type: 'value' },
    series: [
        {
            name: 'Прогнозируемый',
            type: 'bar',
            data: [100000, 200000, 400000, 600000, 700000, 800000],
            itemStyle: { color: '#4FADF7' }
        },
        {
            name: 'Фактический',
            type: 'bar',
            data: [80000, 150000, 350000, 550000, 680000, 720000],
            itemStyle: { color: '#9AD0F5' }
        }
    ]
};
</script>

<template>
    <div class="p-6 space-y-6 card">
        <div class="grid grid-cols-3 gap-6">
            <div class="p-4 rounded-2xl shadow">
                <h2 class="text-2xl text-center font-bold text-blue-500" ref="monthSales">$0.00</h2>
                <p class="text-gray-500 text-center">Общий объем продаж в этом месяце</p>
            </div>
            <div class="p-4 rounded-2xl shadow">
                <h2 class="text-2xl text-center font-bold text-blue-500" ref="yearSales">$0.00</h2>
                <p class="text-gray-500 text-center">Общий объем продаж в этом году</p>
            </div>
            <div class="p-4 rounded-2xl shadow">
                <h2 class="text-2xl text-center font-bold text-green-500" ref="customerChange">+0</h2>
                <p class="text-gray-500 text-center">Изменение в составе клиентов</p>
            </div>
        </div>

        <div v-if="lineChartOption && pieChartOption" class="grid grid-cols-2 gap-6">
            <v-chart :option="lineChartOption" autoresize class="chart" />
            <v-chart :option="pieChartOption" autoresize class="chart" />
        </div>

        <div v-if="barChartOption && barCompareOption" class="grid grid-cols-2 gap-6">
            <v-chart :option="barChartOption" autoresize class="chart" />
            <v-chart :option="barCompareOption" autoresize class="chart" />
        </div>
    </div>
</template>

<style scoped>
.chart {
    height: 35.4dvh;
}
</style>
