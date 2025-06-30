<script setup>
import { useUserStore } from '@/stores/user.js';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import CreateUser from './components/CreateUser.vue';
import { useToast } from 'primevue';
import EditUser from './components/EditUser.vue';

const userStore = useUserStore();
const { users } = storeToRefs(userStore);

const toast = useToast();

const currentPage = ref(0);
const count = ref(20);
const search = ref('');
const tableLoading = ref(false);
const createDialog = ref(false);
const editDalog = ref(false);
const userId = ref(null);

async function getUsers() {
    try {
        tableLoading.value = true;
        await userStore.getUsers(currentPage.value + 1, count.value, search.value);
    } catch (error) {
        return error;
    } finally {
        tableLoading.value = false;
    }
}

function openCreateDialog() {
    createDialog.value = true;
}

function created(data) {
    if (data.status == 201 || data.status == 200) {
        createDialog.value = false;
        toast.add({
            severity: 'success',
            summary: 'Успешно!',
            detail: 'Создано успешно',
            life: 3000
        });
        getUsers();
    } else {
        toast.add({
            severity: 'error',
            summary: 'Ошибка!',
            detail: data.response.data.detail?.error_message || data.response.data.detail[0].msg,
            life: 3000
        });
    }
}

function openEditDialog(id) {
    userId.value = id;
    editDalog.value = true;
}

function edited(data) {
    if (data.status == 201 || data.status == 200) {
        editDalog.value = false;
        toast.add({
            severity: 'success',
            summary: 'Успешно!',
            detail: 'Успешно обновлено',
            life: 3000
        });
        getUsers();
    } else {
        toast.add({
            severity: 'error',
            summary: 'Ошибка!',
            detail:
                data.response.data.detail?.error_message ||
                data.response.data.detail[0].msg ||
                data.response.data.detail,
            life: 3000
        });
    }
}

onMounted(() => {
    getUsers();
});
</script>

<template>
    <DataTable :value="users.data" class="card" :loading="tableLoading">
        <template #empty>Информация не найдена</template>

        <template #header>
            <div class="flex gap-2 justify-between flex-wrap">
                <Button label="Создать" raised icon="pi pi-plus" @click="openCreateDialog" />
                <form ref="searchForm" class="flex gap-2 flex-wrap" @submit.prevent="getUsers">
                    <FloatLabel>
                        <InputText v-model="search" style="width: 15cqmax" />
                        <label>Поиск</label>
                    </FloatLabel>
                    <Button icon="pi pi-search" raised type="submit" />
                </form>
            </div>
        </template>

        <Column field="id" header="ID" />
        <Column field="username" header="Имя пользователя" />
        <Column field="phone" header="Телефон" />
        <Column field="full_name" header="Полное имя (ФИО)" />
        <Column field="role" header="Роль" />
        <Column style="width: 8%">
            <template #header>
                <div class="mx-auto">
                    <i class="pi pi-ellipsis-v"></i>
                </div>
            </template>

            <template #body="slotProps">
                <div class="flex justify-center gap-2 flex-wrap">
                    <Button
                        icon="pi pi-pencil"
                        severity="info"
                        raised
                        @click="openEditDialog(slotProps.data.id)"
                    />
                </div>
            </template>
        </Column>

        <template #footer>
            <Paginator
                v-model:first="currentPage"
                v-on:update:first="getUsers"
                :rows="1"
                :total-records="users.total_page"
            >
                <template #start>
                    <Select v-model="count" :options="[20, 30, 50]" @change="getUsers" />
                </template>
                <template #end>
                    <div class="totalElements">
                        <b>Количество элементов: </b>
                        {{ users.total }}
                    </div>
                </template>
            </Paginator>
        </template>
    </DataTable>

    <Dialog v-model:visible="createDialog" modal class="min-w-[350px]" header="Создать пользователя">
        <CreateUser @created="created" />
    </Dialog>

    <Dialog v-model:visible="editDalog" modal class="min-w-[350px]" header="Редактировать пользователя">
        <EditUser :id="userId" @edited="edited" />
    </Dialog>
</template>
