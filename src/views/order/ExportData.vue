<script setup lang="ts">
import { exportOrderApi } from '@/api/order';
import { toast } from '@/utils/layer';
import { reactive, ref } from 'vue';

const props = defineProps({
    tabs: Array
})

const form = reactive({
    tab: null,
    time: ""
})

const drawerVisible = ref(false)
const openDrawer = () => drawerVisible.value = true
const closeDrawer = () => drawerVisible.value = false

defineExpose({
    openDrawer
})

const downloadFileData = (URL: string) => {
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = URL
    const fileName = `${(new Date()).getTime()}.xlsx`
    link.setAttribute("download", fileName)
    document.body.appendChild(link)
    link.click()
    closeDrawer()
}

const loading = ref(false)
const onExport = () => {
    if (!form.tab) return toast("订单类型不能为空", "error")
    loading.value = true
    let starttime = null
    let endtime = null
    if (form.time && Array.isArray(form.time)) {
        starttime = form.time[0]
        endtime = form.time[1]
    }
    exportOrderApi({
        tab: form.tab,
        starttime: starttime,
        endtime: endtime
    })
        .then((data) => {
            // @ts-ignore
            const url = window.URL.createObjectURL(new Blob([data]))
            downloadFileData(url)
        })
        .finally(() => loading.value = false)
}


</script>

<template>
    <el-drawer title="导出订单" v-model="drawerVisible" size="40%">
        <el-form :model="form" label-width="80px">
            <el-form-item label="订单类型" prop="tab">
                <el-select v-model="form.tab" placeholder="请选择订单类型" clearable>
                    <!-- @vue-ignore -->
                    <el-option v-for="(item, index) in props.tabs" :key="index" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>

            </el-form-item>
            <el-form-item label="时间范围" prop="time">
                <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onExport" :loading="loading">导出数据</el-button>
                <!-- <el-button @click="closeDrawer">取消</el-button> -->
            </el-form-item>
        </el-form>
    </el-drawer>

</template>

<style scoped></style>
