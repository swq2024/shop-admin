<script setup lang="ts">
import { configRoleAuthApi, creatRoleApi, deleteRoleApi, getRoleListApi, updateRoleApi, updateRoleStatusApi } from '@/api/role';
import { getRuleListApi } from '@/api/rule';
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/ListHeader.vue';
import type { RoleIdsListType, RoleListType } from '@/types/role';
import { toast } from '@/utils/layer';
import { useInitForm, useInitTable } from '@/utils/useCommon';
import type { FormInstance } from 'element-plus';
import { ref } from 'vue';

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
    getListApi: getRoleListApi,
    delete: deleteRoleApi,
    updateStatus: updateRoleStatusApi
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
        desc: "",
        status: 1
    },
    rules: {
        name: [
            { type: "string", required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
    },
    getTableData,
    update: updateRoleApi,
    create: creatRoleApi
})

const setAuthFormDrawerRef = ref<FormInstance>()
const ruleList = ref([])
const defaultExpandedKeys = ref([])
const elTreeRef = ref(null)
// 父子节点是否 不互相 关联
const checkStrictly = ref(false)
// 当前用户的 id
const roleId = ref(0)
// 当前用户所拥有的全部权限 ids[]
const ruleIds = ref([])
const treeHeight = ref(0)
const defaultProps = {
    label: "name",
    children: "child",
}
const openSetAuth = (row: RoleListType) => {

    roleId.value = row.id

    treeHeight.value = window.innerHeight - 180
    // 父子节点 不 关联 ：去获取目标节点下的 所指定 节点
    checkStrictly.value = true

    // 获取权限列表数据
    getRuleListApi(1)
        .then((res) => {
            // @ts-ignore
            ruleList.value = res.list
            // @ts-ignore 获取一级节点的 id 默认展开一级节点。这与TreeV2 虚拟化树形控件绑定的node-key值有关
            defaultExpandedKeys.value = res.list.map(item => item.id)
            // @ts-ignore 打开配置权限组件框
            setAuthFormDrawerRef.value.open()
            // @ts-ignore 当前用户所拥有的权限 ids[]
            ruleIds.value = row.rules.map((item: RoleIdsListType) => item.id)

            setTimeout(() => {
                // @ts-ignore
                elTreeRef.value.setCheckedKeys(ruleIds.value)
                // 父子节点 互相 关联 ：下次选择节点时 会默认选中当前父节点下的所有子节点
                checkStrictly.value = false

            }, 150)
        })
        .catch(() => {
            toast("获取权限列表失败")
            return
        })
        .finally(() => { })
}

const handleTreeCheck = (...e: any) => {
    const { checkedKeys, halfCheckedKeys } = e[1]
    // @ts-ignore
    ruleIds.value = [...checkedKeys, ...halfCheckedKeys]

}

const handleSetAuthSubmit = () => {
    // @ts-ignore
    setAuthFormDrawerRef.value?.showLoading()

    configRoleAuthApi(roleId.value, ruleIds.value)
        .then(() => {
            toast("配置成功")
            //
            getTableData()

            // @ts-ignore
            setAuthFormDrawerRef.value?.close()
        })
        .finally(() => {
            location.reload()
            // @ts-ignore
            setAuthFormDrawerRef.value?.hideLoading()
        })
}
</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新数据 -->
        <ListHeader @create="handleOpenAdd" @refresh="getTableData" />
        <!-- 表格数据 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="desc" label="角色描述" width="420" />
            <el-table-column label="状态" width="240">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="handleChangeStatus($event, row)" :loading="row.statusLoading"
                        :disabled="row.super === 1" />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="260" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="openSetAuth(scope.row)">配置权限</el-button>
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">编辑</el-button>
                    <el-popconfirm title="确认删除该角色?" confirm-button-text="确认" cancel-button-text="取消"
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
        <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit(formRef)">
            <el-form :model="form" ref="formRef" :rules="formRules" label-width="80px" :inline="false">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input type="textarea" v-model="form.desc" placeholder="请输入角色描述"
                        :autosize="{ minRows: 6, maxRows: 12 }"></el-input>
                </el-form-item>
                <el-form-item label="角色状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
                </el-form-item>
            </el-form>
        </FormDrawer>

        <!-- @vue-ignore 配置权限 必须刷新页面才能-->
        <FormDrawer ref="setAuthFormDrawerRef" title="配置权限" @submit="handleSetAuthSubmit">
            <!-- Tree V2 虚拟化树形控件的自定义节点内容：可以在节点区添加按钮或图标等内容 -->
            <el-tree-v2 ref="elTreeRef" node-key="id" :check-strictly="checkStrictly"
                :default-expanded-keys="defaultExpandedKeys" :data="ruleList" :props="defaultProps" show-checkbox
                :height="treeHeight" @check="handleTreeCheck">
                <template #default="{ data }">
                    <div class="flex items-center">
                        <el-tag :type="data.menu ? '' : 'info'" size="small">
                            {{ data.menu ? "菜单" : "权限" }}
                        </el-tag>
                        <span class="ml-2 text-sm">
                            {{ data.name }}
                        </span>
                    </div>
                </template>
            </el-tree-v2>
        </FormDrawer>
    </el-card>

</template>

<style scoped></style>
