<script setup lang="ts">
import { initSkuCardValue } from '@/utils/useSku';

const props = defineProps({
    skuCardId: [Number, String]
})

const {
    item,
    inputValue,
    inputVisible,
    InputRef,
    optLoading,
    handleClose,
    handlechange,
    showInput,
    handleInputConfirm
    // @ts-ignore
} = initSkuCardValue(props.skuCardId)

</script>

<template>
    <div class="flex gap-2" v-loading="optLoading">
        <!-- @vue-ignore -->
        <el-tag v-for="(tag, index) in item.goodsSkusCardValue" :key="index" closable :disable-transitions="false"
            @close="handleClose(tag)" effect="plain">
            <el-input v-model="tag.text" placeholder="选项值" size="small" class="w-20 ml-[-10px]" clearable @change="handlechange($event, tag)"/>
        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag" size="small" @click="showInput">
            + 添加选项值
        </el-button>
    </div>
</template>

<style scoped></style>
