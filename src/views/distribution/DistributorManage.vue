<script setup lang="ts">
import { getDistributorListApi } from '@/api/distribution';
import PanelCom from './PanelCom.vue';
import SearchCom from '@/components/SearchCom.vue';
import SearchItem from '@/components/SearchItem.vue';
import { useInitTable } from '@/utils/useCommon';
import DataDrawer from './DataDrawer.vue';
import { ref } from 'vue';

const {
    isLoading,
    tableData,
    currentPage,
    totalPages,
    pageSize,
    searchForm,
    resetSearchForm,
    getTableData,
} = useInitTable({
    searchForm: {
        keyword: "",
        type: "all",
        starttime: null,
        endtime: null
    },
    getListApi: getDistributorListApi,
})

const DataDrawerRef = ref(null)
const orderDataDrawerRef = ref(null)
// @ts-ignore
const openDataDrawer = (id: number, type: string) => (type === "user" ? DataDrawerRef : orderDataDrawerRef).value?.openDrawer()

</script>
<template>
    <div>
        <PanelCom />
        <el-card shadow="never" class="border-0">
            <!-- @vue-ignore 搜索 -->
            <SearchCom :model="searchForm" @search="getTableData" @reset="resetSearchForm">
                <!-- SearchCom组件的默认插槽 -->
                <SearchItem label="时间选择">
                    <!-- SearchItem组件的默认插槽 -->
                    <el-radio-group v-model="searchForm.type" size="small">
                        <el-radio-button label="all">全部</el-radio-button>
                        <el-radio-button label="today">今天</el-radio-button>
                        <el-radio-button label="yesterday">昨天</el-radio-button>
                        <el-radio-button label="last7days">最近7天</el-radio-button>
                    </el-radio-group>
                </SearchItem>
                <!--  -->
                <template #showAdvancedSearch>
                    <SearchItem label="开始时间">
                        <el-date-picker v-model="searchForm.starttime" type="date" placeholder="请输入开始日期" />
                    </SearchItem>
                    <SearchItem label="结束时间">
                        <el-date-picker v-model="searchForm.endtime" type="date" placeholder="请输入结束日期" />
                    </SearchItem>
                    <SearchItem label="关键词">
                        <!-- SearchItem组件的默认插槽 -->
                        <el-input v-model="searchForm.keyword" placeholder="关键词" clearable />
                    </SearchItem>
                </template>
            </SearchCom>

            <!-- 表格数据 -->
            <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
                <el-table-column label="ID" prop="id" width="65" align="center" />
                <el-table-column label="头像" width="65">
                    <template #default="{ row }">
                        <el-avatar :size="40" :src="row.avatar">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>
                    </template>
                </el-table-column>
                <el-table-column label="用户信息" width="140">
                    <template #default="{ row }">
                        <div class="text-xs">
                            <p>用户：{{ row.username }}</p>
                            <p>昵称：{{ row.nickname }}</p>
                            <p>姓名：{{ row.user_info.name }}</p>
                            <p>电话：{{ row.phone }}</p>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="推广用户数量" prop="share_num" align="center" />
                <el-table-column label="订单数量" prop="share_order_num" align="center" />
                <el-table-column label="订单金额" prop="order_price" align="center" />
                <el-table-column label="账户佣金" prop="commission" align="center" />
                <el-table-column label="已提现金额" prop="cash_out_price" align="center" />
                <el-table-column label="提现次数" prop="cash_out_time" align="center" />
                <el-table-column label="未提现金额" prop="no_cash_out_price" align="center" />
                <el-table-column label="操作" fixed="right" width="180" align="center">

                    <template #default="{ row }">
                        <el-button type="primary" size="small" text @click="openDataDrawer(row.id, 'user')">推广人</el-button>
                        <el-button type="primary" size="small" text @click="openDataDrawer(row.id, 'order')">推广订单</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="flex justify-center items-center mt-5">
                <el-pagination background layout="prev, pager, next" :total="totalPages"
                    v-model:currentPage="currentPage" v-model:page-size="pageSize" @current-change="getTableData" />
            </div>
        </el-card>

        <DataDrawer ref="DataDrawerRef" />
        <DataDrawer ref="orderDataDrawerRef" type="order" />
    </div>
</template>
<style scoped></style>
