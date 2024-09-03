<script setup lang="ts">
import { createCategoryApi, deleteCategoryApi, getCategoryListApi, updateCategoryApi, updateCategoryStatusApi } from '@/api/category';
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/ListHeader.vue';
import { useInitForm, useInitTable } from '@/utils/useCommon';
import CommodityDrawer from './components/CommodityDrawer.vue';
import { ref } from 'vue';


const {
    isLoading,
    tableData,
    getTableData,
    handleDelete,
    handleChangeStatus
} = useInitTable({
    getListApi: getCategoryListApi,
    onGetListSuccess: (res: any) => {
        tableData.value = res.map((o: any) => {
            o.commodityDrawerLoading = false
            return o
        })

    },
    updateStatus: updateCategoryStatusApi,
    delete: deleteCategoryApi
})

const {
    form,
    formRules,
    FormDrawerRef,
    formRef,
    drawerTitle,
    handleOpenAdd,
    handleEdit,
    handleSubmit,
} = useInitForm({
    form: {
        name: ""
    },
    rules: {},
    create: createCategoryApi,
    update: updateCategoryApi,
    getTableData: getTableData
})
const CommodityDrawerRef = ref(null)
const handleRecommendCommodity = (row: any) => {
    // @ts-ignore
    CommodityDrawerRef.value.open(row).then(() => loading.value = false)

}
</script>

<template>
    <el-card shadow="never" class="border-0">
        <ListHeader layout="create, refresh" @create="handleOpenAdd" @refresh="getTableData" />
        <!-- 表格数据 -->
        <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%" v-loading="isLoading">
            <el-table-column prop="name" label="分类名称" />
            <el-table-column label="推荐" align="center">
                <template #default="{ row }">
                    <el-button type="primary" size="small" text @click="handleRecommendCommodity(row)"
                        :loading="row.commodityDrawerLoading">推荐商品</el-button>
                </template>
            </el-table-column>

            <el-table-column label="状态" width="240">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="handleChangeStatus($event, row)" :loading="row.statusLoading"
                        :disabled="row.super === 1" />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="260" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">编辑</el-button>
                    <el-popconfirm title="确认删除该分类?" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" text>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- @vue-ignore -->
        <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit(formRef)" destoryOnClose>
            <el-form :model="form" ref="formRef" :rules="formRules">
                <el-form-item prop="name" label="分类名称">
                    <el-input v-model="form.name" placeholder="请输入分类名称" />
                </el-form-item>
            </el-form>
        </FormDrawer>

        <!--  -->
        <CommodityDrawer ref="CommodityDrawerRef">

        </CommodityDrawer>
    </el-card>

</template>



<style scoped></style>
