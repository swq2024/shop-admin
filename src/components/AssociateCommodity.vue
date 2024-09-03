<script setup lang="ts">
import { getCommodityrListApi } from '@/api/commodity';
import { useInitTable } from '@/utils/useCommon';
import { ref } from 'vue';

const {
    isLoading,
    tableData,
    currentPage,
    totalPages,
    pageSize,
    getTableData,
    // 多选实例
    multipleTableRef,
    // 获取批量选中的 ids
    multiSelectionIds,
    handleSelectionChange,
} = useInitTable({
    getListApi: getCommodityrListApi
})
const dialogVisible = ref(false)
const callbackFunction = ref(null)
const openDialog = (callback = null) => {
    callbackFunction.value = callback

    dialogVisible.value = true
}
defineExpose({
    openDialog
})
const closeDialog = () => dialogVisible.value = false
const submit = () => {
    if (typeof callbackFunction.value === "function") {
        // @ts-ignore
        callbackFunction.value(multiSelectionIds.value)
    }
    closeDialog()
}
</script>

<template>
    <el-dialog title="商品选择" v-model="dialogVisible" width="80%" destroy-on-close>
        <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%; height: 350px;"
            v-loading="isLoading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column label="商品">
                <template #default="{ row }">
                    <div class="flex">
                        <el-image :src="row.cover" fit="cover" :lazy="true" style="width: 50px;height: 50px"
                            class="mr-3 rounded" />
                        <div class="flex-1">
                            <p>{{ row.title }}</p>
                            <p class="text-gray-400 text-xs mb-1">分类：{{ row.category?.name }}</p>
                            <p class="text-gray-400 text-xs">创建时间：{{ row.create_time }}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="总库存" width="90" prop="stock" align="center" />
            <el-table-column label="价格(元)" width="150" align="center">
                <template #default="{ row }">
                    <span class="text-rose-500">￥{{ row.min_price }}</span>
                    <el-divider direction="vertical" />
                    <span class="text-gray-400 text-xs">￥{{ row.min_oprice }}</span>
                    <span></span>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex justify-center items-center mt-5">
            <el-pagination background layout="prev, pager, next" :total="totalPages" v-model:currentPage="currentPage"
                v-model:page-size="pageSize" @current-change="getTableData" />
        </div>
        <template #footer>
            <span>
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="submit">确认</el-button>
            </span>
        </template>
    </el-dialog>

</template>


<style scoped></style>
