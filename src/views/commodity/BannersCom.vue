<script setup lang="ts">
import { getCommodityDetailApi, setCommodityBannerApi } from '@/api/commodity';
import SelectImage from '@/components/SelectImage.vue';
import type { CommodityBannersType } from '@/types/commdity';
import { toast } from '@/utils/layer';
import { reactive, ref } from 'vue';

const drawerVisible = ref(false)
const form = reactive({
    banners: []
})

// 当前商品 ID
const commodityId = ref(0)
const openBannersDrawer = (row: any) => {
    commodityId.value = row.id

    // 设置请求轮播图数据列表的加载状态
    row.bannerLoading = true
    getCommodityDetailApi(commodityId.value)
        .then((res: any) => {
            // console.log(res);
            form.banners = res.goodsBanner.map((item: CommodityBannersType) => item.url)

            drawerVisible.value = true
        })
        .finally(() => {
            row.bannerLoading = false
        })
}
const closeBannersDrawer = () => drawerVisible.value = false

defineExpose({
    openBannersDrawer
})

const emit = defineEmits(["reloadData"])
const isLoading = ref(false)
const onSubmit = () => {
    isLoading.value = true
    setCommodityBannerApi(commodityId.value, form.banners)
        .then(() => {
            toast("设置轮播图成功")

            closeBannersDrawer()

            // 刷新数据
            emit("reloadData")
        })
        .finally(() => {
            isLoading.value = false
        })
}
</script>

<template>
    <el-drawer title="设置轮播图" v-model="drawerVisible" size="50%" destroy-on-close>
        <el-form :model="form" label-width="80px">
            <el-form-item label="轮播图">
                <!--  -->
                <SelectImage v-model:model-value="form.banners" :limit="9" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="isLoading">提交</el-button>
                <el-button type="primary" @click="closeBannersDrawer">取消</el-button>
            </el-form-item>
        </el-form>


    </el-drawer>
</template>


<style scoped></style>
