<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const fullname = ref('');
const phone = ref('');
const reason = ref('');
const submitted = ref(false);
const toast = useToast();

function submitForm() {
    if (!fullname.value || !phone.value) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Пожалуйста, заполните все обязательные поля.',
            life: 3000
        });
        return;
    }

    toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Заявка успешно отправлена.',
        life: 3000
    });

    fullname.value = '';
    phone.value = '';
    reason.value = '';
    submitted.value = true;
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
        <div class="card p-6 max-w-3xl w-full">
            <h2 class="text-3xl font-bold mb-4">Удаление аккаунта</h2>

            <p class="mb-6 font-semibold">
                Для удаления данных в приложении SubMe заполните следующую форму:
            </p>

            <div v-if="!submitted">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="fullname" class="block mb-1">Полное имя</label>
                        <InputText id="fullname" v-model="fullname" class="w-full" />
                    </div>
                    <div>
                        <label for="phone" class="block mb-1">Номер телефона</label>
                        <InputGroup>
                            <InputGroupAddon>+998</InputGroupAddon>
                            <InputMask id="phone" v-model="phone" mask="999999999" class="w-full" />
                        </InputGroup>
                    </div>
                </div>

                <div class="mt-4">
                    <label for="reason" class="block mb-1">Причина удаления</label>
                    <Textarea v-model="reason" id="reason" rows="5" class="w-full" />
                </div>

                <p class="text-sm mt-4">
                    <span class="text-red-500">*</span>
                    Отправляя заявку, вы подтверждаете удаление всех связанных с этим номером данных.
                </p>

                <div class="flex justify-end">
                    <Button label="Отправить" icon="pi pi-send" class="mt-4" @click="submitForm" />
                </div>
            </div>

            <div v-else class="mt-6 text-green-600 font-semibold text-lg">Ваша заявка рассматривается.</div>
        </div>
    </div>
</template>
