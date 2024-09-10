<script setup lang="ts">
import { getStatistics1Api, getStatistics2Api } from '@/api/home';
import CardItem from '@/components/CardItem.vue';
import CountTo from '@/components/CountTo.vue';
import EchartsView from '@/components/EchartsView.vue';
import HomeNav from '@/components/HomeNav.vue';
import type { CardDataType, ShopDataType } from '@/types/home';
import { ref } from 'vue';

const panels = ref<CardDataType[]>([])

getStatistics1Api()
    .then((res) => {
        // @ts-ignore
        panels.value = res.panels
        // console.log(panels.value);
    })

const commodities = ref<ShopDataType[]>([])
const orders = ref<ShopDataType[]>([])

getStatistics2Api()
    .then(res => {
        // @ts-ignore
        commodities.value = res.goods
        // @ts-ignore
        orders.value = res.order
        // console.log(commodities, orders);

    })
</script>

<template>
    <div>
        <el-row :gutter="20" v-permission="['getStatistics1,GET']">
            <!-- 骨架屏 -->
            <template v-if="panels.length === 0">
                <el-col :span="6" v-for="i in 4" :key="i">
                    <el-skeleton style="width: 100%" animated loading>
                        <template #template>
                            <el-card shadow="hover" class="border-0">
                                <template #header>
                                    <div class="flex justify-between">
                                        <el-skeleton-item variant="image" style="width: 50%" />
                                        <el-skeleton-item variant="image" style="width: 15%" />
                                    </div>
                                </template>
                                <!-- card body -->
                                <span class="text-3xl font-bold text-gray-500">
                                    <el-skeleton-item variant="h3" style="width: 80%" />
                                </span>
                                <el-divider />
                                <div class="flex justify-between text-sm text-gray-500">
                                    <el-skeleton-item variant="image" style="width: 50%" />
                                    <el-skeleton-item variant="image" style="width: 10%" />
                                </div>
                            </el-card>

                        </template>
                    </el-skeleton>
                </el-col>
            </template>

            <!-- 订单内容 -->
            <template v-else>
                <el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">

                    <el-card shadow="hover" class="border-0">
                        <!-- card title -->
                        <template #header>
                            <div class="flex justify-between">
                                <span class="text-sm">{{ item.title }}</span>
                                <el-tag :type="item.unitColor" effect="plain">
                                    {{ item.unit }}
                                </el-tag>
                            </div>
                        </template>
                        <!-- card body -->
                        <span class="text-3xl font-bold text-gray-500">
                            <!-- {{ item.value }} -->
                            <CountTo :value="item.value" />
                        </span>
                        <el-divider />
                        <div class="flex justify-between text-sm text-gray-500">
                            <span>{{ item.subTitle }}</span>
                            <span>{{ item.subValue }}</span>
                        </div>
                    </el-card>
                </el-col>
            </template>

        </el-row>
        <HomeNav />
        <el-row :gutter="20" class="mt-5">
            <el-col :span="12" :offset="0">
                <EchartsView v-permission="['getStatistics3,GET']" />
            </el-col>
            <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
                <CardItem title="店铺管理" tip="店铺及商品提示" :data="commodities" class="mb-3" />
                <CardItem title="交易提示" tip="需要立即处理的订单" :data="orders" />
            </el-col>
        </el-row>

    </div>
</template>



<style scoped>
/* .el-card__header {
    --tw-bg-opacity: 0;
    background-color: rgba(249, 250, 251, var(--tw-bg-opacity));
} */
</style>
