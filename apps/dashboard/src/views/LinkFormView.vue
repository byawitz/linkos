<template>
  <template v-if="loading">{{ $t('loading') }}</template>

  <template v-else>
    <PageHeader :title="pageTitle" :sub-title="pageSubTitle"></PageHeader>
    <div class="page-body">
      <Container :isXL="true">
        <div class="row">
          <div class="col">
            <form class="card" @submit.prevent="submitForm">
              <div class="card-header">
                <h4 class="card-title">{{ $t('Link details') }}</h4>
              </div>

              <div class="card-body" :class="{ 'block-cover-overlay': submitting }">
                <div class="row g-5">
                  <div class="col-xl-6">
                    <InputText
                      :is-invalid="titleInvalid"
                      :feedback="$t('title_required_and_3')"
                      :required="true"
                      v-model="link.title"
                      :placeholder="$t('link_title_example')"
                      :label="$t('Title')"
                    />

                    <InputText
                      :is-invalid="destInvalid"
                      :feedback="$t('destination_required_and_5')"
                      :required="true"
                      v-model="link.dest"
                      placeholder="https://www.youtube.com/watch?v=g186XVcuNUc"
                      :label="$t('Destination')"
                    />
                    <InputText v-model="link.short" :placeholder="$t('empty_for_auto')" :label="$t('Short link')" />

                    <TextArea v-model="link.description" :placeholder="$t('when_desc_relevant')" :label="$t('Link description')" />
                  </div>

                  <div class="col-xl-6">
                    <InputSelect :label="$t('Campaign')" v-model="link.campaign_id" :options="[]" />
                    <TomSelect :label="$t('Tags')" v-model="tags" :options="[{ text: 'Tag', value: 'Tag' }]" />

                    <div class="mb-3">
                      <div class="form-label">{{ $t('Link options') }}</div>
                      <SlideCheckbox :label="$t('Pass parameters')" v-model="link.pass_parameters" />
                      <SlideCheckbox :label="$t('Monitor link uptime')" v-model="link.monitor" />
                      <SlideCheckbox :label="$t('Informal redirect')" v-model="link.informal_redirection" />
                      <SlideCheckbox :label="$t('Enable Plus page')" v-model="link.plus_enabled" />

                      <SlideCheckbox :label="$t('Set expiration date')" v-model="link.expiring_link" />
                      <InputDate
                        v-if="link.expiring_link"
                        :label="$t('Expiration date')"
                        :placeholder="$t('Select a date')"
                        v-model="link.expiration_date"
                      />

                      <SlideCheckbox :label="$t('Password protected')" v-model="link.password_protected" />
                      <InputText v-model="link.password" placeholder="123456780" :label="$t('Link password')" v-if="link.password_protected" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-footer text-end">
                <div class="d-flex">
                  <button type="submit" class="btn btn-primary ms-auto" :class="{ 'btn-loading': submitting }">
                    {{ isEdit ? $t('Update') : $t('Add') }} {{ $t('Link') }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import NetworkHelper from '@/heplers/NetworkHelper';
import { useRouter } from 'vue-router';
import LinkModel from '@@/db/LinkModel';
import PageHeader from '@/components/layouts/PageHeader.vue';
import Button from '@/components/form/Button.vue';
import InputText from '@/components/form/InputText.vue';
import TextArea from '@/components/form/TextArea.vue';
import SlideCheckbox from '@/components/form/SlideCheckbox.vue';
import InputDate from '@/components/form/InputDate.vue';
import InputSelect from '@/components/form/InputSelect.vue';
import Container from '@/components/layouts/Container.vue';
import { useI18n } from 'vue-i18n';
import TomSelect from '@/components/form/TomSelect.vue';

const router = useRouter();
const { t } = useI18n();

const id = router.currentRoute.value.params.id;

const pageSubTitle = computed(() => (isEdit.value ? link.value.title : t('adding')));
const titleInvalid = computed(() => submittedOnce.value && link.value.title.length < 3);
const destInvalid = computed(() => submittedOnce.value && (link.value.dest.length < 5 || !NetworkHelper.isURL(link.value.dest)));
const isEdit = computed(() => {
  return id !== undefined;
});

const link: Ref<LinkModel> = ref(new LinkModel());
const loading = ref(isEdit.value);
const submitting = ref(false);
const submittedOnce = ref(false);
const tags = ref([]);

const pageTitle = computed(() => (isEdit.value ? t('Edit') : t('New link')));

async function submitForm() {
  submittedOnce.value = true;

  if (destInvalid.value || titleInvalid.value) {
    return;
  }

  submitting.value = true;

  const res = !isEdit.value
    ? await NetworkHelper.post(NetworkHelper.links, LinkModel.dbData(link.value))
    : await NetworkHelper.patch(NetworkHelper.links + id, LinkModel.dbData(link.value));
  if (res.success) {
    await router.push('/links');
  } else {
    // Toast for error
  }

  submitting.value = false;
}

async function getLink() {
  const res = await NetworkHelper.get(NetworkHelper.links + router.currentRoute.value.params.id);
  if (res.success) {
    link.value = res.data;
  } else {
    // Toast for error
  }
}

onMounted(async () => {
  if (isEdit.value) {
    await getLink();
    loading.value = false;
  }
});
</script>
