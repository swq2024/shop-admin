<script setup lang="ts">
defineProps({
    label: String
})
</script>

<template>
    <el-col :span="8" :offset="0">
        <el-form-item :label="label">
            <!-- 默认插槽 -->
            <slot></slot>

        </el-form-item>
    </el-col>
</template>

<style scoped></style>
