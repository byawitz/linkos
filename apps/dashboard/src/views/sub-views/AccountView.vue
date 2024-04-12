<template>
  <PageHeader :title="$t('Settings')"></PageHeader>

  <Container class="mt-4">
    <Card>
      <div class="row g-0">
        <div class="col-12 col-md-3 border-end">
          <div class="card-body">
            <h4 class="subheader">{{ $t('basic-details') }}</h4>
            <div class="list-group list-group-transparent">
              <RouterLink to="/settings" class="list-group-item list-group-item-action" active-class="active">{{ $t('Profile') }}</RouterLink>
            </div>

            <h4 class="subheader mt-4">{{ $t('advance') }}</h4>
            <div class="list-group list-group-transparent">
              <RouterLink to="/tokens" class="list-group-item list-group-item-action" active-class="active">{{ $t('Tokens') }}</RouterLink>
              <RouterLink to="/qr-customizer" class="list-group-item list-group-item-action" active-class="active">{{
                $t('QR Customizer')
              }}</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-9 d-flex flex-column">
          <slot></slot>
        </div>
      </div>
    </Card>
  </Container>
</template>

<script setup lang="ts">
import PageHeader from '@/components/layouts/PageHeader.vue';
import Container from '@/components/layouts/Container.vue';
import Card from '@/components/layouts/Card.vue';
</script>
