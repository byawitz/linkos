<template>
  <Container :isXL="true">
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <div class="table-loading" v-if="tableLoading">
                <div class="tl-inner-text">
                  <div class="spinner-border text-blue" role="status"></div>
                  <p>{{ $t('Just a moment') }}</p>
                </div>
              </div>
              <table class="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th v-for="heading in headings" :key="heading.title" :class="{ 'w-1': heading.isNarrow }">{{ heading.title }}</th>
                  </tr>
                </thead>
                <tbody>
                  <slot></slot>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import Container from '@/components/layouts/Container.vue';
import { type PropType } from 'vue';

interface Heading {
  title: string;
  isNarrow: boolean;
}

defineProps({
  tableLoading: { default: false, type: Boolean },
  headings: { type: Array as PropType<Heading[]> }
});
</script>
