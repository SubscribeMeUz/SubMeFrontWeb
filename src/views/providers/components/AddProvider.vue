<script setup>
import { useProviderStore } from '@/stores/provider';
import { ref, onMounted } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import FileInput from '@/components/base/FileInput.vue';
import { useUserStore } from '@/stores/user';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const emit = defineEmits(['created']);

const userStore = useUserStore();
const providerStore = useProviderStore();

const name = ref(null);
const location_latt = ref(41.3111);
const location_long = ref(69.2797);
const logo = ref(null);
const owner_id = ref(null);
const markerRef = ref(null);
const userList = ref(null);
const createLoading = ref(false);

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                location_latt.value = position.coords.latitude;
                location_long.value = position.coords.longitude;
            },
            (error) => {
                console.error('Ошибка геолокации:', error.message);
                alert('Доступ к местоположению был отклонён или произошла ошибка.');
            }
        );
    } else {
        alert('Ваш браузер не поддерживает Geolocation API');
    }
}

function updateLocation() {
    if (markerRef.value) {
        const pos = markerRef.value.marker.getPosition();
        location_latt.value = pos.lat();
        location_long.value = pos.lng();
    }
}

async function getUserList() {
    try {
        const data = await userStore.getAllUsers();
        userList.value = data;
    } catch (error) {
        return error;
    }
}

async function createProvider() {
    try {
        createLoading.value = true;
        const formData = new FormData();
        formData.append('name', name.value);
        formData.append('location_latt', location_latt.value.toString());
        formData.append('location_long', location_long.value.toString());
        formData.append('logo', logo.value);
        formData.append('owner_id', owner_id.value);

        const data = await providerStore.addProvider(formData);
        emit('created', data);
    } catch (error) {
        return error;
    } finally {
        createLoading.value = false;
    }
}

onMounted(() => {
    getCurrentLocation();
    getUserList();
});
</script>

<template>
    <form ref="createForm" @submit.prevent="createProvider">
        <div class="my-6 flex gap-6 flex-wrap">
            <div class="flex flex-col">
                <label class="font-bold ml-1">Название</label>
                <InputText v-model="name" class="w-96" />
            </div>
            <div class="flex flex-col">
                <label class="font-bold ml-1">Логотип</label>
                <FileInput v-model="logo" class="w-96" />
            </div>
            <div class="flex flex-col">
                <label class="font-bold ml-1">Владелец</label>
                <Select
                    v-model="owner_id"
                    :options="userList"
                    option-label="full_name"
                    option-value="id"
                    class="w-96"
                />
            </div>
        </div>

        <GoogleMap
            :api-key="apiKey"
            style="width: 70vw; height: 60vh"
            :center="{
                lat: Number(location_latt),
                lng: Number(location_long)
            }"
            :zoom="14"
        >
            <Marker
                ref="markerRef"
                :options="{
                    position: {
                        lat: Number(location_latt),
                        lng: Number(location_long)
                    },
                    draggable: true
                }"
                @dragend="updateLocation"
            />
        </GoogleMap>

        <div class="mt-6 flex justify-end">
            <Button label="Создать" raised :loading="createLoading" type="submit" />
        </div>
    </form>
</template>
