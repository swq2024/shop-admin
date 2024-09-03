<script setup lang="ts">
import { getCommodityDetailApi, updateCommodityApi } from '@/api/commodity';
import FormDrawer from '@/components/FormDrawer.vue';
// @ts-ignore
import Editor from '@/components/Editor.vue';
import { reactive, ref } from 'vue';
import { toast } from '@/utils/layer';


const formDrawerRef = ref(null)

const form = reactive({
    content: "",
})

// 当前商品 ID
const commodityId = ref(0)
const openContentDrawer = (row: any) => {
    commodityId.value = row.id

    // 设置请求轮播图数据列表的加载状态
    row.contentLoading = true
    getCommodityDetailApi(commodityId.value)
        .then((res: any) => {
            form.content = res.content
            // @ts-ignore
            formDrawerRef.value.open()
        })
        .finally(() => {
            row.contentLoading = false
        })
}

defineExpose({
    openContentDrawer
})

const emit = defineEmits(["reloadData"])

const onSubmit = () => {
    // @ts-ignore
    formDrawerRef.value.showLoading()
    updateCommodityApi(commodityId.value, form)
        .then(() => {
            toast("设置商品详情成功")
            // @ts-ignore
            formDrawerRef.value.close()
            // 刷新数据
            emit("reloadData")
        })
        .finally(() => {
            // @ts-ignore
            formDrawerRef.value.hideLoading()
        })
}
</script>

<template>
    <FormDrawer ref="formDrawerRef" title="商品详情" @submit="onSubmit" destory-on-close>
        <el-form :model="form">
            <el-form-item>
                <Editor v-model="form.content" />
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>


<style scoped></style>
