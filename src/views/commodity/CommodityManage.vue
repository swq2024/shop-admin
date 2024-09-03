<script setup lang="ts">
import { getCategoryListApi } from '@/api/category';
import { checkCommodityApi, createCommodityApi, deleteCommodityApi, destroyCommodityApi, getCommodityrListApi, restoreCommodityApi, updateCommodityApi, updateCommodityStatusApi } from '@/api/commodity';
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/ListHeader.vue';
import SearchCom from '@/components/SearchCom.vue';
import SearchItem from '@/components/SearchItem.vue';
import SelectImage from '@/components/SelectImage.vue';
import type { CategoryListType } from '@/types/category';
import type { ResManagerType } from '@/types/manager';
import { useInitForm, useInitTable } from '@/utils/useCommon';
import { ref } from 'vue';
import BannersCom from './BannersCom.vue';
import ContentCom from './ContentCom.vue';
import SkuCom from './SkuCom.vue';
import { toast } from '@/utils/layer';

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
    // 批量删除
    handleMultiDelete,
    // 多选实例
    multipleTableRef,
    // 获取批量选中的 ids
    handleSelectionChange,
    //
    handleMultiUpdateStatus,
    //
    useMultiAction,
} = useInitTable({
    getListApi: getCommodityrListApi,
    searchForm: {
        title: "",
        tab: "all",
        category_id: null,
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
    delete: deleteCommodityApi,
    updateStatus: updateCommodityStatusApi
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
        title: null,
        category_id: null,
        cover: null,
        desc: null,
        unit: "件",
        stock: 100,
        min_stock: 10,
        status: 1,
        stock_display: 1,
        min_price: 0,
        min_oprice: 0
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
    update: updateCommodityApi,
    create: createCommodityApi
})
// 订单类型：all全部，checking审核中，saling出售中，off已下架，min_stock库存预警，delete回收站
const tabBars = [
    {
        key: "all",
        name: "全部"
    },
    {
        key: "checking",
        name: "审核中"
    },
    {
        key: "saling",
        name: "出售中"
    },
    {
        key: "off",
        name: "已下架"
    },
    {
        key: "min_stock",
        name: "库存预警"
    },
    {
        key: "delete",
        name: "回收站"
    },
]
// 获取商品分类列表
const category_list = ref<CategoryListType[]>([])
// @ts-ignore
getCategoryListApi().then(res => category_list.value = res)

// 设置轮播图
const bannersRef = ref(null)
// @ts-ignore 把当前行信息传递回子组件
const handleSetCommodityBanners = (row: any) => bannersRef.value?.openBannersDrawer(row)

// 设置商品详情
const contentRef = ref(null)
// @ts-ignore 把当前行信息传递回子组件
const handleSetCommodityContent = (row: any) => contentRef.value?.openContentDrawer(row)

// 设置商品规格
const skuRef = ref(null)
// @ts-ignore 把当前行信息传递回子组件
const handleSetCommoditySku = (row: any) => skuRef.value?.openContentDrawer(row)
// 审核
const handleCheckCommodity = (id: number, isCheck: number) => {
    isLoading.value = true
    checkCommodityApi(id, isCheck)
        .then(() => {
            toast("操作成功")

            getTableData()
        })
        .finally(() => {
            isLoading.value = false
        })
}
// 恢复
const handleRestoreCommodity = () => useMultiAction(restoreCommodityApi, '恢复')
// 彻底删除
const handleDestoryCommodity = () => useMultiAction(destroyCommodityApi, '彻底删除')
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
                <SearchItem label="商品名称">
                    <!-- SearchItem组件的默认插槽 -->
                    <el-input v-model="searchForm.title" placeholder="请输入商品名称" clearable />
                </SearchItem>
                <!-- 高级搜索区域 -->
                <template #showAdvancedSearch>
                    <SearchItem label="商品分类">
                        <el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
                            <el-option v-for="item in category_list" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </SearchItem>
                </template>
            </SearchCom>

            <!-- 新增 | 刷新数据 -->
            <ListHeader layout="create, refresh" @create="handleOpenAdd" @refresh="getTableData">
                <el-button v-if="searchForm.tab !== 'delete'" @click="handleMultiDelete" size="small"
                    type="danger">批量删除</el-button>
                <el-button v-else @click="handleRestoreCommodity" size="small" type="warning">恢复商品</el-button>
                <el-popconfirm title="彻底删除后不可恢复，确认彻底删除该商品?" confirm-button-text="确认" cancel-button-text="取消"
                    @confirm="handleDestoryCommodity" width="190">
                    <template #reference>
                        <el-button v-if="searchForm.tab === 'delete'" size="small" type="danger">彻底删除</el-button>
                    </template>
                </el-popconfirm>

                <!-- 默认插槽 -->
                <el-button v-if="searchForm.tab === 'all' || searchForm.tab === 'off'" size="small"
                    @click="handleMultiUpdateStatus(1)">上架</el-button>
                <el-button v-if="searchForm.tab === 'all' || searchForm.tab === 'saling'" size="small"
                    @click="handleMultiUpdateStatus(0)">下架</el-button>
            </ListHeader>
            <!-- 表格数据 -->
            <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%" v-loading="isLoading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <div class="flex">
                            <el-image :src="row.cover" fit="cover" :lazy="true" style="width: 50px;height: 50px"
                                class="mr-3 rounded" />
                            <div class="flex-1">
                                <p>{{ row.title }}</p>
                                <div>
                                    <span class="text-rose-500">￥{{ row.min_price }}</span>
                                    <el-divider direction="vertical" />
                                    <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                                </div>
                                <p class="text-gray-400 text-xs mb-1">分类：{{ row.category?.name }}</p>
                                <p class="text-gray-400 text-xs">创建时间：{{ row.create_time }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="实际销量" width="100" prop="sale_count" align="center" />
                <el-table-column label="商品状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" size="small">{{ row.status ? '上架' : '仓库'
                            }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" width="120" align="center" v-if="searchForm.tab !== 'delete'">
                    <template #default="{ row }">
                        <div v-if="row.ischeck === 0" class="flex flex-col">
                            <el-button type="success" size="small" plain
                                @click="handleCheckCommodity(row.id, 1)">审核通过</el-button>
                            <el-button class="mt-2 !ml-0" type="danger" size="small" plain
                                @click="handleCheckCommodity(row.id, 2)">审核拒绝</el-button>
                        </div>
                        <span v-else>{{ row.ischeck === 1 ? '通过' : '拒绝' }}</span>
                    </template>

                </el-table-column>
                <el-table-column label="总库存" width="90" prop="stock" align="center" />
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <div v-if="searchForm.tab !== 'delete'">
                            <el-button class="px-0" type="primary" size="small" text
                                @click="handleEdit(scope.row)">编辑</el-button>

                            <el-button class="px-0" type="primary" size="small" text
                                @click="handleSetCommoditySku(scope.row)"
                                :loading="scope.row.skuLoading">商品规格</el-button>

                            <el-button class="px-0" :type="scope.row.goods_banner.length === 0 ? 'danger' : 'primary'"
                                size="small" text @click="handleSetCommodityBanners(scope.row)"
                                :loading="scope.row.bannerLoading">设置轮播图</el-button>

                            <el-button class="px-0" :type="scope.row.content ? 'primary' : 'danger'" size="small" text
                                @click="handleSetCommodityContent(scope.row)"
                                :loading="scope.row.contentLoading">商品详情</el-button>

                            <!-- @vue-ignore -->
                            <el-popconfirm title="确认删除该商品?" confirm-button-text="确认" cancel-button-text="取消"
                                @confirm="handleDelete([scope.row.id])">
                                <template #reference>
                                    <el-button class="px-0" type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <span v-else>暂无操作</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="flex justify-center items-center mt-5">
                <el-pagination background layout="prev, pager, next" :total="totalPages"
                    v-model:currentPage="currentPage" v-model:page-size="pageSize" @current-change="getTableData" />
            </div>
            <!-- @vue-ignore -->
            <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit(formRef)">
                <el-form :model="form" ref="formRef" :rules="formRules" label-width="auto">

                    <el-form-item label="商品名称" prop="title">
                        <el-input v-model="form.title" placeholder="请输入商品名称，不能超过60个字符" />
                    </el-form-item>

                    <el-form-item label="封面" prop="cover">
                        <SelectImage v-model="form.cover" />
                    </el-form-item>

                    <el-form-item label="商品分类" prop="category_id">
                        <el-select v-model="form.category_id" value-key="" placeholder="选择所属商品分类">
                            <el-option v-for="(item, index) in category_list" :key="index" :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="商品描述" prop="desc">
                        <el-input v-model="form.desc" placeholder="选填，商品卖点" type="textarea" />
                    </el-form-item>

                    <el-form-item label="单位" prop="unit">
                        <el-input v-model="form.unit" placeholder="单位" style="width: 50%;" />
                    </el-form-item>

                    <el-form-item label="总库存" prop="stock">
                        <el-input v-model="form.stock" type="number" style="width: 40%;">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="库存预警" prop="stock">
                        <el-input v-model="form.stock" style="width: 40%;">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="最低销售价" prop="min_price">
                        <el-input v-model="form.min_price" style="width: 40%;">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="最低原价" prop="min_oprice">
                        <el-input v-model="form.min_oprice" style="width: 40%;">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="库存显示" prop="stock_display">
                        <el-radio-group v-model="form.stock_display">
                            <el-radio :value="0" size="large">隐藏</el-radio>
                            <el-radio :value="1" size="large">显示</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="是否上架" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio :value="0" size="large">入库</el-radio>
                            <el-radio :value="1" size="large">上架</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </FormDrawer>
        </el-card>
        <!-- 轮播图组件 -->
        <BannersCom ref="bannersRef" @reload-data="getTableData" />
        <!-- 商品详情组件 -->
        <ContentCom ref="contentRef" @reload-data="getTableData" />
        <!-- 商品规格组件 -->
        <SkuCom ref="skuRef" @reload-data="getTableData"></SkuCom>
    </div>


</template>

<style scoped></style>
