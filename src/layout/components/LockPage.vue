<script setup lang="ts">
import { updateDate } from '@/utils/clock';
import dayjs from 'dayjs';

defineEmits(["unlock"])

const { hour, minute } = updateDate()

</script>

<template>
    <div class="w-full h-full">
        <div class="lock_header" @click="$emit('unlock')">
            <el-icon class="icon">
                <Lock />
            </el-icon>
            <p class="mt-1">点击解锁</p>
        </div>
        <div class="lock_main">
            <div class="h" style="align-content: center;">
                <span class="absolute left-4 top-4 text-xl font-semibold">
                    {{ dayjs().hour() <= 12 ? 'AM' : 'PM' }} </span>
                        {{ hour }}
            </div>
            <div class="m" style="align-content: center;">
                {{ minute }}
            </div>
        </div>

    </div>
</template>

<style scoped>
.lock_header {
    @apply flex flex-col justify-center items-center text-gray-400 hover:(text-white) text-xl font-semibold cursor-pointer mb-3;
}

.lock_main {
    @apply flex h-full justify-center bg-black px-[10%];
}

.lock_main .h,
.m {
    @apply relative mb-14 w-2/5 h-4/5 items-center flex-auto rounded-3xl bg-[rgb(41,37,36)] text-center text-light-50 text-[16.25rem];
}

.lock_main .h {
    @apply mr-20;
}

.icon {
    transition: transform .3s;
}

.lock_header:hover .icon {
    transform: scale3d(1.35, 1.35, 1.35)
}

@keyframes pulse {
    0% {
        -webkit-transform: scaleX(1);
        transform: scaleX(1)
    }

    50% {
        -webkit-transform: scale3d(1.05, 1.05, 1.05);
        transform: scale3d(1.05, 1.05, 1.05)
    }

    to {
        -webkit-transform: scaleX(1);
        transform: scaleX(1)
    }
}
</style>
