<template>
  <Page :is-center="true">
    <Container :is-tight="true" class="py-4">
      <TextCenter class="mb-4">
        <img src="@/assets/images/linkos-full.png" width="110" height="32" alt="Likos" class="navbar-brand-image" />
      </TextCenter>

      <Card card-size="card-md">
        <CardBody>
          <h2 class="h2 text-center mb-4">{{ $t('Reset your password') }}</h2>

          <form autocomplete="off">
            <div class="mb-3">
              <FormLabel :label="$t('Email Address')" />
              <input type="email" v-model="state.email" class="form-control" placeholder="email@example.com" autocomplete="off" />
            </div>

            <div class="form-footer">
              <Button type="submit" b-type="btn-primary">{{ $t('Reset your password') }}</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <div class="text-center text-secondary mt-3">
        {{ $t('Forget it,') }}
        <RouterLink to="/login">{{ $t('send me back') }}</RouterLink>
        {{ $t('to the sign in screen.') }}
      </div>
    </Container>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/layouts/Page.vue';
import Container from '@/components/layouts/Container.vue';
import { onMounted, onUnmounted, reactive } from 'vue';
import DomHelper from '@/heplers/DomHelper';
import TextCenter from '@/components/text/TextCenter.vue';
import Card from '@/components/layouts/Card.vue';
import CardBody from '@/components/layouts/CardBody.vue';
import FormLabel from '@/components/form/FormLabel.vue';
import Button from '@/components/form/Button.vue';

const state = reactive({
  email: '',
  password: '',
  showPassword: false,
  rememberMe: false
});

onMounted(() => DomHelper.addClassToID('app', 'page', 'page-center'));
onUnmounted(() => DomHelper.removeClassFromID('app', 'page', 'page-center'));
</script>
