<script setup lang="ts">
import { creatCouponApi, deleteCouponApi, expireCouponStatusApi, getCouponListApi, updateCouponApi } from '@/api/coupon';
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/ListHeader.vue';
import type { CouponListType, ResCouponListType } from '@/types/coupon';
import { useInitForm, useInitTable } from '@/utils/useCommon';
import { computed } from 'vue';

// 格式化优惠券状态文字
const formatStatus = (row: CouponListType) => {
    let state = '领取中'
    let start_time = (new Date(row.start_time)).getTime()
    let now = (new Date()).getTime()
    let end_time = (new Date(row.end_time)).getTime()
    if (now < start_time) {
        state = "未开始"
    } else if (now > end_time) {
        state = "已结束"
    } else if (row.status == 0) {
        state = "已失效"
    }
    return state
}
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
    getListApi: getCouponListApi,
    // onGetListSuccess 拦截 成功获取的表格数据 进行二次处理，默认直接为tableData，totalPages赋值
    onGetListSuccess: (res: ResCouponListType) => {
        // @ts-ignore
        tableData.value = res.list.map(item => {
            // @ts-ignore 转换优惠券状态显示文字
            item.statusText = formatStatus(item)
            return item
        })
        totalPages.value = res.totalCount
    },
    delete: deleteCouponApi,
    updateStatus: expireCouponStatusApi
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
        type: 0,
        value: 0,
        total: 100,
        min_price: 0,
        start_time: null,
        end_time: null,
        order: 50,
        desc: ""
    },
    rules: {
        name: [
            { type: "string", required: true, message: "优惠券名称不能为空", trigger: "blur" }
        ],
    },
    getTableData,
    update: updateCouponApi,
    create: creatCouponApi,
    beforeSubmit: (f: any) => {
        if (typeof f.start_time !== "number") {
            f.start_time = (new Date(f.start_time)).getTime()
        }
        if (typeof f.end_time !== "number") {
            f.end_time = (new Date(f.end_time)).getTime()
        }
        return f
    }
})

const timerange = computed({
    get() {
        return form.start_time && form.end_time ? [form.start_time, form.end_time] : []
    },
    set(val) {
        form.start_time = val[0]
        form.end_time = val[1]
    }
})
</script>

<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新数据 -->
        <ListHeader @create="handleOpenAdd" @refresh="getTableData" />
        <!-- 表格数据 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
            <el-table-column label="优惠券名称" width="350">
                <template #default="{ row }">
                    <div class="border border-dashed py-2 px-4 rounded"
                        :class="row.statusText === '领取中' ? 'active' : 'inactive'">
                        <h5 class="font-bold text-md">{{ row.name }}</h5>
                        <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="statusText" label="状态" />
            <el-table-column label="优惠">
                <template #default="{ row }">
                    {{ row.type === 0 ? "满减" : "折扣" }} {{ row.type === 0 ? (`￥${row.value}`) : (`${row.value}折`) }}
                </template>
            </el-table-column>
            <el-table-column prop="total" label="发放数量" />
            <el-table-column prop="used" label="已使用" />

            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button v-if="scope.row.statusText === '未开始'" type="primary" size="small" text
                        @click="handleEdit(scope.row)">编辑</el-button>
                    <el-popconfirm v-if="scope.row.statusText !== '领取中'" title="确认删除该优惠券?" confirm-button-text="确认"
                        cancel-button-text="取消" @confirm="handleDelete(scope.row.id)" width="165">
                        <template #reference>
                            <el-button type="primary" size="small" text>删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-popconfirm v-if="scope.row.statusText === '领取中'" title="确认使该优惠券失效?" confirm-button-text="确认"
                        cancel-button-text="取消" @confirm="handleChangeStatus(0, scope.row)" width="180">
                        <template #reference>
                            <el-button type="danger" size="small">失效</el-button>
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
        <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit(formRef)" :size="'40%'">
            <el-form :model="form" ref="formRef" :rules="formRules" label-width="auto" :inline="false">
                <el-form-item label="优惠券名称" prop="name" style="width: 75%;">
                    <el-input v-model="form.name" placeholder="请输入优惠券名称"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio :value="0" border>满减</el-radio>
                        <el-radio :value="1" border>折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="面值" prop="value">
                    <el-input v-model="form.value" style="width: 55%;">
                        <template #append>{{ form.type ? '折' : '元' }}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="发行量" prop="total">
                    <el-input-number v-model="form.total" :min="0" :max="10000" />
                </el-form-item>
                <el-form-item label="最低使用价格" prop="min_price">
                    <el-input v-model="form.min_price" type="number" placeholder="请输入最低使用价格" />
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000" />
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-date-picker v-model="timerange" type="datetimerange" range-separator="To" :editable="false"
                        start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input v-model="form.desc" type="textarea" :autosize="{ minRows: 6, maxRows: 12 }" />
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>

</template>

<style scoped>
.active {
    @apply border-rose-200 bg-rose-50 text-rose-400;
}

.inactive {
    @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>
