<script setup lang="ts">
import { getSkuListApi } from '@/api/sku';
import { useInitTable } from '@/utils/useCommon';
import { reactive, ref } from 'vue';

const dialogVisible = ref(false)
const activeId = ref(0)
const form = reactive({
    name: "",
    list: []
})
const sku_list_val = ref([])

const {
    isLoading,
    currentPage,
    pageSize,
    totalPages,
    tableData,
    getTableData
} = useInitTable({
    getListApi: getSkuListApi,
    onGetListSuccess: (res) => {
        tableData.value = res.list
        totalPages.value = res.totalCount
        if (tableData.value.length > 0) {
            handleChangeActiveId(tableData.value[0].id)
        }
    }
})
const callbackFunction = ref(null)
const openDialog = (callback = null) => {
    callbackFunction.value = callback
    getTableData(1)
    dialogVisible.value = true
}
const closeDialog = () => dialogVisible.value = false
defineExpose({
    openDialog
})

const handleChangeActiveId = (id: number) => {
    activeId.value = id
    sku_list_val.value = []
    const item = tableData.value.find(o => o.id === id)
    if (item) {
        sku_list_val.value = item.default.split(",")
        form.name = item.name
    }
}
const submit = () => {
    if(typeof callbackFunction.value === "function") {
        callbackFunction.value(form)
    }
    closeDialog()
}
</script>

<template>
    <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="5vh">

        <el-container style="height: 65vh;">
            <el-aside width="220px" class="sku_aside">
                <div class="top">
                    <div class="sku_list" :class="{ 'active': (activeId === item.id) }"
                        v-for="(item, index) in tableData" :key="index" @click="handleChangeActiveId(item.id)">
                        {{ item.name }}
                    </div>
                </div>
                <div class="bottom">
                    <el-pagination background layout="prev, next" :total="totalPages" v-model:currentPage="currentPage"
                        v-model:page-size="pageSize" @current-change="getTableData" />
                </div>
            </el-aside>
            <el-container>
                <el-main>
                    <el-checkbox-group v-model="form.list">
                        <el-checkbox v-for="(item, index) in sku_list_val" :key="index" :label="item" border>
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>

                </el-main>
            </el-container>
        </el-container>


        <template #footer>
            <span>
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="submit">确认</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<style scoped>
.sku_aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}

.sku_aside .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto
}

.sku_aside .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    @apply flex justify-center items-center;
}

.sku_list {
    border-bottom: 1px solid #f4f4f4;
    @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
}

.sku_list:hover,
.active {
    @apply bg-blue-50;
}
</style>
