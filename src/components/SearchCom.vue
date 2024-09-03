<script setup lang="ts">
import { ref, useSlots } from 'vue';

defineProps({
    model: Object
})

defineEmits(["search", "reset"])

const showSearchCategory = ref(false)

const slots = useSlots()
// 判断当前组件是否含有 具名 插槽
const hasShowAdvancedSearch = ref(!!slots.showAdvancedSearch) // !!slots.show 强制将slots.show转换为Boolean类型
</script>


<template>
    <el-form :model="model" label-width="80px" class="mb-3" size="default">
        <el-row :gutter="20" class="">
            <!-- 默认插槽 -->
            <slot></slot>

            <!-- 具名插槽 -->
            <template v-if="showSearchCategory">
                <slot name="showAdvancedSearch"></slot>
            </template>
            <!-- 搜索按钮 -->
            <el-col :span="8" :offset="showSearchCategory ? 0 : 8">
                <div class="flex items-center justify-end">
                    <el-button type="primary" @click="$emit('search')">搜索</el-button>
                    <el-button @click="$emit('reset')">重置</el-button>
                    <el-button type="primary" text v-if="hasShowAdvancedSearch"
                        @click="showSearchCategory = !showSearchCategory">
                        {{ showSearchCategory ? '收起' : '展开' }}
                        <el-icon>
                            <ArrowUp v-if="showSearchCategory" />
                            <ArrowDown v-else />
                        </el-icon>
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>


<style scoped></style>
