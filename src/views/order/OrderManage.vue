<script setup lang="ts">
import ListHeader from '@/components/ListHeader.vue';
import SearchCom from '@/components/SearchCom.vue';
import SearchItem from '@/components/SearchItem.vue';
import type { ResManagerType } from '@/types/manager';
import { useInitTable } from '@/utils/useCommon';
import { deleteOrderApi, getOrderListApi, handleOrderRefundApi } from '@/api/order';
import { Delete } from '@element-plus/icons-vue';
import ExportData from './ExportData.vue';
import { ref } from 'vue';
import OrderDetail from './OrderDetail.vue';
import { showModal, showPrompt, toast } from '@/utils/layer';

const {
    isLoading,
    tableData,
    currentPage,
    totalPages,
    pageSize,
    searchForm,
    resetSearchForm,
    getTableData,
    // 批量删除
    handleMultiDelete,
    // 多选实例
    multipleTableRef,
    // 获取批量选中的 ids
    handleSelectionChange,
} = useInitTable({
    getListApi: getOrderListApi,
    searchForm: {
        no: "",
        tab: "all",
        starttime: "",
        endtime: "",
        name: "",
        phone: ""
        // limit: 10
    },
    onGetListSuccess: (res: ResManagerType) => {
        // @ts-ignore
        tableData.value = res.list.map((item) => {
            // 为每一个item 的switch 添加bannerLoading属性 ，初始值为false，切换状态时的加载动画
            // @ts-ignore
            item.bannerLoading = false;
            // @ts-ignore
            item.contentLoading = false;
            // @ts-ignore
            item.skuLoading = false
            return item;
        });
        // @ts-ignore
        totalPages.value = res.totalCount;
    },
    delete: deleteOrderApi,
})

// 订单类型：all全部，nopay待支付，noship待发货，shiped待收货，received已收货，finish已完成，closed已关闭，refunding退款中
const tabBars = [
    {
        key: "all",
        name: "全部"
    },
    {
        key: "nopay",
        name: "待支付"
    },
    {
        key: "noship",
        name: "待发货"
    },
    {
        key: "shiped",
        name: "待收货"
    },
    {
        key: "received",
        name: "已收货"
    },
    {
        key: "finish",
        name: "已完成"
    },
    {
        key: "closed",
        name: "已关闭"
    },
    {
        key: "refunding",
        name: "退款中"
    },
]

const ExportDataRef = ref(null)
// @ts-ignore
const handleExportData = () => ExportDataRef?.value.openDrawer()

const OrderDetailRef = ref(null)
const info = ref({})
const handleCheckCommodityDetail = (row: any) => {
    row.order_items = row.order_items.map((item: any) => {
        if (item.skus_type === 1 && item.goods_skus) {
            let val = []
            for (const key in item.goods_skus.skus) {
                val.push(item.goods_skus.skus[key].value)
            }
            item.skuVal = val.join(",")
        }
        return item
    })
    info.value = row
    // @ts-ignore
    OrderDetailRef.value?.openDrawer()
}
// 退款申请 1同意 / 0拒绝
const handleRefund = (id: number, agree: number) => {
    (agree ? showModal("是否要同意该订单退款?") : showPrompt("请输入拒绝的理由"))
        .then(({ value }) => {
            // console.log(value); // 拿到拒绝输入框的 值
            let data = { agree: agree }
            if (!data.agree) {
                // @ts-ignore
                data.disagree_reason = value
            }
            handleOrderRefundApi(id, data)
                .then(() => {
                    toast("操作成功")
                    getTableData()
                })
        })
}
</script>

<template>
    <div>
        <el-tabs v-model="searchForm.tab" @tab-change="getTableData">
            <el-tab-pane v-for="(item, index) in tabBars" :key="index" :label="item.name" :name="item.key" />
        </el-tabs>

        <el-card shadow="never" class="border-0">
            <!-- @vue-ignore 搜索区域-->
            <SearchCom :model="searchForm" @search="getTableData" @reset="resetSearchForm">
                <!-- SearchCom组件的默认插槽 -->
                <SearchItem label="订单编号">
                    <!-- SearchItem组件的默认插槽 -->
                    <el-input v-model="searchForm.no" placeholder="请输入订单编号" clearable />
                </SearchItem>
                <!-- 高级搜索区域 -->
                <template #showAdvancedSearch>
                    <SearchItem label="收货人">
                        <el-input v-model="searchForm.name" placeholder="请输入收货人姓名" clearable />
                    </SearchItem>
                    <SearchItem label="手机号">
                        <el-input v-model="searchForm.phone" placeholder="请输入收货人手机号" clearable />
                    </SearchItem>
                    <SearchItem label="开始时间">
                        <el-date-picker v-model="searchForm.starttime" type="date" placeholder="请输入开始日期" />
                    </SearchItem>
                    <SearchItem label="结束时间">
                        <el-date-picker v-model="searchForm.endtime" type="date" placeholder="请输入结束日期" />
                    </SearchItem>
                </template>
            </SearchCom>

            <!-- 新增 | 刷新数据 -->
            <ListHeader layout="refresh, download" @refresh="getTableData" @download="handleExportData">
                <el-button @click="handleMultiDelete" size="small" type="danger" :icon="Delete">批量删除</el-button>
            </ListHeader>
            <!-- 表格数据 -->
            <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%" v-loading="isLoading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <div class="flex text-sm mb-2">
                            <div class="flex-1">
                                <p>订单号：</p>
                                <small>{{ row.no }}</small>
                            </div>
                            <div>
                                <p>下单时间：</p>
                                <small>{{ row.create_time }}</small>
                            </div>
                        </div>
                        <div class="flex" v-for="(item, index) in row.order_items" :key="index">
                            <el-image :src="item.goods_item ? item.goods_item.cover : ''" fit="cover" :lazy="true"
                                style="width: 30px; height: 30px;" />
                            <p class="text-blue-500 ml-2">
                                {{ item.goods_item ? item.goods_item.title : '商品已被删除' }}
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="实际付款" width="100" prop="total_price" align="center" />
                <el-table-column label="买家" width="100" align="center">
                    <template #default="{ row }">
                        <p>{{ row.user.username || row.user.nickname }}</p>
                        <small>(用户ID：{{ row.user.id }})</small>
                    </template>
                </el-table-column>
                <el-table-column label="交易状态" width="170" align="center">
                    <template #default="{ row }">
                        <div>
                            <span>付款状态：</span>
                            <el-tag type="success" size="small" v-if="row.payment_method === 'wechat'">微信支付</el-tag>
                            <el-tag type="primary" size="small"
                                v-else-if="row.payment_method === 'alipay'">支付宝支付</el-tag>
                            <el-tag type="info" size="small" v-else>未支付</el-tag>
                        </div>
                        <div>
                            <span>发货状态：</span>
                            <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{ row.ship_data ? '已发货' :
                                '未发货' }}</el-tag>
                        </div>
                        <div>
                            <span>发货状态：</span>
                            <el-tag :type="row.ship_status === 'received' ? 'success' : 'info'" size="small">{{
                                row.ship_status === 'received' ? '已收货' :
                                    '未收货' }}</el-tag>
                        </div>
                    </template>

                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <div v-if="searchForm.tab !== 'delete'">
                            <el-button class="px-0" type="primary" text size="small"
                                @click="handleCheckCommodityDetail(row)">订单详情</el-button>
                            <el-button class="px-0" type="primary" size="small" text
                                v-if="searchForm.tab === 'noship'">订单发货</el-button>
                            <el-button class="px-0" type="primary" size="small" text
                                v-if="searchForm.tab === 'refunding'" @click="handleRefund(row.id, 1)">同意退款</el-button>
                            <el-button class="px-0" type="primary" size="small" text
                                v-if="searchForm.tab === 'refunding'" @click="handleRefund(row.id, 0)">拒绝退款</el-button>
                        </div>

                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="flex justify-center items-center mt-5">
                <el-pagination background layout="prev, pager, next" :total="totalPages"
                    v-model:currentPage="currentPage" v-model:page-size="pageSize" @current-change="getTableData" />
            </div>

        </el-card>
        <!-- 导出数据 -->
        <ExportData ref="ExportDataRef" :tabs="tabBars" />
        <!-- 商品详情 -->
        <OrderDetail ref="OrderDetailRef" :info="info" />
    </div>


</template>

<style scoped></style>
