<script setup>
import { useLayout } from '@/layout/composables/layout';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
</script>

<template>
    <div class="flex items-center justify-center min-h-screen overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div
                style="
                    border-radius: 56px;
                    padding: 0.3rem;
                    background: linear-gradient(
                        180deg,
                        color-mix(in srgb, var(--primary-color), transparent 60%) 10%,
                        var(--surface-ground) 30%
                    );
                "
            >
                <div
                    class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center"
                    style="border-radius: 53px"
                >
                    <span class="text-primary font-bold text-5xl">404</span>
                    <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-4xl mb-2">
                        Не найдено
                    </h1>
                    <div class="text-surface-600 dark:text-surface-200 mb-8">
                        Запрашиваемый ресурс недоступен.
                    </div>
                    <router-link
                        to="/"
                        class="w-full flex items-center py-8 border-surface-300 dark:border-surface-500 border-b"
                    >
                        <span
                            class="flex justify-center items-center border-2 border-primary text-primary rounded-border"
                            style="height: 3.5rem; width: 3.5rem"
                        >
                            <i class="pi pi-fw pi-table !text-2xl"></i>
                        </span>
                        <span class="ml-6 flex flex-col">
                            <span
                                class="text-surface-900 dark:text-surface-0 lg:text-xl font-medium mb-0 block"
                                >Часто задаваемые вопросы</span
                            >
                        </span>
                    </router-link>
                    <router-link
                        to="/"
                        class="w-full flex items-center py-8 border-surface-300 dark:border-surface-500 border-b"
                    >
                        <span
                            class="flex justify-center items-center border-2 border-primary text-primary rounded-border"
                            style="height: 3.5rem; width: 3.5rem"
                        >
                            <i class="pi pi-fw pi-question-circle !text-2xl"></i>
                        </span>
                        <span class="ml-6 flex flex-col">
                            <span class="text-surface-900 dark:text-surface-0 lg:text-xl font-medium mb-0"
                                >Центр решений</span
                            >
                        </span>
                    </router-link>
                    <router-link
                        to="/"
                        class="w-full flex items-center mb-8 py-8 border-surface-300 dark:border-surface-500 border-b"
                    >
                        <span
                            class="flex justify-center items-center border-2 border-primary text-primary rounded-border"
                            style="height: 3.5rem; width: 3.5rem"
                        >
                            <i class="pi pi-fw pi-unlock !text-2xl"></i>
                        </span>
                        <span class="ml-6 flex flex-col">
                            <span class="text-surface-900 dark:text-surface-0 lg:text-xl font-medium mb-0"
                                >Менеджер прав доступа</span
                            >
                        </span>
                    </router-link>
                    <Button as="router-link" label="Назад" to="/" />
                </div>
            </div>
        </div>
    </div>
</template>
