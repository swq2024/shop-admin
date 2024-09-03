<script setup lang="ts">
import { uploadImageAction } from '@/api/image';
import { getToken } from '@/utils/access';
import { toast } from '@/utils/layer';
import type { UploadFile, UploadFiles } from 'element-plus';

const token = getToken()

defineProps({
    data: Object
})

const emit = defineEmits(["success"])

const UploadImgSuccessEvent = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    // console.log("上传成功");
    emit("success", {
        response,
        uploadFile,
        uploadFiles
    })
    if (response.msg === "ok") {
        toast("上传成功")
        return
    }
}

const UploadImgErrorEvent = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    // console.log('上传失败');
    const errorMsg = JSON.parse(error.message).msg || "上传失败"
    toast(errorMsg, "error")
}
</script>

<template>
    <el-upload name="img" :action="uploadImageAction" :headers="{ token }" :data="data" multiple drag
        :on-success="UploadImgSuccessEvent" :on-error="UploadImgErrorEvent">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
            <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
            </div>
        </template>
    </el-upload>
</template>

<style scoped></style>
