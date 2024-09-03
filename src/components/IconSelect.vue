<script setup lang="ts">
import { ref } from 'vue';
import * as iconList from "@element-plus/icons-vue";

// 接收父组件传递的属性
defineProps({
    modelValue: String
})
// 向父组件传递函数 及 实参
const emit = defineEmits(["update:modelValue"])
// 图标集合
const iconSet = ref(Object.keys(iconList))

const handleChange = (currentIcon: string) => {
    // 把 currentIcon 通过emit 传递回父组件 实现父组件v-model 双向绑定数据
    emit("update:modelValue", currentIcon)

}
</script>

<template>
    <div class="w-45 flex items-center">
        <el-icon :size="18" class="mr-2" v-if="modelValue">
            <component :is="modelValue" />
        </el-icon>
        <!-- modelValue接收父组件传递的 modelValue 属性值 -->
        <el-select :modelValue="modelValue" placeholder="请选择菜单图标" @change="handleChange" filterable clearable>
            <el-option v-for="(item, index) in iconSet" :key="index" :label="item" :value="item">
                <div class="flex item-center justify-between">
                    <el-icon :size="18" class="mt-2">
                        <component :is="item" />
                    </el-icon>
                    <span class="text-gray-500">{{ item }}</span>
                </div>
            </el-option>
        </el-select>
    </div>
</template>



<style></style>
