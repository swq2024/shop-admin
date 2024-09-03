<script setup lang="ts">
import ImageAside from '@/components/ImageAside.vue';
import ImageMain from '@/components/ImageMain.vue';
import { ref } from 'vue';

const windowHeight = window.innerHeight || document.body.clientHeight
const containerHeight = windowHeight - 64 - 44 - 40


const ImageAsideRef = ref(null)
// @ts-ignore
const handleOpenCreate = () => ImageAsideRef.value?.handleCreate()

const ImageMainRef = ref(null)
const handleAsideChange = (image_class_id: number) => {
    // console.log(image_class_id);
    // @ts-ignore
    ImageMainRef.value?.reloadImageListDataById(image_class_id)
}

// @ts-ignore 调用子组件实例 暴露的方法 打开上传图片组件
const handleShowUploadFileDrawer = () => ImageMainRef.value.showUploadFileDrawer()
</script>

<template>
    <el-container class="bg-white rounded" :style="{ height: `${containerHeight}px` }">

        <el-header class="img_header">
            <el-button type="primary" size="small" @click="handleOpenCreate">
                新增图片分类
            </el-button>
            <el-button type="warning" size="small" @click="handleShowUploadFileDrawer">
                上传图片
            </el-button>
        </el-header>

        <el-container>
            <!-- aside 抽离为公共组件ImageAside.vue -->
            <ImageAside  ref="ImageAsideRef" @change="handleAsideChange"/>
            <!-- main 抽离为公共组件ImageMain.vue-->
            <ImageMain ref="ImageMainRef"/>
        </el-container>
    </el-container>

</template>

<style scoped>
.img_header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
}
</style>
