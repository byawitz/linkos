<template>
  <aside class="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebar-menu"
        aria-controls="sidebar-menu"
        aria-expanded="false"
        aria-label="Toggle navigation"
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
        <NavItem text="Dashboard" href="/">
          <template #icon>
            <IconDashboard class="icon" />
          </template>
        </NavItem>

        <NavItem text="Links" :with-drop-down="true">
          <template #icon>
            <IconLink class="icon" />
          </template>

          <template #dropdown>
            <DropdownColumns>
              <DropdownColumn>
                <DropdownItem to="/">
                  <span>All Links</span>
                  <Badge class="text-uppercase ms-auto" b-type="bg-pink-lt">OLD</Badge>
                </DropdownItem>
              </DropdownColumn>
            </DropdownColumns>
          </template>
        </NavItem>

        <NavItem text="Links" href="/links">
          <template #icon>
            <IconLink class="icon" />
          </template>
        </NavItem>

        <NavItem text="Campaigns" href="/campaigns">
          <template #icon>
            <IconConfetti class="icon" />
          </template>
        </NavItem>

        <NavItem text="Domains" href="/domains">
          <template #icon>
            <IconWorldWww class="icon" />
          </template>
        </NavItem>

        <NavItem text="Importer" href="/importer">
          <template #icon>
            <IconFileImport class="icon" />
          </template>
        </NavItem>

        <NavItem text="Tokens" href="/tokens">
          <template #icon>
            <IconKey class="icon" />
          </template>
        </NavItem>

        <NavItem text="Users" href="/users">
          <template #icon>
            <IconUsers class="icon" />
          </template>
        </NavItem>

        <NavItem text="Backup" href="/backups">
          <template #icon>
            <IconFileZip class="icon" />
          </template>
        </NavItem>

        <NavItem text="Profile" href="profile">
          <template #icon>
            <IconUser class="icon" />
          </template>
        </NavItem>

        <NavItem text="Logout" href="login">
          <template #icon>
            <IconLogout class="icon" />
          </template>
        </NavItem>
      </NavBar>
    </div>
  </aside>
</template>

<script setup lang="ts">
import NavBar from '@/components/view/NavBar.vue';
import NavItem from '@/components/view/NavItem.vue';
import {
  IconUsers,
  IconUser,
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
</script>
