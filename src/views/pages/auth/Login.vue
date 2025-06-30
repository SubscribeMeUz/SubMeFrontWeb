<script setup>
import { ref, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();

const router = useRouter();
const toast = useToast();
const authCredentials = reactive({
    username: '',
    password: ''
});
const loading = ref(false);
const authStore = useAuthStore();

async function login() {
    try {
        loading.value = true;
        const data = await authStore.login(authCredentials);
        if (data.status == 200) {
            toast.add({
                severity: 'success',
                summary: 'Авторизуйтесь успешно!',
                detail: 'Добро пожаловать',
                life: 3000
            });

            if (data.data.user.role == 'admin') {
                router.push('/');
            }
            if (data.data.user.role == 'provider') {
                router.push('/provider/list');
            }
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Пожалуйста, попробуйте еще раз!',
                life: 3000
            });
        }
    } catch (error) {
        return error;
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
    >
        <div class="flex flex-col items-center justify-center">
            <div
                style="
                    border-radius: 56px;
                    padding: 0.3rem;
                    background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
                "
            >
                <div
                    class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
                    style="border-radius: 53px"
                >
                    <div class="text-center mb-8">
                        <div class="logo-wrapper">
                            <h1 class="logo-text">SubMe</h1>
                            <div class="underline"></div>
                        </div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium my-4">
                            Добро пожаловать в SubMe!
                        </div>
                        <span class="text-muted-color font-medium">Войдите, чтобы продолжить</span>
                    </div>

                    <form ref="loginForm" @submit.prevent="login">
                        <label
                            for="username"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
                        >
                            Имя пользователя
                        </label>
                        <InputText
                            v-model="authCredentials.username"
                            id="username"
                            type="text"
                            placeholder="Имя пользователя"
                            required
                            class="w-full md:w-[30rem] mb-8"
                        />

                        <label
                            for="pass"
                            class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2"
                        >
                            Пароль
                        </label>
                        <Password
                            v-model="authCredentials.password"
                            inputId="pass"
                            placeholder="Пароль"
                            :toggleMask="true"
                            class="mb-4"
                            fluid
                            :feedback="false"
                        />

                        <Button label="Войти" class="w-full" type="submit" raised :loading="loading" />
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

.logo-wrapper {
    text-align: center;
}

.logo-text {
    font-size: 40px;
    font-weight: 700;
    color: var(--text-color);
    margin: 0;
    font-family: sans-serif;
    line-height: 42px;
    letter-spacing: 4px;
}

.underline {
    margin: 0 auto;
    width: 150px;
    height: 4px;
    background: linear-gradient(to right, #a6ff00, transparent);
    border-radius: 2px;
}
</style>
