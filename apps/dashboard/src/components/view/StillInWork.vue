<template>
  <Container>
    <div class="row mt-4">
      <div class="col-6">
        <div class="card text-primary-fg p-3">
          <div class="card-stamp">
            <div class="card-stamp-icon bg-yellow"><IconClockFilled :size="70" /></div>
          </div>
          <div class="card-body">
            <h2 class="h2 card-title">{{ $t('Still in the work') }}</h2>
            <p>
              {{ $t('This page is still in the working make sure to follow our') }} <a href="https://github.com/byawitz/linkos">{{ $t('repo') }}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import Container from '@/components/layouts/Container.vue';
import { IconClockFilled } from '@tabler/icons-vue';
</script>
