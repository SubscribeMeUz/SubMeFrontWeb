<script setup>
import { useProviderStore } from '@/stores/provider';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import AddProvider from './components/AddProvider.vue';
import EditProvider from './components/EditProvider.vue';
import { useToast } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { useRouter } from 'vue-router';

const router = useRouter();

const providerStore = useProviderStore();
const { providers } = storeToRefs(providerStore);
const toast = useToast();
const confirm = useConfirm();

const currentPage = ref(0);
const count = ref(20);
const search = ref('');
const tableLoading = ref(false);
const createDialog = ref(false);
const editDalog = ref(false);
const provider_id = ref(null);

async function getProviders() {
    try {
        tableLoading.value = true;
        await providerStore.getProviders(currentPage.value + 1, count.value, search.value);
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
    if (data.status == 200 || data.status == 201) {
        createDialog.value = false;
        getProviders();
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

function openEditDialog(id) {
    provider_id.value = id;
    editDalog.value = true;
}

function edited(data) {
    if (data.status == 200 || data.status == 201) {
        editDalog.value = false;
        getProviders();
        toast.add({
            severity: 'success',
            summary: 'Успешно!',
            detail: 'Успешно обновлено',
            life: 3000
        });
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

async function deleteItem(id) {
    confirm.require({
        message: `Вы уверены, что хотите удалить?`,
        header: 'Подтвердите удаление',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        accept: async () => {
            try {
                tableLoading.value = true;
                const data = await providerStore.deleteProvider(id);
                if (data.status == 200) {
                    tableLoading.value = false;
                    toast.add({
                        severity: 'success',
                        summary: 'Удалено',
                        detail: 'Успешно удалено',
                        life: 3000
                    });
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Ошибка',
                        detail: 'При удалении произошла ошибка',
                        life: 3000
                    });
                }
                getProviders();
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
        },
        reject: () => {}
    });
}

function providerDetail(id) {
    router.push(`/provider/detail/${id}`);
}

async function getQR(id) {
    try {
        tableLoading.value = true;
        await providerStore.getQrCode(id);
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

onMounted(() => {
    getProviders();
});
</script>

<template>
    <DataTable :value="providers.data" class="card" :loading="tableLoading">
        <template #empty>Информация не найдена</template>

        <template #header>
            <div class="flex gap-2 justify-between flex-wrap">
                <Button label="Создать" raised icon="pi pi-plus" @click="openCreateDialog" />
                <form ref="searchForm" class="flex gap-2 flex-wrap" @submit.prevent="getProviders">
                    <FloatLabel>
                        <InputText v-model="search" style="width: 15cqmax" />
                        <label>Поиск</label>
                    </FloatLabel>
                    <Button icon="pi pi-search" raised type="submit" />
                </form>
            </div>
        </template>

        <Column field="id" header="ID" />
        <Column field="name" header="Название" />
        <Column field="owner.full_name" header="Владелец" />
        <Column style="width: 12%">
            <template #header><b class="mx-auto">Фото</b></template>
            <template #body="slotProps">
                <div
                    class="mx-auto"
                    style="
                        width: 70px;
                        height: 70px;
                        overflow: hidden;
                        object-fit: contain;
                        border-radius: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    "
                >
                    <Image :src="`${slotProps.data.logo_url}`" preview />
                </div>
            </template>
        </Column>

        <Column style="width: 15%">
            <template #header>
                <div class="mx-auto">
                    <i class="pi pi-ellipsis-v"></i>
                </div>
            </template>

            <template #body="slotProps">
                <div class="flex justify-center gap-2 flex-wrap">
                    <Button
                        icon="pi pi-qrcode"
                        raised
                        severity="secondary"
                        @click="getQR(slotProps.data.id)"
                    />
                    <Button icon="pi pi-eye" severity="" raised @click="providerDetail(slotProps.data.id)" />
                    <Button
                        icon="pi pi-pencil"
                        severity="info"
                        raised
                        @click="openEditDialog(slotProps.data.id)"
                    />
                    <Button
                        raised
                        severity="danger"
                        icon="pi pi-trash"
                        @click="deleteItem(slotProps.data.id)"
                    />
                </div>
            </template>
        </Column>

        <template #footer>
            <Paginator
                v-model:first="currentPage"
                v-on:update:first="getProviders"
                :rows="1"
                :total-records="providers.total_page"
            >
                <template #start>
                    <Select v-model="count" :options="[20, 30, 50]" @change="getProviders" />
                </template>
                <template #end>
                    <div class="totalElements">
                        <b>Количество элементов: </b>
                        {{ providers.total }}
                    </div>
                </template>
            </Paginator>
        </template>
    </DataTable>

    <Dialog v-model:visible="createDialog" modal class="min-w-[350px]" header="Создать провайдера">
        <AddProvider @created="created" />
    </Dialog>

    <Dialog v-model:visible="editDalog" modal class="min-w-[350px]" header="Изменить провайдера">
        <EditProvider :provider_id="provider_id" @edited="edited" />
    </Dialog>
</template>
