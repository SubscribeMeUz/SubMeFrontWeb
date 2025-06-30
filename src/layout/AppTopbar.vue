<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePurchasesStore } from '@/stores/purchases';
import { storeToRefs } from 'pinia';
import { useToast, useConfirm } from 'primevue';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();

const toast = useToast();
const confirm = useConfirm();
const purchasesStore = usePurchasesStore();
const { purchasesRequests } = storeToRefs(purchasesStore);
const router = useRouter();
const menu = ref();
const callBackBar = ref(false);
const purchasesInfo = ref(null);
const infoDialog = ref(false);
const accessLoading = ref(false);
const denyLoading = ref(false);
const purchasesLoading = ref(false);
const currentPage = ref(0);
const count = ref(20);
const dateFilter = ref(null);
const abonimentId = ref(null);
const userId = ref(null);
const toggle = (event) => {
    menu.value.toggle(event);
};
const items = ref([
    {
        label: 'Пользователь',
        icon: 'pi pi-user',
        command: () => {
            return router.push('/user/info');
        }
    },
    {
        label: 'Выйти',
        icon: 'pi pi-sign-out',
        command: () => {
            localStorage.clear();
            return router.push('/auth/login');
        }
    }
]);

async function getPurchases() {
    try {
        await purchasesStore.getPurchases(
            abonimentId.value,
            userId.value,
            currentPage.value + 1,
            count.value,
            dateFilter.value
        );
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error,
            life: 3000
        });
    }
}

async function getPurchasingRequests() {
    try {
        purchasesLoading.value = true;
        await purchasesStore.getPurchasingRequests();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
            life: 3000
        });
    } finally {
        purchasesLoading.value = false;
    }
}

function showCallBackCount() {
    callBackBar.value = true;
}

function openInfo(item) {
    purchasesInfo.value = item;
    infoDialog.value = true;
}

async function accessed() {
    try {
        accessLoading.value = true;
        const data = await purchasesStore.setPurchasingRequest(purchasesInfo.value.id, 'accessed');
        if (data.status == 200) {
            toast.add({
                severity: 'success',
                summary: 'Удалено',
                detail: 'Успешно отменено',
                life: 3000
            });
            getPurchasingRequests();
            getPurchases();
            infoDialog.value = false;
        } else {
            toast.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Произошла ошибка при отмене',
                life: 3000
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error,
            life: 3000
        });
    } finally {
        accessLoading.value = false;
    }
}

async function denied() {
    confirm.require({
        message: `Вы уверены, что хотите отменить?`,
        header: 'Подтвердите отмену',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        accept: async () => {
            try {
                denyLoading.value = true;
                const data = await purchasesStore.setPurchasingRequest(purchasesInfo.value.id, 'denied');
                if (data.status == 200) {
                    toast.add({
                        severity: 'success',
                        summary: 'Удалено',
                        detail: 'Успешно отменено',
                        life: 3000
                    });
                    getPurchasingRequests();
                    getPurchases();
                    infoDialog.value = false;
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Ошибка',
                        detail: 'Произошла ошибка при отмене',
                        life: 3000
                    });
                }
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: error,
                    life: 3000
                });
            } finally {
                denyLoading.value = false;
            }
        },
        reject: () => {}
    });
}

onMounted(() => {
    getPurchasingRequests();
});
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container justify-between">
            <router-link to="/" class="layout-topbar-logo">
                <div class="logo-wrapper">
                    <h1 class="logo-text">SubMe</h1>
                    <div class="underline"></div>
                </div>
            </router-link>
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
        </div>

        <div class="layout-topbar-actions">
            <Button
                v-if="purchasesRequests"
                severity="secondary"
                text
                rounded
                @click="showCallBackCount"
                style="overflow: visible"
            >
                <i v-if="purchasesRequests.length == 0" class="pi pi-bell" style="font-size: 1.3rem" />
                <OverlayBadge
                    v-if="purchasesRequests.length > 0"
                    severity="danger"
                    :value="purchasesRequests.length"
                >
                    <i class="pi pi-bell" style="font-size: 1.3rem" />
                </OverlayBadge>
            </Button>

            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{
                    selector: '@next',
                    enterFromClass: 'hidden',
                    enterActiveClass: 'animate-scalein',
                    leaveToClass: 'hidden',
                    leaveActiveClass: 'animate-fadeout',
                    hideOnOutsideClick: true
                }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <Avatar
                        class="layout-topbar-action"
                        aria-haspopup="true"
                        aria-controls="overlay_tmenu"
                        shape="circle"
                        @click="toggle"
                    >
                        <i class="pi pi-user"></i>
                        <span>user info</span>
                    </Avatar>
                    <TieredMenu ref="menu" id="overlay_tmenu" :model="items" popup />
                </div>
            </div>
        </div>
    </div>
    <Drawer v-model:visible="callBackBar" position="right" style="width: 400px">
        <template #header>
            <div style="width: 25rem">
                <p class="text-center text-2xl">Запросы на закупки</p>
            </div>
        </template>

        <div v-if="!purchasesLoading" class="flex flex-col gap-4 mt-2">
            <div
                v-for="(item, index) in purchasesRequests"
                :key="item.id"
                class="flex justify-between flex-wrap"
                style="font-size: 16px"
            >
                <b class="my-auto">{{ index + 1 }}.</b>
                <p class="my-auto">{{ item.user?.phone }}</p>
                <Tag style="font-size: 13px">
                    {{ item.status }}
                </Tag>
                <div class="flex gap-2">
                    <Button raised icon="pi pi-eye" severity="info" @click="openInfo(item)" />
                </div>
            </div>
        </div>
        <div v-else>
            <ProgressBar mode="indeterminate" class="my-4" style="height: 6px" />
        </div>
    </Drawer>

    <Dialog v-model:visible="infoDialog" modal header="Информация о покупке">
        <p class="text-xl font-bold mb-2 mt-6">Информация о пользователе:</p>
        <div class="flex flex-wrap gap-6">
            <div class="flex gap-2">
                <b>Имя:</b>
                <p>{{ purchasesInfo?.user?.full_name }}</p>
            </div>
            <div class="flex gap-2">
                <b>Телефон:</b>
                <p>{{ purchasesInfo?.user?.phone }}</p>
            </div>
        </div>

        <p class="text-xl font-bold mt-6 mb-2">Информация об абонементе:</p>
        <div class="flex flex-wrap gap-6">
            <div class="flex gap-2">
                <b>Название плана:</b>
                <p>{{ purchasesInfo?.aboniment?.plan_name }}</p>
            </div>
            <div class="flex gap-2">
                <b>Метка:</b>
                <p>{{ purchasesInfo?.aboniment?.label }}</p>
            </div>
            <div class="flex gap-2">
                <b>Заголовок:</b>
                <p>{{ purchasesInfo?.aboniment?.title }}</p>
            </div>
            <div class="flex gap-2">
                <b>Подзаголовок:</b>
                <p>{{ purchasesInfo?.aboniment?.subtitle }}</p>
            </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
            <Button
                icon="pi pi-times"
                label="Отказ"
                severity="danger"
                :loading="denyLoading"
                aised
                @click="denied"
            />
            <Button icon="pi pi-check" label="Разрешить" :loading="accessLoading" raised @click="accessed" />
        </div>
    </Dialog>
</template>

<style>
.logo-wrapper {
    text-align: start;
}

.logo-text {
    font-size: 40px;
    font-weight: 700;
    color: var(--text-color);
    margin: 0;
    font-family: sans-serif;
    line-height: 42px;
    letter-spacing: 4px;
}

.underline {
    margin: 0 auto;
    width: 150px;
    height: 4px;
    background: linear-gradient(to right, #a6ff00, transparent);
    border-radius: 2px;
}
</style>
