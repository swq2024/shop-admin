<script setup lang="ts">
import { createManagerApi, deleteManagerApi, getManagerListApi, updateManagerStatusApi, updateManagerApi } from '@/api/manager';
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/ListHeader.vue';
import SearchCom from '@/components/SearchCom.vue';
import SearchItem from '@/components/SearchItem.vue';
import SelectImage from '@/components/SelectImage.vue';
import type { ResManagerType, RoleDataType } from '@/types/manager';
import { useInitForm, useInitTable } from '@/utils/useCommon';
import { ref } from 'vue';

const roleData = ref<RoleDataType[]>([])

const {
    isLoading,
    tableData,
    currentPage,
    totalPages,
    pageSize,
    searchForm,
    resetSearchForm,
    getTableData,
    handleDelete,
    handleChangeStatus
} = useInitTable({
    getListApi: getManagerListApi,
    searchForm: {
        keyword: ""
    },
    onGetListSuccess: (res: ResManagerType) => {
        // @ts-ignore
        tableData.value = res.list.map((item) => {
            // 为每一个item 的switch 添加statusLoading属性 ，初始值为false，切换状态时的加载动画
            // @ts-ignore
            item.statusLoading = false;
            return item;
        });
        // @ts-ignore
        totalPages.value = res.totalCount;
        // @ts-ignore
        roleData.value = res.roles;
    },
    delete: deleteManagerApi,
    updateStatus: updateManagerStatusApi
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
        username: "",
        password: "",
        role_id: null,
        status: 1,
        avatar: "",
    },
    rules: {
        username: [
            {
                type: "string",
                required: true,
                message: "用户名不能为空",
                trigger: "blur",
            },
        ],
        password: [
            {
                type: "string",
                required: true,
                message: "密码不能为空",
                trigger: "blur",
            },
        ],
        role_id: [
            {
                type: "number",
                required: true,
                message: "角色ID不能为空",
                trigger: "blur",
            },
        ],
    },
    getTableData,
    update: updateManagerApi,
    create: createManagerApi
})

</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- @vue-ignore 搜索 -->
        <SearchCom :model="searchForm" @search="getTableData" @reset="resetSearchForm">
            <!-- SearchCom组件的默认插槽 -->
            <SearchItem label="关键词">
                <!-- SearchItem组件的默认插槽 -->
                <el-input v-model="searchForm.keyword" placeholder="请输入管理员昵称" clearable />
            </SearchItem>
        </SearchCom>

        <!-- <el-form :model="searchForm" label-width="80px" class="mb-3" size="default">
            <el-row :gutter="20" class="">
                <el-col :span="8" :offset="0">
                    <el-form-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="请输入管理员昵称" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="8">
                    <div class="flex items-center justify-end">
                        <el-button type="primary" @click="getTableData">搜索</el-button>
                        <el-button @click="resetSearchForm">重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form> -->

        <!-- 新增 | 刷新数据 -->
        <ListHeader @create="handleOpenAdd" @refresh="getTableData" />
        <!-- 表格数据 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
            <el-table-column label="管理员" width="160">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-avatar :size="40" :src="row.avatar">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>
                        <div class="ml-3">
                            <h6>{{ row.username }}</h6>
                            <small>ID:{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="所属角色" align="center">
                <template #default="{ row }">
                    {{ row.role?.name || "-" }}
                </template>
            </el-table-column>
            <el-table-column label="状态" width="200">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="handleChangeStatus($event, row)" :loading="row.statusLoading"
                        :disabled="row.super === 1" />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <small v-if="scope.row.super === 1" class="text-sm text-gray-400 ">
                        暂无操作
                    </small>
                    <div v-else>
                        <el-button type="primary" size="small" text @click="handleEdit(scope.row)">编辑</el-button>
                        <el-popconfirm title="确认删除该管理员?" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button type="primary" size="small" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex justify-center items-center mt-5">
            <el-pagination background layout="prev, pager, next" :total="totalPages" v-model:currentPage="currentPage"
                v-model:page-size="pageSize" @current-change="getTableData" />
        </div>
        <!-- @vue-ignore -->
        <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit(formRef)">
            <el-form :model="form" ref="formRef" :rules="formRules" label-width="auto">

                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码" type="password" />
                </el-form-item>

                <el-form-item label="头像" prop="avatar">
                    <SelectImage v-model="form.avatar" ref="SelectImageRef" />
                </el-form-item>

                <el-form-item label="所属角色" prop="role_id" label-width="auto">
                    <el-select v-model="form.role_id" value-key="" placeholder="选择所属角色">
                        <el-option v-for="(item, index) in roleData" :key="index" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>

</template>

<style scoped></style>
