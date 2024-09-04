<script setup lang="ts">
import { ref } from 'vue';
import LockPage from './LockPage.vue';
import UnLockForm from './UnLockForm.vue';
import { updateDate } from '@/utils/clock';
import dayjs from 'dayjs';


const LockPageVisisble = ref(true)

const openUnLockForm = () => LockPageVisisble.value = false
const openLockPage = () => LockPageVisisble.value = true

const { date, week, hour, minute } = updateDate()

</script>

<template>
    <div class="lock_body">
        <LockPage v-if="LockPageVisisble" @unlock="openUnLockForm" />
        <UnLockForm v-else @backlock="openLockPage" />
        <div class="lock_footer">
            <div v-if="!LockPageVisisble" class="mb-2 text-3xl">
                {{ hour }}:{{ minute }}
                <span class="text-lg">{{ dayjs().hour() <= 12 ? 'AM' : 'PM' }}</span>
            </div>
            <div class="text-3xl">
                {{ date }} {{ week }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.lock_body {
    @apply w-full h-full bg-black fixed z-2000 ml-[-20px] pt-4 pb-4;
}

.lock_footer {
    @apply absolute bottom-2 w-full text-center text-xl text-3xl text-light-50;
}
</style>
