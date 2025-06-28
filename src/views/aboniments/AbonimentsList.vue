<script setup>
import { useAbonimentStore } from '@/stores/aboniments';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import AddAboniment from './components/AddAboniment.vue';
import EditAboniment from './components/EditAboniment.vue';

const toast = useToast();
const confirm = useConfirm();

const abonimentStore = useAbonimentStore();
const { aboniments } = storeToRefs(abonimentStore);

const currentPage = ref(0);
const count = ref(20);
const search = ref('');
const tableLoading = ref(false);
const createDialog = ref(false);
const editDalog = ref(false);
const aboniment_id = ref(null);

async function getAboniments() {
    try {
        tableLoading.value = true;
        await abonimentStore.getAboniments(currentPage.value + 1, count.value, search.value);
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
        getAboniments();
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
                const data = await abonimentStore.deleteAboniment(id);
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
                getAboniments();
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

function openEditDialog(id) {
    aboniment_id.value = id;
    editDalog.value = true;
}

function edited(data) {
    if (data.status == 200) {
        editDalog.value = false;
        getAboniments();
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

onMounted(() => {
    getAboniments();
});
</script>

<template>
    <DataTable :value="aboniments.data" class="card" :loading="tableLoading">
        <template #empty>Информация не найдена</template>

        <template #header>
            <div class="flex gap-2 justify-between flex-wrap">
                <Button label="Создать" raised icon="pi pi-plus" @click="openCreateDialog" />
                <form ref="searchForm" class="flex gap-2 flex-wrap" @submit.prevent="getAboniments">
                    <FloatLabel>
                        <InputText v-model="search" style="width: 15cqmax" />
                        <label>Поиск</label>
                    </FloatLabel>
                    <Button icon="pi pi-search" raised type="submit" />
                </form>
            </div>
        </template>

        <Column field="id" header="ID" />
        <Column field="name" header="Name" />
        <Column field="price" header="Price" />

        <Column style="width: 10%">
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
                v-on:update:first="getAboniments"
                :rows="1"
                :total-records="aboniments.total_pages"
            >
                <template #start>
                    <Select v-model="count" :options="[20, 30, 50]" @change="getAboniments" />
                </template>
                <template #end>
                    <div class="totalElements">
                        <b>Количество элементов: </b>
                        {{ aboniments.total }}
                    </div>
                </template>
            </Paginator>
        </template>
    </DataTable>

    <Dialog v-model:visible="createDialog" modal class="min-w-[350px]" header="Create aboniment">
        <AddAboniment @created="created" />
    </Dialog>
    <Dialog v-model:visible="editDalog" modal class="min-w-[700px]" header="Edit aboniment">
        <EditAboniment :aboniment_id="aboniment_id" @edited="edited" />
    </Dialog>
</template>
