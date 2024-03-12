<template>
  <PageHeader title="Links" sub-title="all">
    <template #buttons>
      <Button :is-link="true" to="/links/add" b-type="btn-primary">{{ $t('New Link') }}</Button>
    </template>
  </PageHeader>

  <div class="page-body">
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
                      <th class="w-1">#</th>
                      <th>{{ $t('Title') }}</th>
                      <th>{{ $t('Short') }}</th>
                      <th class="w-1">{{ $t('Clicks') }}</th>
                      <th>{{ $t('Destination') }}</th>
                      <th class="w-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="link in links" :key="link.id">
                      <td>{{ link.id }}</td>
                      <td class="text-secondary">
                        <RouterLink :to="`/links/${link.id}`">{{ link.title }}</RouterLink>
                      </td>
                      <td class="text-secondary">
                        <div class="badge py-2">
                          {{ link.short }}

                          <a href="#" @click.prevent="copyToClipboard(link)" class="px-2">
                            <IconCopy :size="18" v-if="!link.copying" />
                            <template v-else>{{ $t('copied') }}</template>
                          </a>

                          <a :href="getShort(link)" target="_blank">
                            <IconExternalLink :size="18" />
                          </a>
                        </div>
                      </td>
                      <td class="text-secondary">{{ parseInt(link.clicks.toString()).toLocaleString() }}</td>
                      <td class="text-secondary">
                        <span :title="link.dest">{{ link.dest.substring(0, 50) }}{{ link.dest.length > 50 ? '...' : '' }}</span>
                      </td>
                      <td>
                        <div class="btn-list flex-nowrap">
                          <div class="dropdown">
                            <button class="btn dropdown-toggle align-text-top" data-bs-toggle="dropdown" aria-expanded="false">
                              <IconSettings :size="15" />
                            </button>
                            <div class="dropdown-menu dropdown-menu-end" style="">
                              <RouterLink class="dropdown-item" :to="`/links/${link.id}/edit`">{{ $t('Edit') }}</RouterLink>
                              <a class="text-danger dropdown-item" @click.prevent="askToDeleteLink(link)" href="#"> {{ $t('Delete') }} </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>

  <input type="hidden" name="tmp-link-holder" id="tmp-link-holder" />
</template>

<script setup lang="ts">
import type LinkModel from '@@/db/LinkModel';
import { inject, onMounted, ref, type Ref } from 'vue';
import { IconSettings, IconCopy, IconExternalLink } from '@tabler/icons-vue';
import Button from '@/components/form/Button.vue';
import NetworkHelper from '@/heplers/NetworkHelper';
import PageHeader from '@/components/layouts/PageHeader.vue';
import type { SweetAlertResult, SweetAlertCustomClass } from 'sweetalert2';
import { useUserStore } from '@/stores/user';
import Container from '@/components/layouts/Container.vue';
import { useI18n } from 'vue-i18n';

const store = useUserStore();
const { t } = useI18n();

const links: Ref<LinkModel[]> = ref([]);
const tableLoading = ref(false);
const swal: any = inject('$swal');

onMounted(async () => {
  try {
    const res = await NetworkHelper.get(NetworkHelper.links);
    if (res.success) links.value = res.data;
  } catch (e) {
    // TODO: Toast for error
  }
});

async function deleteLink(deletingLink: LinkModel) {
  tableLoading.value = true;
  const deleteStatus = await NetworkHelper.delete(`${NetworkHelper.links}${deletingLink.id}/${deletingLink.short}`);

  if (deleteStatus.success) {
    links.value.splice(
      links.value.findIndex((link) => link.id === deletingLink.id),
      1
    );
  } else {
    swal.fire({
      title: t('Error'),
      text: t('Error while deleting link, please try again.'),
      icon: 'error'
    });
  }

  tableLoading.value = false;
}

async function copyToClipboard(link: LinkModel) {
  await navigator.clipboard.writeText(getShort(link));

  link.copying = true;
  setTimeout(() => (link.copying = false), 450);
}

function getShort(link: LinkModel) {
  return `${store.server.host}/${link.short}`;
}

async function askToDeleteLink(link: LinkModel) {
  swal
    .fire({
      title: t('Are you sure?'),
      showCancelButton: true,
      confirmButtonText: t('Yes')
    })
    .then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        deleteLink(link);
      }
    });
}
</script>
