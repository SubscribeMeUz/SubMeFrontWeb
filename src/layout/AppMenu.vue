<script setup>
import { computed, ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const navItems = ref([
    {
        items: [
            {
                label: 'Статистика',
                icon: 'mdi mdi-chart-multiple',
                items: [
                    {
                        label: 'Статистика',
                        icon: 'mdi mdi-chart-bar',
                        to: '/dashboard',
                        roles: ['admin', 'user', 'trainer', 'provider']
                    },
                    {
                        label: 'Время продаж',
                        icon: 'mdi mdi-chart-timeline',
                        to: '/user/list/by-time',
                        roles: ['admin', 'user', 'trainer', 'provider']
                    },
                    {
                        label: 'Покупки клиентов',
                        icon: 'mdi mdi-clipboard-text-clock-outline',
                        to: '/purchases/history',
                        roles: ['admin', 'user', 'trainer', 'provider']
                    },
                    {
                        label: 'Клиенты',
                        icon: 'mdi mdi-account-group-outline',
                        to: '/all/client/info',
                        roles: ['admin', 'user', 'trainer', 'provider']
                    }
                ],
                roles: ['admin', 'user', 'trainer', 'provider']
            },
            {
                label: 'Список пользователей',
                icon: 'mdi mdi-account-group',
                to: '/',
                roles: ['admin', 'user', 'trainer', 'provider']
            },
            {
                label: 'Список провайдеров',
                icon: 'mdi mdi-devices',
                to: '/provider/list',
                roles: ['admin', 'user', 'trainer', 'provider']
            },
            {
                label: 'Список абонементов',
                icon: 'mdi mdi-calendar-multiselect-outline',
                to: '/aboniments/list',
                roles: ['admin', 'user', 'trainer', 'provider']
            },
            {
                label: 'Список покупок',
                icon: 'mdi mdi-purse-outline',
                to: '/purchases/list',
                roles: ['admin', 'user', 'trainer', 'provider']
            }
        ]
    }
]);

const filteredNavItems = computed(() => {
    return navItems.value.filter((item) => {
        if (item.roles && !item.roles.includes(localStorage.getItem('user_role'))) {
            return false;
        }
        if (item.items) {
            item.items = item.items.filter((child) =>
                child.roles.includes(localStorage.getItem('user_role'))
            );
        }
        return true;
    });
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in filteredNavItems" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style>
.layout-menuitem-text {
    font-size: 16px;
}
.layout-menuitem-icon {
    font-size: 20px;
}
</style>
