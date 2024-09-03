<script setup lang="ts">
import { associateCommodityApi, deleteAssociateCommodityApi, getAssociateCommodityListApi } from '@/api/category';
import AssociateCommodity from '@/components/AssociateCommodity.vue';
import FormDrawer from '@/components/FormDrawer.vue';
import type { CategoryListType } from '@/types/category';
import { toast } from '@/utils/layer';
import { ref } from 'vue';

const FormDrawerRef = ref(null)
const category_id = ref(0)
const commodityDataList = ref([])
const open = (item: CategoryListType) => {
    category_id.value = item.id
    // @ts-ignore
    item.commodityDrawerLoading = true

    getTableData()
        // @ts-ignore
        .then(() => FormDrawerRef.value?.open())
        // @ts-ignore
        .finally(() => item.commodityDrawerLoading = false)

}

defineExpose({
    open
})

const getTableData = async () => {
    return getAssociateCommodityListApi(Number(category_id.value)).then((res) => {
        // @ts-ignore
        commodityDataList.value = res.map(o => {
            o.loading = false
            return o
        })
    })
}
const handleDelete = (row: any) => {
    row.loading = true
    deleteAssociateCommodityApi(row.id)
        .then(() => {
            toast("删除成功")
            getTableData()
        })
        .finally(() => {
            row.loading = false
        })
}
const AssociateCommodityRef = ref(null)
const handleAssociateCommodity = () => {
    // @ts-ignore
    AssociateCommodityRef.value?.openDialog((ids) => {
        // @ts-ignore
        FormDrawerRef.value?.showLoading()
        associateCommodityApi({
            category_id: category_id.value,
            goods_ids: ids
        }).then(() => {
            toast("关联成功")
            getTableData()
            // @ts-ignore
        }).finally(() => FormDrawerRef.value?.hideLoading())
    })
}
</script>

<template>
    <FormDrawer ref="FormDrawerRef" title="推荐商品" confirm-text="关联" @submit="handleAssociateCommodity">
        <el-table :data="commodityDataList" border stripe style="width: 100%;">
            <el-table-column prop="goods_id" label="ID" width="60" align="center" />
            <el-table-column label="商品封面" width="150" align="center">
                <template #default="{ row }">
                    <el-image :src="row.cover" fit="cover" :lazy="true" style="width: 64px; height: 64px;" />
                </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width="150" align="center" />
            <el-table-column label="操作" width="100" align="center">
                <template #default="{ row }">
                    <el-popconfirm title="确认删除该关联商品?" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(row)" width="190">
                        <template #reference>
                            <el-button type="primary" size="small" text :loading="row.loading">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </FormDrawer>
    <AssociateCommodity ref="AssociateCommodityRef" />
</template>

<style scoped></style>
