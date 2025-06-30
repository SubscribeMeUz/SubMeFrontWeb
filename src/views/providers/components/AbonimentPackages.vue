<script setup>
import { reactive, ref } from 'vue';
import { useToast, useConfirm } from 'primevue';
import { useAbonimentPackageStore } from '@/stores/abonimentPackage';

const props = defineProps({
    abonimentPackages: [Object, Array],
    providerId: [String, Number]
});

const emit = defineEmits(['created', 'deleted', 'edited']);

const abonimentPackageStore = useAbonimentPackageStore();

const toast = useToast();
const confirm = useConfirm();

const createDialog = ref(false);
const createLoading = ref(false);
const editDalog = ref(false);
const editItem = ref(null);
const editLoading = ref(false);
const tableLoading = ref(false);
const packageId = ref(null);
const createCredentials = reactive({
    plan_name: '',
    label: '',
    title: '',
    subtitle: '',
    count: 0,
    expiry_days: 0,
    discount: 0,
    provider_id: props.providerId
});

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
                const data = await abonimentPackageStore.deletePackage(id);
                emit('deleted', data);
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

function openCreateDialog() {
    createDialog.value = true;
}

async function create() {
    try {
        createLoading.value = true;
        const data = await abonimentPackageStore.addPackage(createCredentials);
        emit('created', data);
        if (data.status == 200 || data.status == 201) {
            createDialog.value = false;
            createCredentials.plan_name = '';
            createCredentials.label = '';
            createCredentials.title = '';
            createCredentials.subtitle = '';
            createCredentials.count = 0;
            createCredentials.expiry_days = 0;
            createCredentials.discount = 0;
        }
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

function openEditDialog(item) {
    packageId.value = item.id;
    editItem.value = { ...item };
    editDalog.value = true;
}

async function edit() {
    try {
        editLoading.value = true;
        const data = await abonimentPackageStore.editPackage(packageId.value, editItem.value);
        emit('edited', data);
        if (data.status == 200) {
            editDalog.value = false;
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error,
            life: 3000
        });
    } finally {
        editLoading.value = false;
    }
}
</script>

<template>
    <div class="border-[1px] rounded-md p-4 my-4">
        <DataTable
            :value="abonimentPackages"
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 20, 30]"
            removableSort
            :loading="tableLoading"
        >
            <template #empty>Информация не найдена</template>

            <template #header>
                <div class="flex justify-between">
                    <p class="text-2xl font-bold">Абонементные пакеты</p>
                    <Button label="Создать" raised icon="pi pi-plus" @click="openCreateDialog" />
                </div>
            </template>

            <Column field="id" header="ID" />
            <Column field="title" sortable header="Заголовок" />
            <Column field="subtitle" sortable header="Подзаголовок" />
            <Column field="plan_name" sortable header="Название плана" />
            <Column field="label" sortable header="Метка" />
            <Column field="count" sortable header="Количество" />
            <Column field="expiry_days" sortable header="Срок действия (в днях)" />
            <Column style="width: 12%">
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
                            @click="openEditDialog(slotProps.data)"
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
        </DataTable>
    </div>

    <Dialog v-model:visible="createDialog" modal header="Создать абонементный пакет">
        <form ref="createForm" class="mt-5 flex flex-col gap-8" @submit.prevent="create">
            <div class="flex gap-7 flex-col">
                <div class="flex flex-wrap gap-4">
                    <FloatLabel>
                        <InputText v-model="createCredentials.plan_name" required class="w-96" />
                        <label>Название плана</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText v-model="createCredentials.label" class="w-96" />
                        <label>Метка</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-wrap gap-4">
                    <FloatLabel>
                        <InputText v-model="createCredentials.title" required class="w-96" />
                        <label>Заголовок</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText v-model="createCredentials.subtitle" required class="w-96" />
                        <label>Подзаголовок</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-wrap gap-4">
                    <FloatLabel>
                        <InputNumber v-model="createCredentials.count" :min="0" showButtons class="w-96" />
                        <label>Количество</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputNumber
                            v-model="createCredentials.expiry_days"
                            :min="0"
                            showButtons
                            class="w-96"
                        />
                        <label>Срок действия (в днях)</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-wrap gap-4">
                    <FloatLabel>
                        <InputNumber v-model="createCredentials.discount" :min="0" showButtons class="w-96" />
                        <label>Скидка</label>
                    </FloatLabel>
                </div>
            </div>
            <div class="flex justify-end">
                <Button label="Создать" raised :loading="createLoading" type="submit" />
            </div>
        </form>
    </Dialog>

    <Dialog v-model:visible="editDalog" modal header="Edit aboniment package">
        <form ref="createForm" class="mt-5 flex flex-col gap-8" @submit.prevent="edit">
            <div class="flex gap-7 flex-col">
                <div class="flex flex-wrap gap-4">
                    <FloatLabel>
                        <InputText v-model="editItem.plan_name" required class="w-96" />
                        <label>Название плана</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText v-model="editItem.label" class="w-96" />
                        <label>Метка</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-wrap gap-4">
                    <FloatLabel>
                        <InputText v-model="editItem.title" required class="w-96" />
                        <label>Заголовок</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText v-model="editItem.subtitle" required class="w-96" />
                        <label>Подзаголовок</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-wrap gap-4">
                    <FloatLabel>
                        <InputNumber v-model="editItem.count" :min="0" showButtons class="w-96" />
                        <label>Количество</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputNumber v-model="editItem.expiry_days" :min="0" showButtons class="w-96" />
                        <label>Срок действия (в днях)</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-wrap gap-4">
                    <FloatLabel>
                        <InputNumber v-model="editItem.discount" :min="0" showButtons class="w-96" />
                        <label>Скидка</label>
                    </FloatLabel>
                </div>
            </div>
            <div class="flex justify-end">
                <Button label="Обновить" raised :loading="editLoading" type="submit" />
            </div>
        </form>
    </Dialog>
</template>
