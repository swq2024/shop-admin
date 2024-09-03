<script setup lang="ts">
import { createRuleApi, deleteRuleApi, getRuleListApi, updateRuleApi, updateRuleStatusApi } from '@/api/rule';
import FormDrawer from '@/components/FormDrawer.vue';
import IconSelect from '@/components/IconSelect.vue';
import ListHeader from '@/components/ListHeader.vue';
import type { RuleListType } from '@/types/rule';
import { useInitForm, useInitTable } from '@/utils/useCommon';
import { ref } from 'vue';

const defaultProps1 = {
    label: "name",
    children: "child",
}
const defaultProps2 = {
    value: "id",
    label: "name",
    children: "child",
    // multiple: true, // 是否多选
    checkStrictly: true, // 是否严格的遵守父子节点不互相关联
    // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
    // 这里只需要返回 该节点的 ID
    emitPath: false
}
const defaultExpandedKeys = ref([])
const options = ref([])
const requestMethodList = ['GET', 'POST', 'PUT', 'DELETE']

const {
    isLoading,
    tableData,
    getTableData,
    handleDelete,
    handleChangeStatus
} = useInitTable({
    getListApi: getRuleListApi,
    // @ts-ignore
    onGetListSuccess: (res) => {
        options.value = res.rules

        tableData.value = res.list
        // 默认展开菜单 ID 列表
        defaultExpandedKeys.value = res.list.map((item: RuleListType) => item.id)
    },
    delete: deleteRuleApi,
    updateStatus: updateRuleStatusApi
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
        rule_id: 0,
        menu: 0,
        name: "",
        condition: "",
        method: "GET",
        status: 1,
        order: 50,
        icon: "",
        frontpath: ""
    },
    rules: {
        // title: [
        //     { type: "string", required: true, message: "公告标题不能为空", trigger: "blur" }
        // ],
        // content: [
        //     { type: "string", required: true, message: "公告内容不能为空", trigger: "blur" }
        // ]
    },
    getTableData,
    create: createRuleApi,
    update: updateRuleApi
})

const addSubmenu = (id: number) => {
    handleOpenAdd()
    form.rule_id = id
    form.status = 1
}
</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- card body -->
        <ListHeader @create="handleOpenAdd" @refresh="getTableData" />
        <el-tree :data="tableData" :props="defaultProps1" node-key="id" v-loading="isLoading"
            :default-expanded-keys="defaultExpandedKeys">
            <template #default="{ data }">
                <div class="custom_tree_node">
                    <el-tag size="small" :type="data.menu ? '' : 'info'" effect="dark">
                        {{ data.menu === 1 ? '菜单' : '权限' }}
                    </el-tag>
                    <el-icon v-if="data.icon" :size="16" class="ml-3">
                        <component :is="data.icon" />
                    </el-icon>
                    <span>
                        {{ data.name }}
                    </span>

                    <div class="ml-auto">
                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0"
                            @change="handleChangeStatus($event, data)" />
                        <el-button text type="primary" size="small" @click.stop="handleEdit(data)">编辑</el-button>
                        <el-button text type="primary" size="small" @click.stop="addSubmenu(data.id)">增加</el-button>
                        <el-popconfirm title="确认删除该权限菜单?" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDelete(data.id)" width="180px">
                            <template #reference>
                                <el-button text type="primary" size="small" @click.stop="() => { }">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </template>
        </el-tree>
        <!-- @vue-ignore -->
        <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit(formRef)">
            <el-form :model="form" ref="formRef" :rules="formRules" label-width="auto" :inline="false">
                <el-form-item label="上级菜单" prop="rule_id">
                    <el-cascader v-model="form.rule_id" :options="options" :props="defaultProps2" placeholder="请选择上级菜单"
                        clearable />
                </el-form-item>

                <el-form-item label="菜单/规则" prop="menu">
                    <el-radio-group v-model="form.menu">
                        <el-radio :value="1" size="large" border>菜单</el-radio>
                        <el-radio :value="0" size="large" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="名称" prop="name" style="width: 50%;">
                    <el-input v-model="form.name" placeholder="名称"></el-input>
                </el-form-item>

                <el-form-item label="菜单图标" prop="icon" v-if="form.menu === 1">
                    <IconSelect v-model:model-value="form.icon" />
                </el-form-item>

                <el-form-item label="前端路由" prop="frontpath" v-if="form.menu === 1 && form.rule_id > 0">
                    <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
                </el-form-item>

                <el-form-item label="后端规则" prop="condition" v-if="form.menu === 0">
                    <el-input v-model="form.condition" placeholder="后端规则"></el-input>
                </el-form-item>

                <el-form-item label="请求方式" prop="method" v-if="form.menu === 0">
                    <el-select v-model="form.method" placeholder="请选择请求方式" size="large">
                        <el-option v-for="(item, index) in requestMethodList" :key="index" :label="item"
                            :value="item" />
                    </el-select>
                </el-form-item>

                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000" />
                </el-form-item>

            </el-form>
        </FormDrawer>
    </el-card>


</template>

<style>
.custom_tree_node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
}

.el-tree-node__content {
    padding: 20px 0;
}
</style>
