<script setup>
import { storeToRefs } from 'pinia';
import { usePurchasesStore } from '@/stores/purchases.js';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useToast } from 'primevue';
import AddPurchases from './components/AddPurchases.vue';

const toast = useToast();

const purchasesStore = usePurchasesStore();
const { purchases } = storeToRefs(purchasesStore);
const userStore = useUserStore();

const currentPage = ref(0);
const count = ref(20);
const dateFilter = ref(null);
const abonimentId = ref(null);
const userId = ref(null);
const tableLoading = ref(false);
const createDialog = ref(false);
const userList = ref(null);

async function getPurchases() {
    try {
        tableLoading.value = true;
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
    } finally {
        tableLoading.value = false;
    }
}

async function getAllUsers() {
    try {
        const data = await userStore.getAllUsers();
        userList.value = data;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error,
            life: 3000
        });
    }
}

function openCreateDialog() {
    createDialog.value = true;
}

function created(data) {
    if (data.status == 200 || data.status == 201) {
        createDialog.value = false;
        getPurchases();
        toast.add({
            severity: 'success',
            summary: 'Успешно!',
            detail: 'Создано успешно',
            life: 3000
        });
    } else {
        toast.add({
            severity: 'error',
            summary: 'Ошибка!',
            detail: data.response.data.detail?.error_message || data.response.data.detail[0].msg,
            life: 3000
        });
    }
}

onMounted(() => {
    getPurchases();
    getAllUsers();
});
</script>

<template>
    <DataTable :value="purchases.data" class="card" :loading="tableLoading">
        <template #empty>Информация не найдена</template>

        <template #header>
            <div class="flex gap-2 justify-between flex-wrap">
                <Button label="Создать" raised icon="pi pi-plus" @click="openCreateDialog" />
                <form ref="searchForm" class="flex gap-2 flex-wrap" @submit.prevent="getPurchases">
                    <FloatLabel>
                        <Select
                            v-model="userId"
                            :options="userList"
                            option-label="full_name"
                            option-value="id"
                            class="w-80"
                            filter
                            show-clear
                            @change="getPurchases()"
                        />
                        <label>Список пользователей</label>
                    </FloatLabel>
                </form>
            </div>
        </template>

        <Column field="id" header="ID" />
        <Column field="aboniment.name" header="Название абонемента" />
        <Column field="user.full_name" header="Имя пользователя" />
        <Column field="used_count" header="Использовано раз" />
        <Column field="status" header="Статус" />

        <template #footer>
            <Paginator
                v-model:first="currentPage"
                v-on:update:first="getPurchases"
                :rows="1"
                :total-records="purchases.total_pages"
            >
                <template #start>
                    <Select v-model="count" :options="[20, 30, 50]" @change="getPurchases" />
                </template>
                <template #end>
                    <div class="totalElements">
                        <b>Количество элементов: </b>
                        {{ purchases.total }}
                    </div>
                </template>
            </Paginator>
        </template>
    </DataTable>

    <Dialog v-model:visible="createDialog" modal header="Создать покупку" class="min-w-[500px]">
        <AddPurchases :userList="userList" @created="created" />
    </Dialog>
</template>
