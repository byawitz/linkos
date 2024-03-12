<template>
  <Page :is-center="true">
    <Container :is-tight="true" class="py-4">
      <TextCenter class="mb-4">
        <img src="@/assets/images/linkos-full.png" width="110" height="32" alt="Linkos" class="navbar-brand-image" />
      </TextCenter>

      <Card card-size="card-md">
        <CardBody>
          <h2 class="h2 text-center mb-4">{{ $t('Login to your account') }}</h2>

          <form autocomplete="off" @submit.prevent="login">
            <div class="mb-3">
              <FormLabel :label="$t('Email Address')" />
              <input type="email" v-model="state.email" class="form-control" placeholder="your@email.com" autocomplete="off" />
            </div>

            <div class="mb-2">
              <FormLabel :label="$t('Password')" :with-description="true">
                <RouterLink to="/forgot">{{ $t('Forgot password ?') }}</RouterLink>
              </FormLabel>

              <InputGroup :is-flat="true">
                <input
                  :type="state.showPassword ? 'text' : 'password'"
                  v-model="state.password"
                  class="form-control"
                  :placeholder="$t('Your password')"
                  autocomplete="off"
                />

                <InputGroupText class="is-pointer">
                  <IconEye v-if="!state.showPassword" @click="state.showPassword = !state.showPassword" class="icon" />
                  <IconEyeOff v-if="state.showPassword" @click="state.showPassword = !state.showPassword" class="icon" />
                </InputGroupText>
              </InputGroup>
            </div>

            <div class="form-footer">
              <Button type="submit" b-type="btn-primary" :class="{ 'btn-loading': state.submitting }">{{ $t('Sign in') }}</Button>
            </div>
          </form>
        </CardBody>
        <!--
        <HrText>or</HrText>

        <CardBody>
          <div class="row">
            <div class="col">
              <Button :is-link="true" href="#">
                <IconBrandGithub class="icon" />
                Login with Github
              </Button>
            </div>

            <div class="col">
              <Button :is-link="true" href="#">
                <IconBrandTwitter class="icon text-twitter" />
                Login with Twitter
              </Button>
            </div>
          </div>
        </CardBody>-->
      </Card>
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
import InputGroup from '@/components/form/InputGroup.vue';
import InputGroupText from '@/components/form/InputGroupText.vue';
import { IconEye, IconEyeOff } from '@tabler/icons-vue';
import Button from '@/components/form/Button.vue';
import NetworkHelper from '@/heplers/NetworkHelper';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const user = useUserStore();
const router = useRouter();

onMounted(() => {
  DomHelper.addClassToID('page', 'page-center');
});

onUnmounted(() => {
  DomHelper.removeClassFromID('page', 'page-center');
});

const state = reactive({
  email: '',
  password: '',
  showPassword: false,
  submitting: false
});

async function login() {
  if (state.submitting) return;

  // TODO: check fields

  state.submitting = true;

  const res = await NetworkHelper.post(NetworkHelper.login, { email: state.email, password: state.password });

  if (res.success) {
    await user.loadUser();
    await router.push('/');
  } else {
    // TODO: show error
  }

  state.submitting = false;
}
</script>
