<script setup lang="ts">
import { getCommodityCommentListApi, replyCommodityCommentApi, updateCommodityCommentStatusApi } from '@/api/commodity_comment';
import SearchCom from '@/components/SearchCom.vue';
import SearchItem from '@/components/SearchItem.vue';
import { toast } from '@/utils/layer';
import { useInitTable } from '@/utils/useCommon';
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
    handleChangeStatus
} = useInitTable({
    getListApi: getCommodityCommentListApi,
    searchForm: {
        title: ""
    },
    onGetListSuccess: (res: any) => {
        // @ts-ignore
        tableData.value = res.list.map((item) => {
            // 为每一个item 的switch 添加statusLoading属性 ，初始值为false，切换状态时的加载动画
            // @ts-ignore
            item.statusLoading = false;
            // @ts-ignore
            item.textareaEdit = false
            return item;
        });
        // @ts-ignore
        totalPages.value = res.totalCount;
    },
    updateStatus: updateCommodityCommentStatusApi
})

const textareaVal = ref("")
const replyEvent = (row: any) => {
    textareaVal.value = ""
    row.textareaEdit = true
}
const handleModifiedComment = (row: any, data: string = "") => {
    textareaVal.value = data
    row.textareaEdit = true
}
const handleReplyComment = (row: any) => {
    if (textareaVal.value === "") return toast("评价内容不能为空", "error")
    replyCommodityCommentApi(row.id, textareaVal.value)
        .then(() => {
            row.textareaEdit = false
            toast("回复成功")
            getTableData()
        })
        .finally(() => {

        })
}
</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- @vue-ignore 搜索 -->
        <SearchCom :model="searchForm" @search="getTableData" @reset="resetSearchForm">
            <!-- SearchCom组件的默认插槽 -->
            <SearchItem label="关键词">
                <!-- SearchItem组件的默认插槽 -->
                <el-input v-model="searchForm.title" placeholder="请输入商品标题" clearable />
            </SearchItem>
        </SearchCom>

        <!-- 表格数据 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading" default-expand-all>
            <el-table-column type="expand">
                <template #default="{ row }">
                    <div class="flex pl-18">
                        <el-avatar :src="row.user.avatar" :size="50" fit="cover" class="mr-3"></el-avatar>
                        <div class="flex-1">
                            <h6 class="flex items-center">
                                {{ row.user.nickname || row.user.username }}
                                <small class="text-gray-400">{{ row.review_time }}</small>
                                <el-button type="info" size="small" @click="replyEvent(row)"
                                    v-if="!row.textareaEdit && !row.extra">回复</el-button>
                            </h6>
                            {{ row.review.data }}
                            <div class="py-2">
                                <el-image v-for="(item, index) in row.review.image" :key="index" :src="item" fit="cover"
                                    :lazy="true" style="width: 100px; height: 100px;" class="rounded"></el-image>
                            </div>

                            <div v-if="row.textareaEdit">
                                <el-input v-model="textareaVal" placeholder="请输入评价内容" type="textarea"
                                    :row="2"></el-input>
                                <div class="py-2">
                                    <el-button type="primary" size="small" class="mr-2"
                                        @click="handleReplyComment(row)">回复</el-button>
                                    <el-button size="small" @click="row.textareaEdit = false">取消</el-button>
                                </div>
                            </div>

                            <template v-else>
                                <div v-for="(item, index) in row.extra" :key="index"
                                    class="mt-3 bg-gray-100 p-3 rounded">
                                    <h6 class="flex font-bold">
                                        客服
                                        <el-button type="info" size="small" class="ml-auto"
                                            @click="handleModifiedComment(row, item.data)">修改</el-button>
                                    </h6>
                                    {{ item.data }}
                                </div>
                            </template>

                        </div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="ID" width="70" align="center" prop="id" />
            <el-table-column label="商品">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-image :src="row.goods_item?.cover ?? ''" fit="cover" :lazy="true"
                            style="width: 50px; height: 50px" class="rounded" />
                        <div class="ml-3">
                            <h6>{{ row.goods_item?.title ?? '商品已被删除' }}</h6>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="评价信息" width="200">
                <template #default="{ row }">
                    <div>
                        <p>用户：{{ row.user.username || row.user.nickname }}</p>
                        <p>
                            <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
                        </p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="评价时间" prop="review_time" align="center" />
            <el-table-column label="状态" prop="status" align="center">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="handleChangeStatus($event, row)" :loading="row.statusLoading"
                        :disabled="row.super === 1" />
                </template>
            </el-table-column>
        </el-table>

        <div class="flex justify-center items-center mt-5">
            <el-pagination background layout="prev, pager, next" :total="totalPages" v-model:currentPage="currentPage"
                v-model:page-size="pageSize" @current-change="getTableData" />
        </div>
    </el-card>

</template>

<style scoped></style>
