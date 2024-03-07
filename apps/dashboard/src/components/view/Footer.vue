<template>
  <footer class="footer footer-transparent d-print-none">
    <Container :isXL="true">
      <div class="row text-center align-items-center flex-row-reverse">
        <div class="col-lg-auto ms-lg-auto">
          <ul class="list-inline list-inline-dots mb-0">
            <li class="list-inline-item">
              <a href="https://linkos.app/docs" target="_blank" class="link-secondary" rel="noopener">Documentation</a>
            </li>

            <li class="list-inline-item"><a href="https://github.com/byawitz/linkos/blob/master/LICENSE" class="link-secondary">License</a></li>
            <li class="list-inline-item">
              <a href="https://github.com/byawitz/linkos" target="_blank" class="link-secondary" rel="noopener">Source code</a>
            </li>
          </ul>
        </div>

        <div class="col-12 col-lg-auto mt-3 mt-lg-0">
          <ul class="list-inline list-inline-dots mb-0">
            <li class="list-inline-item">Powered by <a href="https://linkos.app" class="link-secondary">Linkos</a>.</li>
          </ul>
        </div>
      </div>
    </Container>
  </footer>
</template>

<script setup lang="ts">
import Container from '@/components/layouts/Container.vue';
</script>

<style scoped></style>
