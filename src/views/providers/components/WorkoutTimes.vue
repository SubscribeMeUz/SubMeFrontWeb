<script setup>
import { reactive, ref } from 'vue';
import { useToast, useConfirm } from 'primevue';
import { useWorkoutStore } from '@/stores/workoutTimes';

const props = defineProps({
    workoutTimes: [Object, Array],
    providerId: [String, Number]
});

const emit = defineEmits(['created', 'deleted', 'edited']);

const workoutTimesStore = useWorkoutStore();

const toast = useToast();
const confirm = useConfirm();

const createDialog = ref(false);
const createLoading = ref(false);
const editDalog = ref(false);
const editItem = ref(null);
const editLoading = ref(false);
const workoutId = ref(null);
const createCredentials = reactive({
    title: '',
    from_time: '',
    to_time: '',
    discount: 0,
    provider_id: props.providerId
});
const tableLoading = ref(false);

function openCreateDialog() {
    createDialog.value = true;
}

async function create() {
    try {
        createLoading.value = true;
        const data = await workoutTimesStore.addWorkout(createCredentials);
        emit('created', data);
        if (data.status == 200 || data.status == 201) {
            createDialog.value = false;
            createCredentials.title = '';
            createCredentials.from_time = '';
            createCredentials.to_time = '';
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
                const data = await workoutTimesStore.deleteWorkout(id);
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

function openEditDialog(item) {
    workoutId.value = item.id;
    editItem.value = { ...item };
    editDalog.value = true;
}

async function edit() {
    try {
        editLoading.value = true;
        const data = await workoutTimesStore.editWorkout(workoutId.value, editItem.value);
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
            :value="workoutTimes"
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 20, 30]"
            removableSort
            :loading="tableLoading"
        >
            <template #empty>Информация не найдена</template>

            <template #header>
                <div class="flex justify-between">
                    <p class="text-2xl font-bold">Время работы</p>
                    <Button label="Создать" raised icon="pi pi-plus" @click="openCreateDialog" />
                </div>
            </template>

            <Column field="id" header="ID" />
            <Column field="title" sortable header="Заголовок" />
            <Column field="from_time" sortable header="С какого времени" />
            <Column field="to_time" sortable header="До какого времени" />
            <Column field="discount" sortable header="Скидка" />

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

    <Dialog v-model:visible="createDialog" modal header="Создать время тренировок">
        <form ref="createForm" class="mt-5 flex flex-col gap-8" @submit.prevent="create">
            <div class="flex gap-7 flex-col">
                <FloatLabel>
                    <InputText v-model="createCredentials.title" required class="w-96" />
                    <label>Заголовок</label>
                </FloatLabel>
                <FloatLabel>
                    <InputMask v-model="createCredentials.from_time" mask="99:99" class="w-96" />
                    <label>С какого времени</label>
                </FloatLabel>
                <FloatLabel>
                    <InputMask v-model="createCredentials.to_time" mask="99:99" class="w-96" />
                    <label>До какого времени</label>
                </FloatLabel>
                <FloatLabel>
                    <InputNumber v-model="createCredentials.discount" :min="0" showButtons class="w-96" />
                    <label>Скидка</label>
                </FloatLabel>
            </div>
            <div class="flex justify-end">
                <Button label="Создать" raised :loading="createLoading" type="submit" />
            </div>
        </form>
    </Dialog>

    <Dialog v-model:visible="editDalog" modal header="Редактировать время тренировок">
        <form ref="editForm" class="mt-5 flex flex-col gap-8" @submit.prevent="edit">
            <div class="flex gap-7 flex-col">
                <FloatLabel>
                    <InputText v-model="editItem.title" required class="w-96" />
                    <label>Заголовок</label>
                </FloatLabel>
                <FloatLabel>
                    <InputMask v-model="editItem.from_time" mask="99:99" class="w-96" />
                    <label>С какого времени</label>
                </FloatLabel>
                <FloatLabel>
                    <InputMask v-model="editItem.to_time" mask="99:99" class="w-96" />
                    <label>До какого времени</label>
                </FloatLabel>
                <FloatLabel>
                    <InputNumber v-model="editItem.discount" :min="0" showButtons class="w-96" />
                    <label>Скидка</label>
                </FloatLabel>
            </div>
            <div class="flex justify-end">
                <Button label="Обновить" raised :loading="editLoading" type="submit" />
            </div>
        </form>
    </Dialog>
</template>
