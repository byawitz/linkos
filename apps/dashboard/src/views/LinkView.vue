<template>
  <PageHeader class="mb-2" :sub-title="link.id !== '' ? `Link #${link.id}` : ''" :title="title">
    <template #buttons>
      <Button :is-link="true" :to="`/links/${link.id}/edit`" b-type="btn-primary" v-if="link.id !== ''">Edit link</Button>
    </template>
  </PageHeader>

  <Container :isXL="true">
    <div class="row">
      <Card v-if="loading">
        <CardBody class="text-center py-6">
          <h2 class="h2 text-blue pb-4">Getting link</h2>
          <div class="spinner-grow text-blue" role="status"></div>
        </CardBody>
      </Card>

      <template v-else>
        <div class="row">
          <div class="col">
            <Card>
              <CardHeader title="Base info" />

              <CardBody>
                <div class="datagrid">
                  <DatagridItem itemTitle="Short" :value="link.short">
                    <a href="#" @click.prevent="copyToClipboard(link)" class="px-2">
                      <IconCopy :size="18" v-if="!link.copying" />
                      <template v-else>copied</template>
                    </a>

                    <a :href="getShort(link)" target="_blank">
                      <IconExternalLink :size="18" />
                    </a>
                  </DatagridItem>
                  <DatagridItem itemTitle="Destination" :value="link.dest" />
                  <DatagridItem itemTitle="Campaign" :value="link.campaign_id?.toString()" />
                  <!-- TODO: -->
                  <DatagridItem itemTitle="User" :value="link.user_id?.toString()" />
                  <!-- TODO: -->
                  <DatagridItem itemTitle="Description" :value="link.description" />

                  <DatagridStatusItem
                    itemTitle="Plus enabled"
                    :status="!link.plus_enabled ? 'status-red' : 'status-green'"
                    :value="link.plus_enabled"
                  />

                  <DatagridStatusItem
                    itemTitle="Informal enabled"
                    :status="!link.informal_redirection ? 'status-red' : 'status-green'"
                    :value="link.informal_redirection"
                  />

                  <DatagridStatusItem itemTitle="Monitoring" :status="!link.monitor ? 'status-red' : 'status-green'" :value="link.monitor" />

                  <DatagridStatusItem
                    itemTitle="Password protected"
                    :status="link.password_protected ? 'status-red' : 'status-green'"
                    :value="link.password_protected"
                  >
                    <span v-if="link.password_protected" class="ms-2 badge bg-pink text-pink-fg">{{ link.password }}</span>
                  </DatagridStatusItem>

                  <DatagridStatusItem
                    itemTitle="Expiring link"
                    :status="link.expiring_link ? 'status-red' : 'status-green'"
                    :value="link.expiring_link"
                  >
                    <span v-if="link.expiring_link" class="badge bg-pink text-pink-fg ms-2">{{
                      new Date(link.expiration_date ?? '').toLocaleDateString()
                    }}</span>
                  </DatagridStatusItem>

                  <DatagridItem itemTitle="Last edited" :value="new Date(link.updated_at).toLocaleString()" />
                  <DatagridItem itemTitle="Created at" :value="new Date(link.created_at).toLocaleString()" />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 col-xl-4 col-12">
            <Card class="mt-4">
              <CardBody>
                <div class="d-flex"><h3 class="card-title">Clicks</h3></div>

                <div class="row">
                  <div class="col">
                    <div id="clicks-chart" class="chart-lg"></div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div class="col-md-6 col-xl-4 col-12">
            <Card class="mt-4">
              <CardBody>
                <div class="d-flex"><h3 class="card-title">Devices</h3></div>

                <div class="row">
                  <div class="col">
                    <div id="devices-chart" class="chart-lg"></div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div class="col-md-6 col-xl-4 col-12">
            <Card class="mt-4">
              <CardBody>
                <div class="d-flex"><h3 class="card-title">Countries</h3></div>

                <div class="row">
                  <div class="col">
                    <div id="countries-chart"></div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div class="col-md-6 col-xl-4 col-12">
            <Card class="mt-4">
              <CardBody>
                <div class="d-flex"><h3 class="card-title">Cities</h3></div>
                <div class="row">
                  <div class="col">
                    <div id="cities-chart"></div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div class="col-md-6 col-xl-4 col-12">
            <Card class="mt-4">
              <CardBody>
                <div class="d-flex"><h3 class="card-title">Referrers</h3></div>

                <div class="row">
                  <div class="col">
                    <div id="referrers-chart"></div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </template>
    </div>
  </Container>
</template>

<script setup lang="ts">
import PageHeader from '@/components/layouts/PageHeader.vue';
import { useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import Container from '@/components/layouts/Container.vue';
import Card from '@/components/layouts/Card.vue';
import CardBody from '@/components/layouts/CardBody.vue';
import NetworkHelper from '@/heplers/NetworkHelper';
import LinkModel from '@@/db/LinkModel';
import DatagridItem from '@/components/data/DatagridItem.vue';
import DatagridStatusItem from '@/components/data/DatagridStatusItem.vue';
import CardHeader from '@/components/layouts/CardHeader.vue';
import Button from '@/components/form/Button.vue';
import { IconCopy, IconExternalLink } from '@tabler/icons-vue';
import { useUserStore } from '@/stores/user';
import ApexCharts from 'apexcharts';

const router = useRouter();

const loading = ref(true);
const link = ref(new LinkModel());
const title = computed(() => (link.value.title !== '' ? link.value.title : 'View link'));
const store = useUserStore();

async function getLink() {
  const res = await NetworkHelper.get(NetworkHelper.linkWithStat + router.currentRoute.value.params.id);
  if (res.success) {
    link.value = res.data;
  } else {
    // TODO: Toast for error
  }

  loading.value = false;
}

async function copyToClipboard(link: LinkModel) {
  await navigator.clipboard.writeText(getShort(link));

  link.copying = true;
  setTimeout(() => (link.copying = false), 450);
}

function getShort(link: LinkModel) {
  return `${store.server.host}/${link.short}`;
}

function loadCharts() {
  loadDevices();
  loadClicks();
  loadCountries();
  loadCities();
  loadReferrers();
}

function loadDevices() {
  new ApexCharts(document.getElementById('devices-chart'), {
    theme: { mode: 'light' },
    series: [
      {
        name: 'Unknown',
        data: [31, 40, 28, 51, 42, 109, 100]
      },
      {
        name: 'Mobile',
        data: [11, 32, 45, 32, 34, 52, 41]
      },
      {
        name: 'Desktop',
        data: [18, 32, 54, 32, 43, 25, 14]
      }
    ],
    chart: { background: 'transparent', height: 240, type: 'area', toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: {
      type: 'datetime',
      categories: [
        '2018-09-19T00:00:00.000Z',
        '2018-09-20T01:30:00.000Z',
        '2018-09-21T02:30:00.000Z',
        '2018-09-22T03:30:00.000Z',
        '2018-09-23T04:30:00.000Z',
        '2018-09-24T05:30:00.000Z',
        '2018-09-25T06:30:00.000Z'
      ]
    },
    tooltip: { x: { format: 'dd/MM/yy' } }
  }).render();
}

function loadClicks() {
  new ApexCharts(document.querySelector('#clicks-chart'), {
    theme: { mode: 'light' },
    series: [
      {
        name: 'Direct',
        data: [14, 21, 33, 25, 15, 6]
      },
      {
        name: 'QR',
        data: [1, 25, 13, 16, 5, 64]
      }
    ],
    chart: {
      background: 'transparent',
      type: 'area',
      toolbar: { show: false },

      height: 240,
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'straight'
    },
    labels: ['1', '2', '3', '4', '5', '6'],
    yaxis: {
      opposite: true
    },
    legend: {
      horizontalAlign: 'left'
    }
  }).render();
}

function loadCountries() {
  new ApexCharts(document.querySelector('#countries-chart'), {
    theme: { mode: 'light' },
    series: [
      {
        data: [900, 730, 648, 570, 440, 380, 370, 340, 280, 190]
      }
    ],
    chart: {
      background: 'transparent',
      type: 'bar',
      height: 240,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: ['USA', 'UK', 'Israel', 'Lebanon', 'Egypt', 'Iran', 'Iraq', 'China', 'Japan', 'Italy']
    },
    grid: {
      xaxis: { lines: { show: false } }
    },
    yaxis: {
      axisTicks: { show: true }
    }
  }).render();
}

function loadCities() {
  new ApexCharts(document.querySelector('#cities-chart'), {
    theme: { mode: 'light' },
    series: [
      {
        data: [2900, 1730, 1648, 1570, 1440, 1380, 1370, 1340, 1280, 1190]
      }
    ],
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
    xaxis: {
      categories: ['Unknown', 'New York', 'Istanbul', 'Las Vegas', 'Los Angels', 'London', 'Tokyo', 'Jerusalem', 'Rome', 'Damascus']
    }
  }).render();
}

function loadReferrers() {
  new ApexCharts(document.querySelector('#referrers-chart'), {
    theme: { mode: 'light' },
    series: [
      {
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
      }
    ],
    chart: { background: 'transparent', type: 'bar', height: 240, toolbar: { show: false } },
    plotOptions: {
      bar: { borderRadius: 4, horizontal: true }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany']
    }
  }).render();
}

onMounted(async () => {
  await getLink();
  loadCharts();
});
</script>
