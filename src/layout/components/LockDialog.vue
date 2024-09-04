<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { setLockPassword, setLockStatus } from '@/utils/access';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

const userInfo = useUserStore()

const lockForm = reactive({
    password: ""
})
const formRef = ref<FormInstance>()
const rules = [{ required: true, message: '锁屏密码不能为空', trigger: 'blur' }]
const dialogVisible = ref(false)
const openDialog = () => dialogVisible.value = true
const closeDialog = () => dialogVisible.value = false
defineExpose({
    openDialog
})
const handleLockEvent = (FormEl: FormInstance | undefined) => {
    if (!FormEl) return
    FormEl.validate((vaild: boolean) => {
        if (!vaild) return
        if (vaild) {
            setLockStatus(true)
            setLockPassword(lockForm.password)
        }
        closeDialog()
        FormEl.resetFields()
        location.reload()
    })
}

const handleClosed = (FormEl: FormInstance | undefined) => {
    if (!FormEl) return
    FormEl.resetFields()
}


</script>

<template>
    <el-dialog v-model="dialogVisible" width="500" class="bg-blue-300 rounded-lg" destroy-on-close
        @closed="handleClosed(formRef)">
        <template #header>
            <div class="text-white flex flex-col text-left py-4 text-[1.445rem]">
                <b>锁定屏幕</b>
            </div>
        </template>
        <hr />
        <div class="flex flex-col items-center justify-center mt-10">
            <!-- @vue-ignore -->
            <el-avatar :src="userInfo.user.avatar" :size="80" shape="circle" fit="cover" />
            <p class="font-bold">
                <!-- @vue-ignore -->
                {{ userInfo.user.username }}
            </p>
        </div>
        <el-form :model="lockForm" ref="formRef" style="height: 18vh;" class="form_class" @submit.prevent
            @keyup.enter="handleLockEvent(formRef)">
            <el-form-item :rules="rules" prop="password">
                <el-input v-model="lockForm.password" placeholder="请输入锁屏密码" type="password" class="w-92 h-10"
                    show-password />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleLockEvent(formRef)" class="w-92 h-9 rounded-lg">
                    锁定
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<style scoped>
.form_class {
    @apply relative top-2 flex flex-col justify-center items-center;
}

</style>
