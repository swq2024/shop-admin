<script setup lang="ts">

// 向父组件传递方法(及参数)
defineEmits(["create", 'refresh', 'delete', 'download'])
// const create = emit("create")
// const refresh = emit("refresh")

// 接收父组件传递的值
const props = defineProps({
    layout: {
        type: String,
        default: "create,refresh"
    }
})

</script>

<template>
    <div class="flex items-center justify-between mb-4">
        <div>
            <el-button v-if="props.layout.includes('create')" type="primary" size="small"
                @click="$emit('create')">新增</el-button>

            <el-popconfirm v-if="props.layout.includes('delete')" title="是否确认删除选中规格?" confirm-button-text="确认"
                cancel-button-text="取消" @confirm="$emit('delete')" width="auto">
                <template #reference>
                    <el-button type="danger" size="small">批量删除</el-button>
                </template>
            </el-popconfirm>

            <!-- 默认插槽 -->
            <slot></slot>
        </div>
        <div>
            <el-tooltip v-if="props.layout.includes('refresh')" effect="dark" content="刷新数据" placement="bottom">
                <el-button text @click="$emit('refresh')" class="mr-[-5px]">
                    <el-icon size="large">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip v-if="props.layout.includes('download')" effect="dark" content="导出数据" placement="bottom">
                <el-button text @click="$emit('download')">
                    <el-icon size="large">
                        <Download />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>

    </div>
</template>



<style scoped></style>
