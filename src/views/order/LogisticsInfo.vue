<script setup lang="ts">
import { getOrderLogisticsInfoApi } from '@/api/order';
import { toast } from '@/utils/layer';
import { ref } from 'vue';

const info = ref({})

const drawerVisible = ref(false)
const openDrawer = async (id: number) => {
    const res = await getOrderLogisticsInfoApi(id)
    // @ts-ignore
    if (res.status !== 0) return toast(res.msg, "error")
    // @ts-ignore
    info.value = res.result
    drawerVisible.value = true
}

defineExpose({
    openDrawer
})
</script>

<template>
    <el-drawer title="物流信息" v-model="drawerVisible" size="40%">
        <el-card shadow="never" class="border-0">
            <!-- card body -->
            <div class="flex items-center">
                <!-- @vue-ignore -->
                <el-image :src="info.logo" fit="cover" :lazy="true" style="width: 60px;height: 60px;"
                    class="rounded border" />

                <div class="ml-3">
                    <!-- @vue-skip -->
                    <p>物流公司：{{ info.typename }}</p>
                    <!-- @vue-skip -->
                    <p>物流单号：{{ info.number }}</p>
                </div>
            </div>
        </el-card>
        <el-divider />
        <el-card shadow="never" class="border-0 ml-0">
            <el-timeline class="ml-[-40px]">
                <!-- @vue-ignore -->
                <el-timeline-item v-for="(item, index) in info.list" :key="index" :timestamp="item.time"
                    placement="top">
                    {{ item.status }}
                </el-timeline-item>
            </el-timeline>
        </el-card>

    </el-drawer>

</template>

<style scoped></style>
