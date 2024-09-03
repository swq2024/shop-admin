<script setup lang="ts">
import { deleteVipLevelApi, getVipLevelListApi, createVipLevelApi, updateVipLevelApi, updateVipLevelStatusApi } from '@/api/level';
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
    handleChangeStatus
} = useInitTable({
    getListApi: getVipLevelListApi,
    delete: deleteVipLevelApi,
    updateStatus: updateVipLevelStatusApi
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
        level: 100,
        status: 1,
        discount: 0,
        max_price: 0,
        max_times: 0
    },
    rules: {
        name: [
            { type: "string", required: true, message: "会员等级名称不能为空", trigger: "blur" }
        ],
    },
    getTableData,
    update: updateVipLevelApi,
    create: createVipLevelApi
})
</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新数据 -->
        <ListHeader @create="handleOpenAdd" @refresh="getTableData" />
        <!-- 表格数据 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
            <el-table-column prop="name" label="会员等级" />
            <el-table-column prop="discount" label="折扣率" align="center" />
            <el-table-column prop="level" label="等级序号" align="center" />
            <el-table-column label="状态" width="120">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="handleChangeStatus($event, row)" :loading="row.statusLoading"
                        :disabled="row.super === 1" />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="260" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">编辑</el-button>
                    <el-popconfirm title="确认删除该会员等级?" confirm-button-text="确认" cancel-button-text="取消"
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
        <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit(formRef)" size="42%">
            <el-form :model="form" ref="formRef" :rules="formRules" label-width="80px" :inline="false">
                <el-form-item label="等级名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入等级名称"></el-input>
                </el-form-item>
                <el-form-item label="等级权重" prop="level">
                    <el-input v-model="form.level"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
                </el-form-item>
                <el-form-item label="升级条件">
                    <div>
                        <small class="mr-2">累计消费满</small>
                        <el-input-number v-model="form.max_price" style="width: 50%;" placeholder="累计消费" :min="0"
                            :max="9999" controls-position="right">
                            <template #append>元</template>
                        </el-input-number>
                        <small class="text-gray-400 flex">
                            设置会员等级所需要的累计消费必须大于等于0,单位：元
                        </small>
                        <small class="mr-2">累计次数满</small>
                        <el-input-number v-model="form.max_times" style="width: 50%;" placeholder="累计次数" :min="0"
                            :max="1000" controls-position="right">
                            <template #append>笔</template>
                        </el-input-number>
                        <small class="text-gray-400 flex">
                            设置会员等级所需要的购买量必须大于等于0,单位：笔
                        </small>
                    </div>
                </el-form-item>
                <el-form-item label="折扣率(%)" prop="discount">
                    <el-input v-model="form.discount" style="width: 65%;" placeholder="折扣率(%)">
                        <template #append>%</template>
                    </el-input>
                    <small class="text-gray-400 flex">
                        折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买
                    </small>
                </el-form-item>

            </el-form>
        </FormDrawer>
    </el-card>

</template>

<style scoped></style>
