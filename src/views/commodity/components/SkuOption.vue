<script setup lang="ts">
import { addSkuCardEvent, btnLoading, cardLoading, deleteSkuCardEvent, handleSelectAndSetCommoditySkuCardVal, sku_card_list, sortSkuCardEvent, updateSkuCardEvent } from '@/utils/useSku';
import SkuOptionItem from './SkuOptionItem.vue';
import SelectSku from './SelectSku.vue';
import { ref } from 'vue';

const selectSkuRef = ref(null)
const handleSelectSku = (item: any) => {
    // @ts-ignore
    selectSkuRef.value.openDialog((value) => {
        handleSelectAndSetCommoditySkuCardVal(item.id, {
            name: value.name,
            value: value.list
        })
    })
}
</script>

<template>
    <el-form-item label="规格选项" v-loading="cardLoading">
        <el-card shadow="never" class="w-full mb-3" v-for="(item, index) in sku_card_list" :key="index">
            <!-- card title -->
            <template #header>
                <div class="flex items-center">
                    <!-- @vue-ignore -->
                    <el-input v-model="item.text" placeholder="规格名称" style="width: 200px;"
                        @change="updateSkuCardEvent(item)" v-loading="item.loading">
                        <template #append>
                            <el-icon class="cursor-pointer hover:(text-gray-300)" @click="handleSelectSku(item)">
                                <More />
                            </el-icon>
                        </template>
                    </el-input>
                    <el-button size="small" class="ml-auto" @click="sortSkuCardEvent('up', index)"
                        :disabled="index === 0">
                        <el-icon>
                            <Top />
                        </el-icon>
                    </el-button>
                    <el-button size="small" @click="sortSkuCardEvent('down', index)"
                        :disabled="index === sku_card_list.length - 1">
                        <el-icon>
                            <Bottom />
                        </el-icon>
                    </el-button>
                    <el-popconfirm title="确认删除该选项?" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="deleteSkuCardEvent(item)">
                        <template #reference>
                            <el-button size="small">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-popconfirm>
                </div>
            </template>
            <!-- @vue-ignore card body -->
            <SkuOptionItem :sku-card-id="item.id" />
        </el-card>
        <el-button type="success" size="small" :loading="btnLoading" @click="addSkuCardEvent">
            添加规格选项
        </el-button>
    </el-form-item>
    <SelectSku ref="selectSkuRef" />

</template>

<style>
.el-card__header {
    @apply !p-2 bg-gray-50;
}
</style>
