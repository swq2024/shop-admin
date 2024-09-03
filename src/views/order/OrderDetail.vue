<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import dayjs from 'dayjs';
import { computed, ref } from 'vue';
import LogisticsInfo from './LogisticsInfo.vue';

const props = defineProps({
    info: Object
})

// 查看物流信息
const LogisticsInfoRef = ref(null)
const loading = ref(false)
const handleCheckLogisticsInfo = (id: number) => {
    loading.value = true
    // @ts-ignore
    LogisticsInfoRef.value?.openDrawer(id).finally(() => loading.value = false)
}

const drawerVisible = ref(false)
const openDrawer = () => drawerVisible.value = true
// const closeDrawer = () => drawerVisible.value = false

defineExpose({
    openDrawer
})
// 发货时间
const deliver_time = computed(() => {
    if (props.info?.ship_data) {
        const t = dayjs(props.info.ship_data.express_time * 1000).format('YYYY-MM-DD HH:mm:ss')
        return t
    }
    return ''
})
// 付款时间
const paid_time = computed(() => {
    if (props.info?.paid_time) {
        const t = useDateFormat(props.info.paid_time * 1000, 'YYYY-MM-DD HH:mm:ss')
        return t.value
    }
    return ''
})

// 退款状态
const refund_status = computed(() => {
    const opt = {
        pending: '未退款',
        applied: '已申请，等待审核中',
        processing: '退款中',
        success: '退款成功',
        failed: '退款失败'
    }
    // @ts-ignore
    return props.info.refund_status ? opt[props.info.refund_status] : ''
})
</script>

<template>
    <el-drawer title="订单详情" v-model="drawerVisible" size="50%">

        <el-card shadow="never" class="mb-3">
            <template #header>
                <b class="text-sm">订单详情</b>
            </template>
            <!-- card body -->
            <!-- {{ props.info }} -->
            <el-form label-width="80px">
                <el-form-item label="订单号">
                    {{ props.info!.no }}
                </el-form-item>
                <el-form-item label="付款方式">
                    {{ props.info?.payment_method ?? '未知' }}
                </el-form-item>
                <el-form-item label="付款时间">
                    {{ paid_time }}
                </el-form-item>
                <el-form-item label="创建时间">
                    {{ props.info!.create_time }}
                </el-form-item>
            </el-form>
        </el-card>

        <!-- @vue-ignore -->
        <el-card v-if="props.info.ship_data" shadow="never" class="mb-3">
            <template #header>
                <b class="text-sm">发货信息</b>
            </template>
            <!-- card body -->
            <!-- {{ props.info }} -->
            <el-form label-width="80px">
                <el-form-item label="物流公司">
                    {{ props.info!.ship_data.express_company }}
                </el-form-item>
                <el-form-item label="运单号">
                    {{ props.info!.ship_data.express_no }}
                    <el-button type="primary" text @click="handleCheckLogisticsInfo(props.info!.id)" class="ml-2" :loading="loading">
                        查看物流
                    </el-button>
                </el-form-item>
                <el-form-item label="发货时间">
                    {{ deliver_time }}
                </el-form-item>
            </el-form>
        </el-card>

        <el-card shadow="never" class="mb-3">
            <template #header>
                <b class="text-sm">商品信息</b>
            </template>
            <!-- card body -->
            <div class="flex mb-2" v-for="(item, index) in props.info!.order_items" :key="index">
                <el-image :src="item.goods_item?.cover ?? ''" fit="cover" :lazy="true"
                    style="width: 60px; height: 60px;" />
                <div class="ml-2 text-sm">
                    <p>{{ item.goods_item?.title ?? '商品已被删除' }}</p>
                    <p v-if="item.skuVal" class="mt-1">
                        <el-tag type="info" size="small">
                            {{ item.skuVal }}
                        </el-tag>
                    </p>
                    <p v-else>no sku</p>
                    <p class="mt-2">
                        <b class="text-rose-500 mr-2">￥{{ item.price }}</b>
                        <span class="text-xs text-gray-500">x {{ item.num }}</span>
                    </p>
                </div>
            </div>

            <div>
                <el-form label-width="80px">
                    <el-form-item label="成交价">
                        <span class="text-rose-500 font-bold">
                            ￥{{ props.info!.total_price }}
                        </span>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>

        <!-- @vue-ignore -->
        <el-card shadow="never" v-if="props.info.address" class="mb-3">
            <template #header>
                <b class="text-sm">收货信息</b>
            </template>
            <!-- card body -->
            <!-- {{ props.info }} -->
            <el-form label-width="80px">
                <el-form-item label="收货人">
                    {{ props.info!.address.name }}
                </el-form-item>
                <el-form-item label="联系方式">
                    {{ props.info!.address.phone }}
                </el-form-item>
                <el-form-item label="收货地址">
                    {{ props.info!.address.province + props.info!.address.city + props.info!.address.district +
                        props.info!.address.address }}
                </el-form-item>
            </el-form>
        </el-card>

        <!-- @vue-ignore -->
        <el-card shadow="never" v-if="props.info.refund_status !== 'pending'">
            <template #header>
                <b class="text-sm">退款信息</b>
                <el-button text disabled class="float-right">{{ refund_status }}</el-button>
            </template>
            <!-- card body -->
            <el-form label-width="80px">
                <el-form-item label="退款理由">
                    {{ props.info!.extra.refund_reason }}
                </el-form-item>

            </el-form>
        </el-card>

    </el-drawer>
    <LogisticsInfo ref="LogisticsInfoRef" />
</template>

<style scoped></style>
