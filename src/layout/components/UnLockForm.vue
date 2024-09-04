<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { getLockPassword, removeLockPassword, removeLockStatus } from '@/utils/access';
import { toast } from '@/utils/layer';
import type { FormInstance } from 'element-plus';
import { md5 } from 'js-md5';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';


const userInfo = useUserStore()
const lockPassword = getLockPassword()

const router = useRouter()
const unlockForm = reactive({
    password: ""
})
const formRef = ref<FormInstance>()
const rules = [{ required: true, message: '锁屏密码不能为空', trigger: 'blur' }]

const handleEnterSystem = (FormEl: FormInstance | undefined) => {
    if (!FormEl) return
    FormEl.validate((vaild: boolean) => {
        if (!vaild) return
        if (vaild) {
            // console.log(unlockForm.password,lockPassword);

            if (md5(unlockForm.password) === lockPassword) {
                removeLockStatus()
                removeLockPassword()

                FormEl.resetFields()
                location.reload()
            } else {
                toast("锁屏密码错误", "error")
            }
        }
    })
}

const backlogin = () => {
    userInfo.removeLogoutStatus()
    router.replace("/login")
}

defineEmits(['backlock'])
</script>

<template>
    <div class="unlock_body">
        <div class="flex justify-center items-center flex-col w-[18.75rem] mb-10">
            <div>
                <!-- @vue-ignore -->
                <el-avatar :src="userInfo.user.avatar" size="large" shape="circle" fit="cover" />
            </div>
            <el-form :model="unlockForm" ref="formRef" style="height: 24vh;" class="form_class" @submit.prevent
                @keyup.enter="handleEnterSystem(formRef)">
                <el-form-item :rules="rules" prop="password">
                    <el-input v-model="unlockForm.password" placeholder="请输入锁屏密码" type="password"
                        class="w-92 h-10 border-0 outline-transparent" show-password />
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" class="w-92 h-9 rounded-lg bg-rose-500 hover:(bg-rose-600) border-0"
                        @click="handleEnterSystem(formRef)">
                        进入系统
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="default"
                        class="w-92 h-9 rounded-lg bg-transparent border-0 hover:(bg-[rgba(123,123,123,0.2)] text-light-50)"
                        @click="backlogin">
                        返回登录
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="default"
                        class="w-92 h-9 rounded-lg bg-transparent border-0 hover:(bg-[rgba(123,123,123,0.2)] text-light-50)"
                        @click="$emit('backlock')">
                        返回
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<style scoped>
.unlock_body {
    @apply flex justify-center items-center w-full h-full text-light-50;
}

.form_class {
    @apply relative top-12 flex flex-col justify-center items-center;
}

.el-input {
    --el-input-border-color: rgb(112, 112, 112);
    --el-input-hover-border-color: rgb(112, 112, 112);
    --el-input-focus-border-color: rgba(244, 63, 94, .6);
}

:deep(.el-form-item__content .el-input .el-input__wrapper) {
    background-color: #0C0A09;
}
</style>
