<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useToast } from 'primevue';

const userStore = useUserStore();
const toast = useToast();

const user_id = ref(localStorage.getItem('user_id'));
const userInfo = ref(null);
const username = ref(null);
const full_name = ref(null);
const phone = ref(null);
const role = ref(null);
const editDialog = ref(false);

async function getUserInfo() {
    const data = await userStore.getUserInfoById(user_id.value);
    userInfo.value = data;
    username.value = userInfo.value.username;
    full_name.value = userInfo.value.full_name;
    phone.value = userInfo.value.phone;
    role.value = userInfo.value.role;
}

const loading = ref(false);

function openEditDialog() {
    editDialog.value = true;
}

async function edit() {
    try {
        loading.value = true;
        const data = await userStore.editSelfUser(userInfo.value);
        if (data.status == 200) {
            editDialog.value = false;
            toast.add({
                severity: 'success',
                summary: 'Успешно!',
                detail: 'Успешно обновлено',
                life: 3000
            });
            getUserInfo();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Ошибка!',
                detail: data.response.data.detail?.error_message || data.response.data.detail[0].msg,
                life: 3000
            });
        }
    } catch (error) {
        return error;
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    getUserInfo();
});
</script>

<template>
    <div class="card">
        <div class="flex gap-6 items-center pb-4 card" style="font-size: 30px">
            <i class="pi pi-user" style="font-size: 6rem"></i>
            <b>{{ full_name }}</b>
            <Button icon="pi pi-pencil" severity="info" raised @click="openEditDialog" />
        </div>
        <div class="mb-2" style="font-size: 22px">
            <b>Имя пользователя - </b><span>{{ username }}</span>
        </div>
        <div class="mb-2" style="font-size: 22px">
            <b>Телефон номер - </b><span>{{ phone }}</span>
        </div>
        <div class="mb-2" style="font-size: 22px">
            <b>Роль - </b>
            <span>{{ role }}</span>
        </div>
    </div>

    <Dialog v-model:visible="editDialog" modal header="Изменить информацию о себе">
        <form v-if="userInfo" ref="editForm" class="mt-5 flex flex-col gap-8" @submit.prevent="edit">
            <div class="flex gap-6 flex-wrap">
                <FloatLabel>
                    <InputText v-model="userInfo.username" required class="w-96" />
                    <label>Имя пользователя</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText v-model="userInfo.full_name" required class="w-96" />
                    <label>Имя фамилия</label>
                </FloatLabel>
            </div>
            <div class="flex gap-6 flex-wrap">
                <FloatLabel>
                    <InputText v-model="userInfo.password" required class="w-96" />
                    <label>Пароль</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText v-model="userInfo.new_password" required class="w-96" />
                    <label>Новый пароль</label>
                </FloatLabel>
            </div>

            <div class="flex justify-end">
                <Button label="Обновить" raised :loading="loading" type="submit" />
            </div>
        </form>
    </Dialog>
</template>
