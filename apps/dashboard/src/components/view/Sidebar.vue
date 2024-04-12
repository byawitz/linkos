<template>
  <aside class="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
    <Container :is-fluid="true">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebar-menu"
        aria-controls="sidebar-menu"
        aria-expanded="false"
        :aria-label="$t('Toggle navigation')"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <h1 class="navbar-brand navbar-brand-autodark">
        <RouterLink to="/">
          <img src="@/assets/images/linkos-full.png" width="32" height="32" alt="Linkos" />
          Linkos
        </RouterLink>
      </h1>

      <NavBar>
        <NavItem :text="$t('Dashboard')" href="/">
          <template #icon>
            <IconDashboard class="icon" />
          </template>
        </NavItem>

        <NavItem :text="$t('Links')" :with-drop-down="true">
          <template #icon>
            <IconLink class="icon" />
          </template>

          <template #dropdown>
            <DropdownColumns>
              <DropdownColumn>
                <DropdownItem to="/links">
                  <span>{{ $t('All Links') }}</span>
                </DropdownItem>

                <DropdownItem to="/tags">
                  <span>{{ $t('Tags') }}</span>
                </DropdownItem>

                <DropdownItem to="/campaigns">
                  <span>{{ $t('Campaigns') }}</span>
                </DropdownItem>
              </DropdownColumn>
            </DropdownColumns>
          </template>
        </NavItem>

        <NavItem :text="$t('Domains')" href="/domains">
          <template #icon>
            <IconWorldWww class="icon" />
          </template>
        </NavItem>

        <NavItem :text="$t('Importer')" href="/importer">
          <template #icon>
            <IconFileImport class="icon" />
          </template>
        </NavItem>

        <NavItem :text="$t('Users')" href="/users">
          <template #icon>
            <IconUsers class="icon" />
          </template>
        </NavItem>

        <NavItem :text="$t('Backup')" href="/backups">
          <template #icon>
            <IconFileZip class="icon" />
          </template>
        </NavItem>

        <NavItem :text="$t('Settings')" href="/settings">
          <template #icon>
            <IconSettings2 class="icon" />
          </template>
        </NavItem>

        <NavItem :text="$t('Logout')" href="login">
          <template #icon>
            <IconLogout class="icon" />
          </template>
        </NavItem>
      </NavBar>
    </Container>
  </aside>
</template>

<script setup lang="ts">
import NavBar from '@/components/view/NavBar.vue';
import NavItem from '@/components/view/NavItem.vue';
import {
  IconUsers,
  IconSettings2,
  IconLogout,
  IconLink,
  IconDashboard,
  IconFileZip,
  IconConfetti,
  IconWorldWww,
  IconFileImport,
  IconKey
} from '@tabler/icons-vue';
import DropdownColumn from '@/components/view/DropdownColumn.vue';
import DropdownItem from '@/components/view/DropdownItem.vue';
import DropdownColumns from '@/components/view/DropdownColumns.vue';
import Badge from '@/components/form/Badge.vue';
import Container from '@/components/layouts/Container.vue';
</script>
