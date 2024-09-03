<script setup lang="ts">
import { Delete, Edit } from '@element-plus/icons-vue';

defineProps({
    active: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(["edit", "delete"])
const edit = () => emit("edit")
const deleted = () => emit("delete")

</script>

<template>
    <div class="aside_list" :class="{ 'active': active }">
        <span class="truncate">
            <!-- 默认插槽 -->
            <slot></slot>
        </span>
        <el-button class="ml-auto px-1" text type="primary" size="small" @click.stop="edit">
            <el-icon :size="15">
                <Edit />
            </el-icon>
        </el-button>
        <!-- 阻止默认 点击切换分类事件 -->
        <span @click.stop="() => {}">
            <el-popconfirm title="确认删除该分类?" confirm-button-text="确认" cancel-button-text="取消" @confirm="deleted">
            <template #reference>
                <el-button text type="primary" size="small" class="px-1">
                    <el-icon :size="15">
                        <Delete />
                    </el-icon>
                </el-button>
            </template>
        </el-popconfirm>
        </span>
    </div>
</template>

<style scoped>
.aside_list {
    border-bottom: 1px solid #f4f4f4;
    @apply flex items-center p-4 text-sm text-gray-600 cursor-pointer;
}

.aside_list:hover,
.active {
    @apply bg-blue-50;
}
</style>
