<script setup lang="ts">

const props = defineProps({
    title: String,
    tip: String,
    data: Array
})
</script>

<template>
    <el-card shadow="never">
        <template #header>
            <div class="flex justify-between">
                <span class="text-sm">{{ title }}</span>
                <el-tag type="danger" effect="plain">
                    {{ tip }}
                </el-tag>
            </div>
        </template>
        <!-- card body -->
        <el-row :gutter="20">
            <el-col :span="6" :offset="0" v-for="(item, index) in props.data" :key="index">
                <el-card shadow="hover" class="border-0 bg-light-400">
                    <!-- card body -->
                    <div class="flex flex-col items-center justify-center">
                        <!-- @vue-skip -->
                        <span class="text-xl mb-2">{{ item?.value ?? "0" }}</span>
                        <!-- @vue-skip -->
                        <span class="text-xl text-gray-400">{{ item?.label ?? "未知" }}</span>
                    </div>
                </el-card>

            </el-col>
        </el-row>

    </el-card>

</template>

<style scoped></style>
