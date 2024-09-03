<script setup lang="ts">
import { ref } from 'vue';

const isLoading = ref(false)
const isDrawerVisible = ref(false)
//
const open = () => isDrawerVisible.value = true
//
const close = () => isDrawerVisible.value = false
//
const hideLoading = () => isLoading.value = false
//
const showLoading = () => isLoading.value = true
//
defineExpose({
    open,
    close,
    hideLoading,
    showLoading
})
//
const props = defineProps({
    title: String,
    size: {
        type: String,
        default: "33.3%"
    },
    destoryOnClose: {
        type: Boolean,
        default: false
    },
    confirmText: {
        type: String,
        default: "提交"
    }
})
// 向父组件传递方法(以及参数)
const emit = defineEmits(["submit"])
const submit = () => emit("submit")

</script>

<template>
    <el-drawer v-model="isDrawerVisible" :title="props.title" :size="props.size" :close-on-click-modal="false"
        :destory-on-close="props.destoryOnClose">
        <div class="formDrawer">

            <div class="body">
                <!-- 默认插槽 -->
                <slot></slot>
            </div>

            <div class="actions">
                <el-button type="primary" @click="submit" :loading="isLoading">{{ props.confirmText }}</el-button>
                <el-button type="default" @click="close">取消</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<style>
.formDrawer {
    width: 100%;
    height: 100%;
    position: relative;
    @apply flex flex-col;
}

.formDrawer .body {
    flex: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}

.formDrawer .actions {
    height: 50px;
    @apply flex items-center mt-auto;
}
</style>
