<script setup lang="ts">
import PageHeader from '@/components/layouts/PageHeader.vue';
import StillInWork from '@/components/view/StillInWork.vue';
import AccountView from '@/views/sub-views/AccountView.vue';
import InputSelect from '@/components/form/InputSelect.vue';
</script>

<template>
  <AccountView>
    <div class="card-body">
      <h2 class="mb-4">{{ $t('Tokens') }}</h2>

      <StillInWork />
    </div>
  </AccountView>
</template>
