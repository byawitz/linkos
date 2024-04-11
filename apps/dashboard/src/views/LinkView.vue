<template>
  <PageHeader class="mb-2" :sub-title="link.id !== '' ? `${$t('Link')} #${link.id}` : ''" :title="title">
    <template #buttons>
      <Button :is-link="true" :to="`/links/${link.id}/edit`" b-type="btn-primary" v-if="link.id !== ''">{{ $t('Edit link') }}</Button>
    </template>
  </PageHeader>

  <Container :isXL="true">
    <div class="row">
      <Card v-if="loading">
        <CardBody class="text-center py-6">
          <h2 class="h2 text-blue pb-4">{{ $t('Getting link') }}</h2>
          <div class="spinner-grow text-blue" role="status"></div>
        </CardBody>
      </Card>

      <template v-else>
        <div class="col-12">
          <Card>
            <CardHeader :title="$t('Basic info')" />

            <CardBody>
              <div class="datagrid">
                <DatagridItem itemTitle="Short" :value="link.short">
                  <a href="#" @click.prevent="copyToClipboard(link)" class="px-2">
                    <IconCopy :size="18" v-if="!link.copying" />
                    <template v-else>{{ $t('copied') }}</template>
                  </a>

                  <a :href="getShort(link)" target="_blank">
                    <IconExternalLink :size="18" />
                  </a>
                </DatagridItem>
                <DatagridItem :itemTitle="$t('Destination')" :value="link.dest" />
                <DatagridItem :itemTitle="$t('Campaign')" :value="link.campaign_title" />
                <!-- TODO: -->
                <DatagridItem :itemTitle="$t('User')" :value="link.username" />
                <!-- TODO: -->
                <DatagridItem :itemTitle="$t('Description')" :value="link.description" />

                <DatagridStatusItem
                  :itemTitle="$t('Plus enabled')"
                  :status="!link.plus_enabled ? 'status-red' : 'status-green'"
                  :value="link.plus_enabled"
                />

                <DatagridStatusItem
                  :itemTitle="$t('Informal enabled')"
                  :status="!link.informal_redirection ? 'status-red' : 'status-green'"
                  :value="link.informal_redirection"
                />

                <DatagridStatusItem :itemTitle="$t('Monitoring')" :status="!link.monitor ? 'status-red' : 'status-green'" :value="link.monitor" />

                <DatagridStatusItem
                  :itemTitle="$t('Password protected')"
                  :status="link.password_protected ? 'status-red' : 'status-green'"
                  :value="link.password_protected"
                >
                  <span v-if="link.password_protected" class="ms-2 badge bg-pink text-pink-fg">{{ link.password }}</span>
                </DatagridStatusItem>

                <DatagridStatusItem
                  :itemTitle="$t('Expiring link')"
                  :status="link.expiring_link ? 'status-red' : 'status-green'"
                  :value="link.expiring_link"
                >
                  <span v-if="link.expiring_link" class="badge bg-pink text-pink-fg ms-2">{{
                    new Date(link.expiration_date ?? '').toLocaleDateString()
                  }}</span>
                </DatagridStatusItem>

                <DatagridItem :itemTitle="$t('Last edited')" :value="new Date(link.updated_at).toLocaleString()" />
                <DatagridItem :itemTitle="$t('Created at')" :value="new Date(link.created_at).toLocaleString()" />
              </div>
            </CardBody>
          </Card>
        </div>

        <div class="col-12 mt-4" v-if="loadingAnalytics">
          <Card>
            <CardBody class="text-center py-6">
              <h2 class="h2 text-blue pb-4">{{ $t('Loading analytics') }}</h2>
              <div class="spinner-grow text-blue" role="status"></div>
            </CardBody>
          </Card>
        </div>

        <template v-else>
          <AreaStats
            class="mt-4"
            :title="$t('Clicks')"
            :categories="clicks"
            :series="[
              { name: t('Direct'), data: directs },
              { name: 'QR', data: qrs }
            ]"
          />

          <AreaStats
            class="mt-4"
            :title="$t('Device Type')"
            :categories="clicks"
            :series="[
              { name: t('Other'), data: unknownType },
              { name: t('Mobile'), data: mobile },
              { name: t('Desktop'), data: desktop }
            ]"
          />

          <AreaStats
            class="mt-4"
            :title="$t('Device Brand')"
            :categories="clicks"
            :series="[
              { name: t('Other'), data: unknownBrand },
              { name: t('Android'), data: android },
              { name: t('Apple'), data: apple }
            ]"
          />

          <TopTen class="mt-4" :title="$t('Countries')" :categories="countryNames" :series="countryCount" />
          <TopTen class="mt-4" :title="$t('Cities')" :categories="cityNames" :series="countryCount" />
          <TopTen class="mt-4" :title="$t('Referrers')" :categories="refererNames" :series="refererCount" />
        </template>
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
import { useAppStore } from '@/stores/user';
import ApexCharts from 'apexcharts';
import { useI18n } from 'vue-i18n';
import TopTen from '@/components/stats/TopTen.vue';
import AreaStats from '@/components/stats/AreaStats.vue';

const router = useRouter();
const { t } = useI18n();

const id = router.currentRoute.value.params.id;

const days = ref(30);
const loading = ref(true);
const loadingAnalytics = ref(true);
const link = ref(new LinkModel());
const title = computed(() => (link.value.title !== '' ? link.value.title : t('View link')));
const store = useAppStore();

// Analytics
const directs = ref(<number[]>[]);
const qrs = ref(<number[]>[]);
const clicks = ref(<string[]>[]);
const apple = ref(<number[]>[]);
const android = ref(<number[]>[]);
const mobile = ref(<number[]>[]);
const desktop = ref(<number[]>[]);
const unknownType = ref(<number[]>[]);
const unknownBrand = ref(<number[]>[]);
const cityNames = ref(<string[]>[]);
const citiesCount = ref(<number[]>[]); // TODO gather with names
const countryNames = ref(<string[]>[]);
const countryCount = ref(<number[]>[]); // TODO gather with names
const refererNames = ref(<string[]>[]);
const refererCount = ref(<number[]>[]); // TODO gather with names

async function getLink() {
  const res = await NetworkHelper.get(NetworkHelper.links + id);
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

async function loadAnalytics() {
  const analytics = await NetworkHelper.get(`${NetworkHelper.linkStats}${id}/${days.value}`);
  if (!analytics.success) {
    // TODO: Toast for error
    loadingAnalytics.value = false;
    return;
  }

  if (Array.isArray(analytics.data.basic)) {
    const _clicks = <string[]>[],
      _directs = <number[]>[],
      _qrs = <number[]>[],
      _apple = <number[]>[],
      _android = <number[]>[],
      _mobile = <number[]>[],
      _desktop = <number[]>[],
      _unknownType = <number[]>[],
      _unknownBrand = <number[]>[];

    analytics.data.basic.forEach((data: any) => {
      _clicks.push(`${data.month}/${data.day}`);
      _directs.push(parseInt(data.direct));
      _qrs.push(parseInt(data.qr));
      _apple.push(parseInt(data.apple));
      _android.push(parseInt(data.android));
      _mobile.push(parseInt(data.mobile));
      _desktop.push(parseInt(data.desktop));
      _unknownType.push(parseInt(data.unknown_type));
      _unknownBrand.push(parseInt(data.unknown_brand));
    });

    clicks.value = _clicks;
    qrs.value = _qrs;
    directs.value = _directs;
    apple.value = _apple;
    android.value = _android;
    mobile.value = _mobile;
    desktop.value = _desktop;
    unknownType.value = _unknownType;
    unknownBrand.value = _unknownBrand;
  }

  if (Array.isArray(analytics.data.cities)) {
    const _citiesNames = <any[]>[]; // TODO: types.
    const _citiesCount = <any[]>[]; // TODO: types.

    analytics.data.cities.forEach((item: any) => {
      _citiesNames.push(item.city);
      _citiesCount.push(parseInt(item.total));
    });
    cityNames.value = _citiesNames;
    citiesCount.value = _citiesCount;
  }

  if (Array.isArray(analytics.data.countries)) {
    const _countryNames = <any[]>[]; // TODO: types.
    const _countryCount = <any[]>[]; // TODO: types.

    analytics.data.countries.forEach((item: any) => {
      _countryNames.push(item.country);
      _countryCount.push(parseInt(item.total));
    });
    countryNames.value = _countryNames;
    countryCount.value = _countryCount;
  }

  if (Array.isArray(analytics.data.referrers)) {
    const _refererNames = <any[]>[]; // TODO: types.
    const _refererCount = <any[]>[]; // TODO: types.

    analytics.data.referrers.forEach((item: any) => {
      _refererNames.push((item.referer == '' ? 'direct' : item.referer).replace(/^https?:\/\//, ''));
      _refererCount.push(parseInt(item.total)); // TODO create parse int or 0
    });
    refererNames.value = _refererNames;
    refererCount.value = _refererCount;
  }

  loadingAnalytics.value = false;
}

onMounted(async () => {
  await getLink();
  await loadAnalytics();
});
</script>
