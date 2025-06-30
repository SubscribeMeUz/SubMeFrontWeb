<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const props = defineProps({
    id: [String, Number]
});

const emit = defineEmits(['edited']);

const userStore = useUserStore();

const userInfo = ref(null);
const loading = ref(false);
const roleList = ref(null);

async function getUserRole() {
    const data = await userStore.getUserRole();
    roleList.value = data;
}

async function getUserInfo() {
    const data = await userStore.getUserInfoById(props.id);
    userInfo.value = data;
}

async function edit() {
    try {
        loading.value = true;
        const data = await userStore.editUser(props.id, userInfo.value);
        emit('edited', data);
    } catch (error) {
        return error;
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    getUserInfo();
    getUserRole();
});
</script>

<template>
    <form v-if="userInfo" ref="editForm" class="mt-5 flex flex-col gap-8" @submit.prevent="edit">
        <div class="flex gap-6 flex-wrap">
            <FloatLabel>
                <InputText v-model="userInfo.username" required class="w-96" />
                <label>Имя пользователя</label>
            </FloatLabel>
            <FloatLabel>
                <Select v-model="userInfo.role" :options="roleList" class="w-96" />
                <label>Роль</label>
            </FloatLabel>
        </div>
        <div class="flex gap-6 flex-wrap">
            <FloatLabel>
                <InputText v-model="userInfo.full_name" required class="w-96" />
                <label>Полное имя (ФИО)</label>
            </FloatLabel>
            <FloatLabel>
                <InputMask v-model="userInfo.phone" mask="+999999999999" required class="w-96" />
                <label>Телефон</label>
            </FloatLabel>
        </div>
        <div class="flex gap-6 flex-wrap">
            <FloatLabel>
                <InputText v-model="userInfo.password" class="w-96" />
                <label>Текущий пароль</label>
            </FloatLabel>
            <FloatLabel>
                <InputText v-model="userInfo.new_password" class="w-96" />
                <label>Новый пароль</label>
            </FloatLabel>
        </div>

        <div class="flex justify-end">
            <Button label="Обновить" raised :loading="loading" type="submit" />
        </div>
    </form>
    <Skeleton v-else class="w-full" />
</template>
