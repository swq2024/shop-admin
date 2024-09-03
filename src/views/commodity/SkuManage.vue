<script setup lang="ts">
import { creatSkuApi, deleteSkuApi, getSkuListApi, updateSkuApi, updateSkuStatusApi } from '@/api/sku';
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/ListHeader.vue';
import TagInput from '@/components/TagInput.vue';
import { useInitForm, useInitTable } from '@/utils/useCommon';

const {
    isLoading,
    tableData,
    currentPage,
    totalPages,
    pageSize,
    multipleTableRef,
    getTableData,
    handleDelete,
    handleChangeStatus,
    handleSelectionChange,
    handleMultiDelete,
} = useInitTable({
    getListApi: getSkuListApi,
    delete: deleteSkuApi,
    updateStatus: updateSkuStatusApi
})

const {
    formRef,
    FormDrawerRef,
    form,
    formRules,
    drawerTitle,
    handleOpenAdd,
    handleEdit,
    handleSubmit,
} = useInitForm({
    form: {
        name: "",
        default: "",
        order: 1002,
        status: 1
    },
    rules: {
        name: [
            { type: "string", required: true, message: "规格名称不能为空", trigger: "blur" }
        ],
        default: [
            { type: "string", required: true, message: "规格值不能为空", trigger: "blur" }
        ],
    },
    getTableData,
    update: updateSkuApi,
    create: creatSkuApi
})

</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新数据 -->
        <ListHeader layout="create, delete, refresh" @create="handleOpenAdd" @refresh="getTableData"
            @delete="handleMultiDelete" />
        <!-- 表格数据 -->
        <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%" v-loading="isLoading"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="规格名称" />
            <el-table-column prop="default" label="规格值" width="240" />
            <el-table-column prop="order" label="排序" />
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
                    <el-popconfirm title="确认删除该规格?" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" text>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex justify-center items-center mt-5">
            <el-pagination background layout="prev, pager, next" :total="totalPages" v-model:currentPage="currentPage"
                v-model:page-size="pageSize" @current-change="getTableData" />
        </div>

        <!-- @vue-ignore 新增 | 编辑 -->
        <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit(formRef)" destoryOnClose>
            <el-form :model="form" ref="formRef" :rules="formRules" label-width="80px" :inline="false">

                <el-form-item label="规格名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入规格名称" />
                </el-form-item>

                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1005" />
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
                </el-form-item>

                <el-form-item label="规格值" prop="default">
                    <TagInput v-model="form.default" />
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>

</template>

<style scoped></style>
