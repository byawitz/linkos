<template>
  <PageHeader :title="$t('Linkos')" />

  <div class="page-body">
    <Container>
      <div class="row row-cards">
        <div class="col-12">
          <div class="row row-cards">
            <NumberOf :title="$t('Links')" number="10" :sub-title="$t('Shorts')" icon-type="bg-cyan" :icon="IconLink" />
            <NumberOf :title="$t('Campaigns')" number="10" :icon="IconMist" />
            <NumberOf :title="$t('Tags')" number="10" :icon="IconLink" />
            <NumberOf :title="$t('Clicks')" number="10" :sub-title="$t('All links')" :icon="IconLink" />

            <TopTen :title="$t('Countries')" :categories="['iphone', 'android']" :series="[1, 2]" />
            <TopTen :title="$t('Links')" :categories="['iphone', 'android']" :series="[1, 2]" />
            <TopTen :title="$t('Devices')" :categories="['iphone', 'android']" :series="[1, 2]" />
            <TopTen :title="$t('Referrers')" :categories="['iphone', 'android']" :series="[1, 2]" />

            <ScorllLog :title="$t('Live Clicks')" :logs="links"> </ScorllLog>

            <ScorllLog :title="$t('Live Location')" :logs="links"> </ScorllLog>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/layouts/PageHeader.vue';
import NumberOf from '@/components/stats/NumberOf.vue';
import Container from '@/components/layouts/Container.vue';

import { IconLink, IconMist } from '@tabler/icons-vue';
import TopTen from '@/components/stats/TopTen.vue';
import ScorllLog from '@/components/data/ScorllLog.vue';
import { onMounted, ref } from 'vue';

const links = ref([{ id: 1, title: 'Link' }]);
let a = 2;
onMounted(() => {
  setInterval(() => {
    links.value.push({ id: a++, title: 'SOme' });
  }, 1000);
});
</script>
