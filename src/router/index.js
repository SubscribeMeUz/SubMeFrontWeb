import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/stats',
                    name: 'stats',
                    component: () => import('@/views/stats/Stats.vue')
                },
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/stats/Dashboard.vue')
                },
                {
                    path: '/',
                    name: 'user-list',
                    component: () => import('@/views/user/UserList.vue')
                },
                {
                    path: '/user/info',
                    name: 'user-info',
                    component: () => import('@/views/user/components/UserInfo.vue')
                },
                {
                    path: '/provider/list',
                    name: 'provider-list',
                    component: () => import('@/views/providers/ProviderList.vue')
                },
                {
                    path: '/provider/detail/:id',
                    name: 'provider-detail',
                    component: () => import('@/views/providers/components/ProviderDetail.vue'),
                    props: true
                },
                {
                    path: '/aboniments/list',
                    name: 'aboniments-list',
                    component: () => import('@/views/aboniments/AbonimentsList.vue')
                },
                {
                    path: '/purchases/list',
                    name: 'purchases-list',
                    component: () => import('@/views/purchases/PurchasesList.vue')
                },
                {
                    path: '/user/list/by-time',
                    name: '/user-list-by-time',
                    component: () => import('@/views/stats/UserListByUseTimes.vue')
                },
                {
                    path: '/purchases/history',
                    name: 'purchases-history',
                    component: () => import('@/views/stats/PurchasesHistory.vue')
                },
                {
                    path: '/all/client/info',
                    name: 'all-client-info',
                    component: () => import('@/views/stats/AllClientInfo.vue')
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/privacy-policy',
            name: 'privacy-policy',
            component: () => import('@/views/pages/PrivacyPolicy.vue')
        },
        {
            path: '/remove-account',
            name: 'remove-account',
            component: () => import('@/views/pages/RemoveAccount.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/pages/notfound'
        }
    ]
});

export default router;
