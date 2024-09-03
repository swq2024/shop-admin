<script setup lang="ts">
import { deleteImageApi, getImageListApi, renameImageApi } from '@/api/image';
import type { ImageListType } from '@/types/image';
import { showPrompt, toast } from '@/utils/layer';
import { computed, ref } from 'vue';
import UploadFile from './UploadFile.vue';
import { Picture } from '@element-plus/icons-vue';

const isLoading = ref(false)
// 当前页码，默认第一页
const currentPage = ref(1)
// 总共页数
const totalPages = ref(0)
// 每页显示10条数据
const pageSize = ref(10)
// 指定分类对应ID
const image_class_id = ref(0)
// 存放指定分类下的图片列表
const imageList = ref<ImageListType[]>([])
// 上传图片框
const isDrawerVisible = ref(false)
const showUploadFileDrawer = () => isDrawerVisible.value = true

// 获取 指定分类下的图片列表
const getImageList = (p = null) => {
    if (typeof p === "number") {
        currentPage.value = p
    }
    isLoading.value = true
    // 默认获取第一页数据
    getImageListApi(image_class_id.value, currentPage.value)
        .then(res => {
            // console.log(res);
            // @ts-ignore
            totalPages.value = res.totalCount
            // @ts-ignore
            imageList.value = res.list.map(item => {
                // 为每一个对象添加复选框属性
                item.checked = false
                return item
            })
            // console.log(imageList.value);
        })
        .finally(() => {
            isLoading.value = false
        })
}

// 根据指定分类ID 重新加载 imageList图片列表
const reloadImageListDataById = (id: number) => {
    currentPage.value = 1
    image_class_id.value = id
    getImageList()
}
defineExpose({
    reloadImageListDataById,
    showUploadFileDrawer
})
// 重命名
const handleRenameEvent = (item: ImageListType) => {
    showPrompt("重命名", item.name)
        .then(({ value }) => { // 解构出修改之后的值

            isLoading.value = true
            //
            renameImageApi(item.id, value)
                .then(() => {
                    toast("修改成功")

                    getImageList()
                })
        })
        .finally(() => {
            isLoading.value = false
        })
}
// 删除
const handleDeleteEvent = (id: number) => {
    isLoading.value = true
    deleteImageApi([id])
        .then(() => {
            toast("删除成功")

            getImageList()
        })
        .finally(() => {
            isLoading.value = false
        })
}
// 上传成功后 刷新数据
// @ts-ignore
const handleUploadImgSuccess = () => getImageList(1)


const props = defineProps({
    openSelect: {
        type: Boolean,
        default: false
    },
    limit: {
        type: Number,
        default: 1
    }
})

// @ts-ignore 选中的图片
const checkedImage = computed(() => imageList.value.filter(item => item.checked))
const emit = defineEmits(["select"])
const handleSelectChange = (item: any) => {
    if (item.checked && checkedImage.value.length > props.limit) {
        item.checked = false
        return toast(`最多只能选中${props.limit}张图片`, "error")
    }
    // console.log(checkedImage.value);

    emit("select", checkedImage.value)
}

</script>

<template>
    <el-main class="img_main" v-loading="isLoading">
        <div class="top p-3">
            <el-row :gutter="10">
                <el-col :span="6" :offset="0" v-for="(item, index) in imageList" :key="index">
                    <!-- @vue-ignore -->
                    <el-card shadow="hover" class="relative mb-3" :body-style="{ 'padding': 0 }"
                        :class="{ 'bg-blue-100': item.checked }">
                        <!-- card body -->
                        <el-image :src="item.url" fit="cover" :lazy="true" class="w-full h-[150px]"
                            :preview-src-list="[item.url]" :init-index="4">
                            <!-- 图片加载失败内容 -->
                            <template #error>
                                <div class="image-slot w-full h-38 bg-gray-100">
                                    <Picture></Picture>
                                </div>
                            </template>
                        </el-image>
                        <div class="image-title">
                            {{ item.name }}
                        </div>
                        <div class="flex items-center justify-center p-2">

                            <!-- 选择图片复选框 -->
                            <!-- @vue-skip -->
                            <el-checkbox v-if="openSelect" v-model="item.checked" @change="handleSelectChange(item)" />

                            <el-button type="primary" size="small" text @click="handleRenameEvent(item)">重命名</el-button>
                            <el-popconfirm title="确认删除该分类?" confirm-button-text="确认" cancel-button-text="取消"
                                @confirm="handleDeleteEvent(item.id)">
                                <template #reference>
                                    <el-button text type="primary" size="small">
                                        删除
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-card>

                </el-col>
            </el-row>

        </div>
        <div class="bottom">
            <el-pagination background layout="prev, pager, next" :total="totalPages" v-model:currentPage="currentPage"
                :v-model:page-size="pageSize" @current-change="getImageList" />
        </div>
    </el-main>

    <el-drawer title="上传图片" v-model="isDrawerVisible">
        <UploadFile :data="{ image_class_id }" @success="handleUploadImgSuccess" />
    </el-drawer>
</template>



<style scoped>
.img_main {
    position: relative;
}

.img_main .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto
}

.img_main .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    @apply flex justify-center items-center;
}

.image-title {
    position: absolute;
    top: 122px;
    left: -1px;
    right: -1px;
    @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>
