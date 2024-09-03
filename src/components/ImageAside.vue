<script setup lang="ts">
import { createImageCategoryApi, deleteImageCategoryApi, getImageCategoryApi, updateImageCategoryApi } from '@/api/image_category';
import AsideList from './AsideList.vue';
import { computed, ref } from 'vue';
import type { ImageCategoryListType } from '@/types/image';
import FormDrawer from './FormDrawer.vue';
import { type FormInstance, type FormRules } from 'element-plus';
import { toast } from '@/utils/layer';

const isLoading = ref(false)
// 图片类别列表
const imageCategoryList = ref<ImageCategoryListType[]>([])
// 当前激活的图片类别
const activeId = ref(0)
// 分页
const currentPage = ref(1)
const totalPages = ref(0)
const pageSize = ref(10)
// 新增表单的组件实例
const FormDrawerRef = ref(null)
// 编辑表单当前项 ID
const editId = ref(0)
// 抽屉组件标题
const drawerTitle = computed(() => editId.value ? '编辑' : '新增')
// 新建图片分类表单实例
const formRef = ref<FormInstance>()

// 新建图片分类表单绑定数据
const form = ref({
    name: "",
    order: 50
})
// 验证规则
const rules = ref<FormRules<typeof form>>({
    name: [
        { type: "string", required: true, message: "图片分类名称不能为空", trigger: "blur" }
    ],
    // order: [{}]
})
// 提交新增/编辑请求
const handleSubmit = (FormEl: FormInstance | undefined) => {
    if (!FormEl) return
    FormEl.validate((vaild) => {
        if (!vaild) return
        // console.log('提交成功');
        // @ts-ignore
        FormDrawerRef.value?.showLoading()
        const name = form.value.name
        const order = form.value.order
        const fun = editId.value ? updateImageCategoryApi(editId.value, { name, order }) : createImageCategoryApi({ name, order })
        //
        fun
            .then(() => {
                // console.log(res)
                //
                toast(`${drawerTitle.value}成功`)
                // @ts-ignore 重新获取页面数据后 显示第几页
                getImageCategory(editId.value ? currentPage.value : 1)
                // @ts-ignore
                FormDrawerRef.value?.close()
            })
            .finally(() => {
                // @ts-ignore
                FormDrawerRef.value?.hideLoading()
            })
    })
}
// 打开新增表单
const handleCreate = () => {
    editId.value = 0
    // 新增时 表单数据初始化
    form.value.name = ""
    form.value.order = 50
    // @ts-ignore
    FormDrawerRef.value?.open()
}

// 打开编辑表单
const handleOpenEdit = (row: ImageCategoryListType) => {
    // console.log(row);
    // 传入api接口的 id参数赋值
    editId.value = row.id
    // 表单数据回显
    form.value.name = row.name
    form.value.order = row.order
    // @ts-ignore
    FormDrawerRef.value?.open()

}

const handleDeleteEvent = (id: number) => {
    // console.log('删除', id);
    isLoading.value = true
    deleteImageCategoryApi(id)
        .then(() => {
            toast("删除成功")
            // 获取当前页数据
            getImageCategory()
        })
        .finally(() => {
            isLoading.value = false
        })
}
//
const emit = defineEmits(["change"])
// 选中图库分类ID activeId [点击] 切换分类

const handleChangeActiveId = (id: number) => {
    activeId.value = id
    emit("change", id)
}
// 获取 图片类别数据
const getImageCategory = (p = null) => {
    if (typeof p === "number") {
        currentPage.value = p
    }
    isLoading.value = true
    // 默认获取第一页数据
    getImageCategoryApi(currentPage.value)
        .then(res => {
            // console.log(res);
            // @ts-ignore
            totalPages.value = res.totalCount
            // @ts-ignore
            imageCategoryList.value = res.list
            // console.log(imageList);
            const firstItem = imageCategoryList.value[0]
            if (firstItem) {
                // 默认激活第一个
                handleChangeActiveId(firstItem.id)
            }
        })
        .finally(() => {
            isLoading.value = false
        })
}
//
getImageCategory()

defineExpose({
    handleCreate
})
</script>

<template>
    <el-aside width="220px" class="img_aside" v-loading="isLoading">
        <div class="top">
            <AsideList v-for="(item, index) in imageCategoryList" :key="index" :active="activeId === item.id"
                @click="handleChangeActiveId(item.id)" @edit="handleOpenEdit(item)"
                @delete="handleDeleteEvent(item.id)">
                {{ item.name }}
            </AsideList>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev, next" :total="totalPages" v-model:currentPage="currentPage"
                v-model:page-size="pageSize" @current-change="getImageCategory" />
        </div>
    </el-aside>

    <FormDrawer :title="drawerTitle" ref="FormDrawerRef" @submit="handleSubmit(formRef)">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="0" :max="10000" />
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>

<style scoped>
.img_aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}

.img_aside .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto
}

.img_aside .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    @apply flex justify-center items-center;
}
</style>
