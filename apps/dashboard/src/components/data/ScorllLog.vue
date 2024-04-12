<template>
  <div class="col-md-6 col-xl-4 col-12">
    <Card>
      <CardBody>
        <div class="d-flex">
          <h3 class="card-title" v-text="title" />
        </div>
        <div class="row">
          <div class="col">
            <div class="log">
              <div class="log-holder" ref="el">
                <div v-for="log of logs" :key="log.id">{{ log.title }} {{ log.id }}</div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/layouts/Card.vue';
import CardBody from '@/components/layouts/CardBody.vue';
import { type PropType, ref, watch } from 'vue';

declare type LogLine = { id: number; title: String };

const props = defineProps({
  title: { type: String, default: '' },
  logs: { type: Array as PropType<LogLine[]>, default: [] }
});

const el = ref();
watch(
  () => props.logs.length,
  () => (el.value.scrollTop = el.value.scrollHeight)
);
</script>
