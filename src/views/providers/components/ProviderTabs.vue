<script setup>
import { useProviderStore } from '@/stores/provider';
import { reactive, ref } from 'vue';
import { useToast, useConfirm } from 'primevue';

const confirm = useConfirm();
const toast = useToast();

const props = defineProps({
    providerTabs: [Object, Array],
    providerId: [String, Number]
});

const emit = defineEmits(['created', 'deleted', 'edited']);

const providerStore = useProviderStore();

const createDialog = ref(false);
const editDialog = ref(false);
const createCredentials = reactive({
    label: '',
    value: '',
    title: '',
    provider_id: props.providerId
});
const createLoading = ref(false);
const editLoading = ref(false);
const tabItems = ref(null);

function openCreateDialog() {
    createDialog.value = true;
}

async function create() {
    try {
        createLoading.value = true;
        const data = await providerStore.addProviderTab(createCredentials);
        if (data.status == 201 || data.status == 200) {
            createDialog.value = false;
            createCredentials.title = '';
            createCredentials.label = '';
            createCredentials.value = '';
        }
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
                const data = await providerStore.deleteProviderTab(id);
                emit('deleted', data);
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: error,
                    life: 3000
                });
            }
        },
        reject: () => {}
    });
}

function openEditDialog(tab) {
    tabItems.value = { ...tab };
    editDialog.value = true;
}

async function edit() {
    try {
        editLoading.value = true;
        const data = await providerStore.editProviderTab(tabItems.value.id, tabItems.value);
        emit('edited', data);
        if (data.status == 200) {
            editDialog.value = false;
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
    <div class="border-[1px] rounded-md p-4">
        <div class="flex justify-between">
            <p class="text-2xl font-bold">Виды продуктов</p>
            <Button label="Создать" raised icon="pi pi-plus" @click="openCreateDialog" />
        </div>

        <div v-if="providerTabs" class="mt-8 flex flex-wrap gap-6">
            <div v-for="tab in providerTabs" :key="tab.id">
                <div class="card rounded-xl w-80 min-h-44 flex flex-col gap-4 p-4">
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-2">
                            <b class="text-[18px]">{{ tab.title }}</b>
                        </div>
                        <div class="flex gap-2">
                            <b>Название: </b>
                            <p>{{ tab.label }}</p>
                        </div>
                        <div class="flex gap-2">
                            <b>Значение: </b>
                            <p>{{ tab.value }}</p>
                        </div>
                    </div>
                    <div class="flex gap-1 justify-end">
                        <Button icon="pi pi-pencil" raised severity="info" @click="openEditDialog(tab)" />
                        <Button icon="pi pi-trash" raised severity="danger" @click="deleteItem(tab.id)" />
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p class="p-3 my-4 rounded-md text-gray-900 bg-slate-100">Информация не найдена</p>
        </div>
    </div>

    <Dialog v-model:visible="createDialog" header="Создать вкладку" modal>
        <form ref="createForm" class="mt-5 flex flex-col gap-8" @submit.prevent="create">
            <div class="flex gap-7 flex-col">
                <FloatLabel>
                    <InputText v-model="createCredentials.title" required class="w-96" />
                    <label>Заголовок</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText v-model="createCredentials.label" required class="w-96" />
                    <label>Название</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText v-model="createCredentials.value" required class="w-96" />
                    <label>Значение</label>
                </FloatLabel>
            </div>
            <div class="flex justify-end">
                <Button label="Создать" raised :loading="createLoading" type="submit" />
            </div>
        </form>
    </Dialog>

    <Dialog v-model:visible="editDialog" header="Редактировать вкладку" modal>
        <form ref="editForm" class="mt-5 flex flex-col gap-8" @submit.prevent="edit">
            <div class="flex gap-7 flex-col">
                <FloatLabel>
                    <InputText v-model="tabItems.title" required class="w-96" />
                    <label>Заголовок</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText v-model="tabItems.label" required class="w-96" />
                    <label>Название</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText v-model="tabItems.value" required class="w-96" />
                    <label>Значение</label>
                </FloatLabel>
            </div>
            <div class="flex justify-end">
                <Button label="Обновить" raised :loading="editLoading" type="submit" />
            </div>
        </form>
    </Dialog>
</template>
