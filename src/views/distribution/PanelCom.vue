<script setup lang="ts">
import { getDistributionStatisticsDataApi } from '@/api/distribution';
import { ref } from 'vue';

const panel_list = ref([])
const loading = ref(false)
const getData = () => {
    loading.value = true
    getDistributionStatisticsDataApi()
    .then((res) => {
        // @ts-ignore
        panel_list.value = res.panels
        // console.log(panel_list.value);
    })
    .finally(() => {
        loading.value = false
    })
}
getData()
</script>

<template>
    <el-row :gutter="20" class="mb-5">
        <!-- 骨架屏 -->
        <template v-if="panel_list.length === 0">
            <el-col :span="6" v-for="i in 4" :key="i">
                <el-skeleton style="width: 100%">
                    <template #template>
                        <el-card shadow="hover" class="border-0">
                            <template #header>
                                <div class="flex justify-between">
                                    <el-skeleton-item variant="image" style="width: 50%" />
                                    <!-- <el-skeleton-item variant="image" style="width: 15%" /> -->
                                </div>
                            </template>
                            <!-- card body -->
                            <span class="text-3xl font-bold text-gray-500">
                                <el-skeleton-item variant="h3" style="width: 80%" />
                            </span>
                        </el-card>
                    </template>
                </el-skeleton>
            </el-col>
        </template>

        <el-col :span="6" :offset="0" v-for="(item, index) in panel_list" :key="index">
            <el-card shadow="never">
                <div class="flex items-center">
                    <!-- @vue-ignore -->
                    <el-icon :class="item.color" class="text-white w-[40px] h-[40px] rounded-full" :size="20">
                        <User v-if="index === 0" />
                        <ShoppingCart v-if="index === 1" />
                        <PriceTag v-if="index === 2" />
                        <Timer v-if="index === 3" />
                    </el-icon>
                    <div class="ml-3">
                        <h2 class="text-lg font-bold">
                            <!-- @vue-ignore -->
                            {{ item.value }}
                        </h2>
                        <small class="text-xs text-gray-400">
                            <!-- @vue-ignore -->
                            {{ item.label }}
                        </small>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<style scoped></style>
