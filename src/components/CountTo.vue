<script setup lang="ts">
import gsap from 'gsap';
import { reactive, watch } from 'vue';

const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
})
// 不能使用ref管理
const initVal = reactive({
    num: 0
})
const AnimateToValue = () => {
    gsap.to(initVal, {
        num: props.value,
        duration: 0.5,
    })
}

AnimateToValue()

watch(() => props.value, () => AnimateToValue())
</script>

<template>
    {{ initVal.num.toFixed(0) }}
</template>

<style scoped></style>
