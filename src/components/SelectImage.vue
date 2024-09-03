<script setup lang="ts">
import { ref } from 'vue';
import ImageAside from '@/components/ImageAside.vue';
import ImageMain from '@/components/ImageMain.vue';
import { toast } from '@/utils/layer';

const dialogVisible = ref(false)
const callbackFunction = ref(null)
const openDialog = (callback = null) => {
    callbackFunction.value = callback
    dialogVisible.value = true
}
const closeDialog = () => dialogVisible.value = false

defineExpose({
    openDialog,
    closeDialog
})

const ImageAsideRef = ref(null)
// @ts-ignore
// const handleOpenCreate = () => ImageAsideRef.value?.handleCreate()

const ImageMainRef = ref(null)
const handleAsideChange = (image_class_id: number) => {
    // console.log(image_class_id);
    // @ts-ignore
    ImageMainRef.value?.reloadImageListDataById(image_class_id)
}

// @ts-ignore 调用子组件实例 暴露的方法 打开上传图片组件
// const handleShowUploadFileDrawer = () => ImageMainRef.value.showUploadFileDrawer()

const props = defineProps({
    modelValue: [String, Array],
    limit: {
        type: Number,
        default: 1
    },
    preview: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(["update:modelValue"])

const avatarUrl = ref([])
// @ts-ignore
const handleSelect = (checkedImage) => {
    // @ts-ignore
    avatarUrl.value = checkedImage.map(item => item.url)
}

const handleImageSubmit = () => {
    let value = []
    if (props.limit === 1) {
        value = avatarUrl.value[0]
    } else {
        value = props.preview ? [...props.modelValue, ...avatarUrl.value] : [...avatarUrl.value]
        if (value.length > props.limit) {
            let limit = props.preview ? props.limit - props.modelValue?.length : props.limit
            return toast(`最多还能选择${limit}张`, "warning")
        }
    }
    if (value && props.preview) {
        emit("update:modelValue", value)
    }
    if (!props.preview && typeof callbackFunction.value === "function") {
        callbackFunction.value(value)
    }
    closeDialog()
}
// @ts-ignore
const removeCurrentImage = (url: string) => emit("update:modelValue", props.modelValue.filter((item: string) => item !== url))

</script>

<template>

    <div v-if="modelValue">
        <el-image v-if="typeof modelValue === 'string'" :src="modelValue" fit="cover"
            class="w-[100px] h-[100px] rounded border mr-2" />
        <div v-else class="flex flex-wrap">
            <div v-for="(url, index) in modelValue" :key="index" class="relative mx-1 mb-2 w-[100px] h-[100px]">
                <el-icon class="absolute top-[5px] right-[5px] rounded-full cursor-pointer hover:(text-light-400)"
                    style="z-index: 10;" :size="18" @click="removeCurrentImage(url as string)">
                    <CircleClose />
                </el-icon>
                <el-image :src="url" fit="cover" class="w-[100px] h-[100px] rounded border mr-2" />
            </div>
        </div>
    </div>

    <div v-if="props.preview" class="select_image_btn" @click="openDialog">
        <el-icon :size="25" class="text-gray-500">
            <Plus />
        </el-icon>
    </div>
    <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh" draggable="true">
        <!-- 默认插槽 -->
        <el-container class="bg-white rounded" style="height: 70vh;">
            <!-- <el-header class="img_header">
                <el-button type="primary" size="small" @click="handleOpenCreate">
                    新增图片分类
                </el-button>
                <el-button type="warning" size="small" @click="handleShowUploadFileDrawer">
                    上传图片
                </el-button>
            </el-header> -->

            <el-container>
                <!-- aside 抽离为公共组件ImageAside.vue -->
                <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
                <!-- main 抽离为公共组件ImageMain.vue-->
                <ImageMain ref="ImageMainRef" @select="handleSelect" openSelect :limit="props.limit" />
            </el-container>
        </el-container>

        <!-- footer具名插槽 -->
        <template #footer>
            <span>
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="handleImageSubmit">确认</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<style scoped>
.select_image_btn {
    @apply w-[100px] h-[100px] rounded flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}

/* .img_header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
} */
</style>
