<script setup lang="ts">
import { getCommodityDetailApi } from '@/api/commodity';
import FormDrawer from '@/components/FormDrawer.vue';
import { reactive, ref } from 'vue';
import { toast } from '@/utils/layer';
import { updateSkuApi } from '@/api/sku';
import SkuOption from './components/SkuOption.vue';
import SkuSetting from './components/SkuSetting.vue';
import { commodityId, initSkuCardList } from '@/utils/useSku';


const formDrawerRef = ref(null)

const form = reactive({
    sku_type: 0,
    sku_value: {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,
        volume: 0
    },
})

// 当前商品 ID
// const commodityId = ref(0)
const openContentDrawer = (row: any) => {
    commodityId.value = row.id

    // 设置请求轮播图数据列表的加载状态
    row.skuLoading = true
    getCommodityDetailApi(commodityId.value)
        .then((res: any) => {
            const { sku_type, sku_value } = res
            form.sku_type = sku_type
            form.sku_value = sku_value ||
            {
                oprice: 0,
                pprice: 0,
                cprice: 0,
                weight: 0,
                volume: 0
            },

            initSkuCardList(res)
            // @ts-ignore
            formDrawerRef.value.open()
        })
        .finally(() => {
            row.skuLoading = false
        })
}

defineExpose({
    openContentDrawer
})

const emit = defineEmits(["reloadData"])

const onSubmit = () => {
    // @ts-ignore
    formDrawerRef.value.showLoading()
    updateSkuApi(commodityId.value, form)
        .then(() => {
            toast("设置商品规格成功")
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
    <FormDrawer ref="formDrawerRef" title="商品规格" size="70%" @submit="onSubmit" destory-on-close>
        <el-form :model="form">
            <el-form-item label="规格类型">
                <el-radio-group v-model="form.sku_type">
                    <el-radio :value="0">单规格</el-radio>
                    <el-radio :value="1">多规格</el-radio>
                </el-radio-group>
            </el-form-item>

            <template v-if="form.sku_type === 0">
                <el-form-item label="市场价格">
                    <el-input v-model="form.sku_value.oprice" style="width: 45%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="销售价格">
                    <el-input v-model="form.sku_value.pprice" style="width: 45%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="成本价格">
                    <el-input v-model="form.sku_value.cprice" style="width: 45%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="商品重量">
                    <el-input v-model="form.sku_value.weight" style="width: 45%;">
                        <template #append>公斤</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="商品体积">
                    <el-input v-model="form.sku_value.volume" style="width: 45%;">
                        <template #append>立方米</template>
                    </el-input>
                </el-form-item>
            </template>

            <template v-else>
                <!-- 规格选项 -->
                <SkuOption />
                <!-- 规格设置 -->
                <SkuSetting />
            </template>
        </el-form>
    </FormDrawer>
</template>


<style scoped></style>
