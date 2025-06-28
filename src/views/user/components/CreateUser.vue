<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useUserStore } from '@/stores/user';

const emit = defineEmits(['created']);

const userStore = useUserStore();

const createLoading = ref(false);
const credendials = reactive({
    username: '',
    password: '',
    phone: '',
    full_name: '',
    role: null
});

const roleList = ref(null);

async function getUserRole() {
    const data = await userStore.getUserRole();
    roleList.value = data;
}

async function create() {
    try {
        createLoading.value = true;
        const data = await userStore.addUser(credendials);
        emit('created', data);
    } catch (error) {
        return error;
    } finally {
        createLoading.value = false;
    }
}

onMounted(() => {
    getUserRole();
});
</script>

<template>
    <form ref="createForm" class="mt-5 flex flex-col gap-8" @submit.prevent="create">
        <div class="flex gap-6 flex-wrap">
            <FloatLabel>
                <InputText v-model="credendials.username" required class="w-96" />
                <label>username</label>
            </FloatLabel>
            <FloatLabel>
                <InputText v-model="credendials.password" required class="w-96" />
                <label>password</label>
            </FloatLabel>
        </div>
        <div class="flex gap-6 flex-wrap">
            <FloatLabel>
                <InputText v-model="credendials.full_name" required class="w-96" />
                <label>full_name</label>
            </FloatLabel>
            <FloatLabel>
                <InputMask v-model="credendials.phone" mask="+999999999999" required class="w-96" />
                <label>phone</label>
            </FloatLabel>
        </div>
        <FloatLabel>
            <Select v-model="credendials.role" :options="roleList" class="w-96" />
            <label>role</label>
        </FloatLabel>
        <div class="flex justify-end">
            <Button label="Создать" raised :loading="createLoading" type="submit" />
        </div>
    </form>
</template>
