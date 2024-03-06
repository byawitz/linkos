<template>
  <PageHeader title="Links" sub-title="all">
    <template #buttons>
      <Button :is-link="true" to="/links/add" b-type="btn-primary">New LinkAPI</Button>
    </template>
  </PageHeader>

  <div class="page-body">
    <div class="container-xl">
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="table-responsive">
              <table class="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th class="w-1">#</th>
                    <th>Title</th>
                    <th>Short</th>
                    <th>Destination</th>
                    <th class="w-1"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="link in links" :key="link.id">
                    <td>{{ link.id }}</td>
                    <td class="text-secondary">{{ link.title }}</td>
                    <td class="text-secondary">
                      <a href="#" class="text-reset">https://linkos.app/{{ link.short }}</a>
                    </td>
                    <td class="text-secondary">
                      <span :title="link.dest">{{ link.dest.substring(0, 50) }}...</span>
                    </td>
                    <td>
                      <RouterLink :to="`/links/${link.id}`">Edit</RouterLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NetworkHelper from '@/heplers/NetworkHelper';
import { onMounted, ref, type Ref } from 'vue';
import Button from '@/components/form/Button.vue';
import PageHeader from '@/components/layouts/PageHeader.vue';
import type LinkModel from '@@/db/LinkModel';

const links: Ref<LinkModel[]> = ref([]);

onMounted(async () => {
  try {
    const res = await NetworkHelper.get(NetworkHelper.getLinks);
    if (res.success) links.value = res.data;
  } catch (e) {
    // TODO: Toast for error
  }
});
</script>
