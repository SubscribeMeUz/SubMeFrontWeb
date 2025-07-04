<script setup>
import { ref } from 'vue';
import { useToast, useConfirm } from 'primevue';
import { useProviderStore } from '@/stores/provider';

const props = defineProps({
    photos: [Object, Array],
    providerId: [String, Number]
});

const emit = defineEmits(['created', 'deleted']);

const providerStore = useProviderStore();

const toast = useToast();
const confirm = useConfirm();
const createLoading = ref(false);
const fileInput = ref(null);
const src = ref('/addPhoto.png');
const photo = ref();

const setFileInput = (el) => {
    fileInput.value = el;
};

function selectImage() {
    fileInput.value.click();
}

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            src.value = e.target.result;
        };
        reader.readAsDataURL(file);
        photo.value = file;
    }
};

async function addPhoto() {
    try {
        createLoading.value = true;
        const formData = new FormData();
        formData.append('file', photo.value);
        const data = await providerStore.addPhotoToProvider(props.providerId, formData);
        emit('created', data);
        if (data.status == 200) {
            src.value = '/addPhoto.png';
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

async function deletePhoto(id) {
    confirm.require({
        message: `Вы уверены, что хотите удалить?`,
        header: 'Подтвердите удаление',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        accept: async () => {
            try {
                const data = await providerStore.deletePhotoProvider(id);
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
</script>

<template>
    <div class="border-[1px] rounded-md p-4">
        <div class="flex justify-between">
            <p class="text-2xl font-bold">Фото провайдеров</p>
        </div>

        <div v-if="photos" class="mt-8 flex flex-wrap gap-6">
            <div v-for="(photo, i) in photos" :key="photo.id">
                <div class="flex flex-wrap gap-6">
                    <div class="card rounded-xl w-80 min-h-44 flex flex-col gap-4 p-4">
                        <div class="flex flex-col gap-4">
                            <Image
                                :src="photo.photo_url"
                                preview
                                class="border-[1px] rounded-md"
                                style="
                                    width: 100%;
                                    height: 150px;
                                    overflow: hidden;
                                    object-fit: contain;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                "
                            />
                        </div>
                        <div class="flex gap-1 justify-end">
                            <Button
                                icon="pi pi-trash"
                                raised
                                severity="danger"
                                @click="deletePhoto(photo.id)"
                            />
                        </div>
                    </div>
                    <div
                        v-if="i + 1 == photos.length"
                        class="card rounded-xl w-80 min-h-44 flex flex-col gap-4 p-4"
                    >
                        <div class="flex flex-col gap-4">
                            <input
                                type="file"
                                :ref="setFileInput"
                                accept="image/*"
                                @change="handleFileChange"
                                style="display: none"
                            />

                            <img
                                :src="src"
                                class="border-[1px] rounded-md cursor-pointer"
                                alt="Image"
                                @click="selectImage"
                                style="
                                    width: 100%;
                                    height: 150px;
                                    overflow: hidden;
                                    object-fit: contain;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                "
                            />
                        </div>
                        <div v-if="src != '/addPhoto.png'" class="flex gap-1 justify-end">
                            <Button icon="pi pi-check" raised :loading="createLoading" @click="addPhoto" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <p class="p-3 my-4 rounded-md text-gray-900 bg-slate-100">Информация не найдена</p>
        </div>
    </div>
</template>
