<script setup>
import { useStatisticsStore } from '@/stores/statistics';
import VChart, { THEME_KEY } from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart, TreeChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { UniversalTransition } from 'echarts/features';
import { ref } from 'vue';

use([
    CanvasRenderer,
    BarChart,
    LineChart,
    TreeChart,
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
const response = ref();

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

async function getUserAbonimentUses() {
    try {
        response.value = await statisticsStore.getUserAbonimentUses(
            formatDate(props.from_date),
            formatDate(props.to_date),
            props.provider_id
        );
    } catch (error) {
        return error;
    }
}

const option = ref({
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove' // yoki 'click'
    },
    series: [
        {
            type: 'tree',
            data: [
                {
                    name: 'Root',
                    children: [
                        {
                            name: 'Child 1',
                            children: [{ name: 'Grandchild 1' }, { name: 'Grandchild 2' }]
                        },
                        {
                            name: 'Child 2'
                        }
                    ]
                }
            ],
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',

            symbolSize: 15, // tugun (node) o‘lchami

            label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 14
            },
            leaves: {
                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                }
            },

            expandAndCollapse: true, // ochib yopilishi
            animationDuration: 550,
            animationDurationUpdate: 750
        }
    ]
});

defineExpose({
    getUserAbonimentUses
});
</script>

<template>
    <div></div>
    <!-- <v-chart v-if="option" :option="option" class="chart"></v-chart> -->
</template>

<style scoped>
.chart {
    height: 50vh;
}
</style>
