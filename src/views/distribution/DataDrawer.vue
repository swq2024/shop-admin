<script setup lang="ts">
import { getDistributorListApi, getSpreadOrderListApi } from '@/api/distribution';
import { useInitTable } from '@/utils/useCommon';
import { computed, ref } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: "user"
    }
})
const drawerTitle = computed(() => props.type === 'user' ? '推广人列表' : '推广订单列表')
const {
    isLoading,
    tableData,
    currentPage,
    totalPages,
    pageSize,
    searchForm,
    getTableData,
} = useInitTable({
    searchForm: {
        type: "all",
        starttime: null,
        endtime: null,
        level: 0,
        user_id: 0
    },
    getListApi: (() => {
        return props.type === 'user' ? getDistributorListApi : getSpreadOrderListApi
    })(),
})
const resetSearchForm = () => {
    searchForm.type = "all"
    searchForm.starttime = null
    searchForm.endtime = null
    searchForm.level = 0
}
const drawerVisible = ref(false)
const openDrawer = (id: number) => {
    // console.log(id);
    drawerVisible.value = true
    searchForm.user_id = id
    getTableData()
}
defineExpose({
    openDrawer
})

</script>

<template>
    <el-drawer :title="drawerTitle" v-model="drawerVisible" size="60%">

        <el-form :model="searchForm" label-width="auto" size="small">
            <el-form-item label="时间选择">
                <el-radio-group v-model="searchForm.type" size="small">
                    <el-radio-button label="all">全部</el-radio-button>
                    <el-radio-button label="today">今天</el-radio-button>
                    <el-radio-button label="yesterday">昨天</el-radio-button>
                    <el-radio-button label="last7days">最近7天</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker v-model="searchForm.starttime" type="date" placeholder="请输入开始日期" />
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="searchForm.endtime" type="date" placeholder="请输入结束日期" />
            </el-form-item>
            <el-form-item label="用户类型">
                <el-radio-group v-model="searchForm.level" size="small">
                    <el-radio-button :label="0">全部</el-radio-button>
                    <el-radio-button :label="1">一级推广</el-radio-button>
                    <el-radio-button :label="2">二级推广</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label=" ">
                <el-button type="primary" @click="getTableData">搜索</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格数据 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
            <template v-if="props.type === 'user'">
                <el-table-column label="UID" prop="id" width="105" align="center" />
                <el-table-column label="头像" width="140" align="center">
                    <template #default="{ row }">
                        <el-avatar :size="40" :src="row.avatar">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>
                    </template>
                </el-table-column>
                <el-table-column label="用户名称" width="100" align="center">
                    <template #default="{ row }">
                        <p class="text-xs">{{ row.username }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="推广数" prop="share_num" align="center" />
                <el-table-column label="推广订单数" prop="share_order_num" align="center" />
                <el-table-column label="绑定时间" prop="create_time" align="center" />
            </template>
            <template v-else>
                <el-table-column label="订单号">
                    <template #default="{ row }">
                        {{ row.order.no }}
                    </template>
                </el-table-column>
                <el-table-column label="用户名|昵称|手机号" align="center">
                    <template #default="{ row }">
                        <div v-if="!row.order.user">
                            该用户已被删除
                        </div>
                        <div v-else>
                            {{ row.order.user.username }} | {{ row.order.user.nickname }} | {{ row.order.user.phone }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="时间" prop="create_time" align="center" />
                <el-table-column label="返佣金额" prop="commission" align="center" />
            </template>
        </el-table>

        <div class="flex justify-center items-center mt-5">
            <el-pagination background layout="prev, pager, next" :total="totalPages" v-model:currentPage="currentPage"
                v-model:page-size="pageSize" @current-change="getTableData" />
        </div>
    </el-drawer>

</template>

<style scoped></style>
