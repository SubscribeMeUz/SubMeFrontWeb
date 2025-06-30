<script setup>
import { useProviderStore } from '@/stores/provider';
import { ref, onMounted } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import FileInput from '@/components/base/FileInput.vue';
import { useUserStore } from '@/stores/user';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const emit = defineEmits(['edited']);
const props = defineProps({
    provider_id: [String, Number]
});

const userStore = useUserStore();
const providerStore = useProviderStore();

const name = ref(null);
const location_latt = ref(null);
const location_long = ref(null);
const logo = ref(null);
const owner_id = ref(null);
const markerRef = ref(null);
const userList = ref(null);
const editLoading = ref(false);
const providerData = ref(null);

async function getUserList() {
    try {
        const data = await userStore.getAllUsers();
        userList.value = data;
    } catch (error) {
        return error;
    }
}

async function getProviderByProviderId() {
    const data = await providerStore.getProviderByProviderId(props.provider_id);
    providerData.value = data;
    name.value = providerData.value.name;
    owner_id.value = providerData.value.owner?.id;
    location_latt.value = providerData.value.location_latt;
    location_long.value = providerData.value.location_long;
}

function updateLocation() {
    if (markerRef.value) {
        const pos = markerRef.value.marker.getPosition();
        location_latt.value = pos.lat();
        location_long.value = pos.lng();
    }
}

async function editProvider() {
    try {
        editLoading.value = true;
        const formData = new FormData();
        formData.append('name', name.value);
        formData.append('location_latt', location_latt.value.toString());
        formData.append('location_long', location_long.value.toString());
        if (logo.value) {
            formData.append('logo', logo.value);
        }
        formData.append('owner_id', owner_id.value);

        const data = await providerStore.editProvider(props.provider_id, formData);
        emit('edited', data);
    } catch (error) {
        return error;
    } finally {
        editLoading.value = false;
    }
}

onMounted(() => {
    getUserList();
    getProviderByProviderId();
});
</script>

<template>
    <form ref="createForm" @submit.prevent="editProvider">
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
            <Button label="Обновить" raised :loading="editLoading" type="submit" />
        </div>
    </form>
</template>
