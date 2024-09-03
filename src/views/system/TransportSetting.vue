<script setup lang="ts">
import { getOriginalSysConfigApi, updateSysConfigApi } from '@/api/system_setting';
import { reactive, ref } from 'vue';


const loading = ref(false)

const form = reactive({
    "ship": ""
})
const getSysConfigData = () => {
    loading.value = true
    getOriginalSysConfigApi()
        .then((res) => {
            for (const key in form) {
                // @ts-ignore
                form[key] = res[key]
            }
            // @ts-ignore
            form.password_encrypt = form.password_encrypt.split(",")
        })
        .finally(() => loading.value = false)
}
getSysConfigData()
const onSubmit = () => {
    loading.value = true
    updateSysConfigApi({
        ...form
    })
        .then(() => {
            // toast("操作成功")
            getSysConfigData()
        })
        .finally(() => loading.value = false)
}


</script>

<template>
    <div v-loading="loading" class="bg-white p-4 rounded">
        <el-form :model="form" label-width="160px">
            <el-form-item label="物流查询key">
                <div>
                    <el-input v-model="form.ship" placeholder="物流查询key" />
                    <small class="text-gray-500 flex mt-1">用于查询物流信息，接口申请（仅供参考）</small>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<style scoped></style>
