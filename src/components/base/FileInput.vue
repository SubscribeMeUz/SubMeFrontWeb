<script setup>
const props = defineProps({
    modelValue: File,
    type: {
        type: String,
        default: '*'
    }
});

const emit = defineEmits(['update:modelValue']);

const onChangeFile = (event) => {
    emit('update:modelValue', event.target.files[0]);
};
</script>

<template>
    <div>
        <input class="file" type="file" :accept="type" @change="onChangeFile" />
    </div>
</template>

<style>
.file {
    border: 1px solid var(--p-surface-300);
    padding: 4px;
    border-radius: 5px;
    box-sizing: border-box;
    width: 100%;
}
.file:hover {
    border-color: var(--p-surface-400);
}
.file:focus {
    border-color: var(--p-primary-400);
}
</style>
