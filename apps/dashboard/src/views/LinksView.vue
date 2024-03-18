<template>
  <PageHeader :title="$t('Links')" :sub-title="$t('all')">
    <template #buttons>
      <Button :is-link="true" to="/links/add" b-type="btn-primary">{{ $t('New Link') }}</Button>
    </template>
  </PageHeader>

  <div class="page-body">
    <Table :table-loading="tableLoading" :headings="headings">
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
          <div class="row">
            <div class="col d-flex gap-2">
              <RouterLink :to="`/links/${link.id}/edit`" class="btn btn-icon btn-sm btn-outline-primary">
                <IconPencil :size="14" />
              </RouterLink>

              <a @click.prevent="askToDeleteLink(link)" href="#" class="btn btn-icon btn-sm btn-outline-danger">
                <IconTrash :size="14" />
              </a>
            </div>
          </div>
        </td>
      </tr>
    </Table>
    <TablePagination :hasNext="hasNext" :hasPrev="hasPrev" @next="paginator.next()" @prev="paginator.prev()" />
  </div>

  <input type="hidden" name="tmp-link-holder" id="tmp-link-holder" />
</template>

<script setup lang="ts">
import type LinkModel from '@@/db/LinkModel';
import { inject, onMounted, ref, type Ref } from 'vue';
import { IconCopy, IconExternalLink, IconPencil, IconTrash } from '@tabler/icons-vue';
import Button from '@/components/form/Button.vue';
import NetworkHelper from '@/heplers/NetworkHelper';
import PageHeader from '@/components/layouts/PageHeader.vue';
import type { SweetAlertResult } from 'sweetalert2';
import { useAppStore } from '@/stores/user';
import { useI18n } from 'vue-i18n';
import Table from '@/components/data/Table.vue';
import TablePagination from '@/components/data/TablePagination.vue';
import CursorPaginator from '@/heplers/CursorPaginator';
import { useRouter } from 'vue-router';

const store = useAppStore();
const router = useRouter();
const { t } = useI18n();

const links: Ref<LinkModel[]> = ref([]);
const tableLoading = ref(false);
const hasPrev = ref(false);
const hasNext = ref(false);
const swal: any = inject('$swal');

const paginator = new CursorPaginator(NetworkHelper.linksAll, links, tableLoading, hasNext, hasPrev, router);

const headings = [
  { title: '#', isNarrow: true },
  { title: t('Title'), isNarrow: false },
  { title: t('Short'), isNarrow: false },
  { title: t('Clicks'), isNarrow: true },
  { title: t('Destination'), isNarrow: false },
  { title: '', isNarrow: true }
];

onMounted(async () => {
  await paginator.init();
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
