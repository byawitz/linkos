<template>
  <Page :is-center="true">
    <Container :is-tight="true" class="py-4">
      <TextCenter class="mb-4">
        <img src="@/assets/images/linkos-full.png" width="110" height="32" alt="Likos" class="navbar-brand-image">
      </TextCenter>

      <Card card-size="card-md">
        <CardBody>
          <h2 class="h2 text-center mb-4">Reset your password</h2>

          <form autocomplete="off">
            <div class="mb-3">
              <FormLabel label="Email Address"/>
              <input type="email" v-model="state.email" class="form-control" placeholder="your@email.com" autocomplete="off">
            </div>

            <div class="form-footer">
              <Button type="submit" b-type="btn-primary">Reset your password</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <div class="text-center text-secondary mt-3">
        Forget it, <RouterLink to="/login">send me back</RouterLink> to the sign in screen.
      </div>
    </Container>
  </Page>
</template>

<script setup lang="ts">
import Page from "@/components/layouts/Page.vue";
import Container from "@/components/layouts/Container.vue";
import {onMounted, onUnmounted, reactive} from "vue";
import DomHelper from "@/heplers/DomHelper";
import TextCenter from "@/components/text/TextCenter.vue";
import HrText from "@/components/text/HrText.vue";
import Card from "@/components/layouts/Card.vue";
import CardBody from "@/components/layouts/CardBody.vue";
import FormLabel from "@/components/form/FormLabel.vue";
import InputGroup from "@/components/form/InputGroup.vue";
import InputGroupText from "@/components/form/InputGroupText.vue";
import {IconEye, IconEyeOff, IconBrandGithub, IconBrandTwitter} from '@tabler/icons-vue';
import Button from "@/components/form/Button.vue";

onMounted(() => {
  DomHelper.addClassToApp('page', 'page-center');
});

onUnmounted(() => {
  DomHelper.removeClassFromApp('page', 'page-center');
});

const state = reactive({
  email       : '',
  password    : '',
  showPassword: false,
  rememberMe  : false,
})
</script>