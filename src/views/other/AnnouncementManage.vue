<script setup lang="ts">
import { creatNoticeApi, deleteNoticeApi, getNoticeListApi, updateNoticeApi } from '@/api/notice';
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/ListHeader.vue';
import { useInitForm, useInitTable } from '@/utils/useCommon';

const {
    isLoading,
    tableData,
    currentPage,
    totalPages,
    pageSize,
    getTableData,
    handleDelete,
} = useInitTable({
    getListApi: getNoticeListApi,
    delete: deleteNoticeApi
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
        title: "",
        content: ""
    },
    rules: {
        title: [
            { type: "string", required: true, message: "公告标题不能为空", trigger: "blur" }
        ],
        content: [
            { type: "string", required: true, message: "公告内容不能为空", trigger: "blur" }
        ]
    },
    getTableData,
    update: updateNoticeApi,
    create: creatNoticeApi
})

</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新数据 -->
        <ListHeader @create="handleOpenAdd" @refresh="getTableData" />
        <!-- 表格数据 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
            <el-table-column prop="title" label="公告标题" />
            <el-table-column prop="create_time" label="发布时间" width="480" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">编辑</el-button>
                    <el-popconfirm title="确认删除该公告?" confirm-button-text="确认" cancel-button-text="取消"
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
        <!-- @vue-ignore -->
        <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit(formRef)">
            <el-form :model="form" ref="formRef" :rules="formRules" label-width="80px" :inline="false">
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入公告标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input type="textarea" v-model="form.content" placeholder="请输入公告内容"
                        :autosize="{ minRows: 6, maxRows: 12 }"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>

</template>

<style scoped></style>
