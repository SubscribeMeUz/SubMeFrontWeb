<script setup>
import { ref } from 'vue';
import { useToast, useConfirm } from 'primevue';

const props = defineProps({
    photos: [Object, Array],
    providerId: [String, Number]
});

const emit = defineEmits(['created', 'deleted']);

const toast = useToast();
const confirm = useConfirm();
const defaultPhotoUrl = ref('/public/addPhoto.png');
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
                            <Button icon="pi pi-trash" raised severity="danger" />
                        </div>
                    </div>
                    <div
                        v-if="i + 1 == photos.length"
                        class="card rounded-xl w-80 min-h-44 flex flex-col gap-4 p-4"
                    >
                        <div class="flex flex-col gap-4">
                            <img
                                :src="defaultPhotoUrl"
                                class="border-[1px] rounded-md cursor-pointer"
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
                        <div v-if="defaultPhotoUrl != '/public/addPhoto.png'" class="flex gap-1 justify-end">
                            <Button icon="pi pi-check" raised />
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
