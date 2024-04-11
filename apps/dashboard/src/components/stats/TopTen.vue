<template>
  <div class="col-md-6 col-xl-4 col-12">
    <Card>
      <CardBody>
        <div class="d-flex">
          <h3 class="card-title" v-text="title" />
        </div>
        <div class="row">
          <div class="col">
            <div ref="chart"></div>
          </div>
        </div>
      </CardBody>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import ApexCharts from 'apexcharts';
import Card from '@/components/layouts/Card.vue';
import CardBody from '@/components/layouts/CardBody.vue';
import { useAppStore } from '@/stores/user';
import DomHelper from '@/heplers/DomHelper';

const props = defineProps({
  title: { type: String, default: '' },
  series: { type: Array, default: [] },
  categories: { type: Array, default: [] }
});

const chart = ref();
const { app } = useAppStore();

const theme = computed(() => (app.theme === 'system' ? DomHelper.getTheme() : app.theme));

onMounted(() => {
  renderChart();
});

function renderChart() {
  new ApexCharts(chart.value, {
    theme: { mode: theme.value },
    series: [{ data: props.series }],
    chart: {
      background: 'transparent',
      type: 'bar',
      height: 240,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: { categories: props.categories }
  }).render();
}
</script>
