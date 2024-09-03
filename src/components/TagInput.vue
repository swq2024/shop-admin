<script setup lang="ts">
import { nextTick, ref } from 'vue'
import type { InputInstance } from 'element-plus'
// 接收父组件 v-model 的值
const props = defineProps({
    modelValue: String
})
const emit = defineEmits(["update:modelValue"])

const inputValue = ref('')
const dynamicTags = ref(props.modelValue ? props.modelValue.split(",") : [])
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}
// 确认输入
const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value)
        // 以逗号分隔的字符串通知给父组件的 v-model
        emit("update:modelValue", dynamicTags.value.join(","))
    }
    inputVisible.value = false
    inputValue.value = ''
}
// 关闭tag时删除
const handleClose = (tag: string) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    // 以逗号分隔的字符串通知给父组件的 v-model
    emit("update:modelValue", dynamicTags.value.join(","))
}
</script>

<template>
    <div class="flex gap-2">
        <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
            {{ tag }}
        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag" size="small" @click="showInput">
            + 添加
        </el-button>
    </div>
</template>


<style scoped></style>
