<script setup>
import { useProviderStore } from '@/stores/provider';
import { useAbonimentStore } from '@/stores/aboniments';
import { onMounted, reactive, ref } from 'vue';
import { useToast } from 'primevue';
import { usePurchasesStore } from '@/stores/purchases';

const props = defineProps({
    userList: [Object, Array]
});
const emit = defineEmits(['created']);

const toast = useToast();

const purchasesStores = usePurchasesStore();
const providerStore = useProviderStore();
const abonimentStore = useAbonimentStore();

const providerList = ref(null);
const credentials = reactive({
    user_id: null,
    aboniment_id: null
});
const provider_id = ref(null);
const abonimentList = ref(null);
const createLoading = ref(false);

async function getProviderList() {
    try {
        const data = await providerStore.getProviderAllList();
        providerList.value = data;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error,
            life: 3000
        });
    }
}

async function selectProvider(id) {
    if (id) {
        const data = await abonimentStore.getAbonimentByProviderId(id);
        abonimentList.value = data;
    } else {
        abonimentList.value = [];
    }
}

async function create() {
    try {
        createLoading.value = true;
        const data = await purchasesStores.createPurchases(credentials);
        emit('created', data);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error,
            life: 3000
        });
    } finally {
        createLoading.value = false;
    }
}

onMounted(() => {
    getProviderList();
});
</script>

<template>
    <form ref="createForm" class="flex flex-col gap-6" @submit.prevent="create">
        <div class="flex flex-wrap gap-4 mt-6">
            <FloatLabel>
                <Select
                    v-model="credentials.user_id"
                    :options="userList"
                    option-label="phone"
                    option-value="id"
                    class="w-96"
                    filter
                />
                <label>Список пользователей</label>
            </FloatLabel>
            <FloatLabel>
                <Select
                    v-model="provider_id"
                    :options="providerList"
                    option-label="name"
                    option-value="id"
                    class="w-96"
                    filter
                    @change="selectProvider(provider_id)"
                />
                <label>Список провайдеров</label>
            </FloatLabel>
        </div>
        <FloatLabel>
            <Select
                v-model="credentials.aboniment_id"
                :options="abonimentList"
                option-label="name"
                option-value="id"
                class="w-96"
                filter
            />
            <label>Список абонементов</label>
        </FloatLabel>
        <div class="flex justify-end">
            <Button label="Создать" raised :loading="createLoading" type="submit" />
        </div>
    </form>
</template>
