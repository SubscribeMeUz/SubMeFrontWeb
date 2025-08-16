<script setup>
import router from './router';

const role = localStorage.getItem('user_role');

if (!role) {
    router.push('/auth/login');
}
</script>

<template>
    <router-view />

    <ConfirmDialog position="top"></ConfirmDialog>

    <Toast />
</template>

<style scoped></style>
