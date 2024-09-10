<script setup lang="ts">
// import { ArrowDown, ElemeFilled, Expand, Fold, FullScreen, Lock, Refresh, Setting, SwitchButton } from '@element-plus/icons-vue';
import { useDark, useFullscreen, useToggle } from '@vueuse/core';
import { ref } from 'vue';
import FormDrawer from '@/components/FormDrawer.vue';
import { useLogout, useModifiedPass } from '@/utils/useManager';
import LockScreen from './LockScreen.vue';
import LockDialog from './LockDialog.vue';
import { getLockStatus } from '@/utils/access';
import { Moon, Setting, Sunny, SwitchButton } from '@element-plus/icons-vue';

const { toggle, isFullscreen } = useFullscreen()
const LockStatus = getLockStatus();
const {
    passFormRef,
    passFormModel,
    passFormRules,
    submitPassForm,
    userInfo,
} = useModifiedPass()

const { handleLogout } = useLogout()
// 封装抽屉组件的实例
const formDrawerRef = ref(null)

const handleCommand = (e: string | number | object) => {
    switch (e) {
        case "setPass":
            //@ts-ignore
            formDrawerRef.value?.open()
            break
        case "logout":
            handleLogout()
            break
    }
}

const handleRefresh = () => location.reload()

const LockDialogRef = ref(null)
const handleLockScreen = () => {
    // @ts-ignore
    LockDialogRef.value?.openDialog()
}

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
    <div class="admin_header">
        <span class="logo">
            <el-icon class="mr-2">
                <ElemeFilled />
            </el-icon>
            商城后台中心
        </span>
        <el-tooltip class="box-item" effect="dark" content="收起" placement="bottom">
            <el-icon class="icon-btn" @click="userInfo.handleAsideWidth">
                <Fold v-if="userInfo.asideWidth === '240px'" />
                <Expand v-else />
            </el-icon>
        </el-tooltip>

        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="icon-btn" @click="handleRefresh">
                <Refresh />
            </el-icon>
        </el-tooltip>

        <div class="ml-auto flex items-center">
            <el-tooltip effect="dark" content="锁定" placement="bottom">
                <el-icon class="icon-btn" @click="handleLockScreen">
                    <Lock />
                </el-icon>
            </el-tooltip>

            <el-tooltip effect="dark" :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
                <el-icon class="icon-btn" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <svg v-else t="1724202820197" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="5252" width="18" height="18">
                        <path
                            d="M95.944 371.082h239.487c19.851 0 36-16.149 36-36V95.594c0-17.673-14.327-32-32-32s-32 14.327-32 32v211.488H95.944c-17.673 0-32 14.327-32 32 0 17.672 14.327 32 32 32z m0 344.934h211.487v211.487c0 17.673 14.327 32 32 32s32-14.327 32-32V688.016c0-19.851-16.149-36-36-36H95.944c-17.673 0-32 14.327-32 32s14.327 32 32 32z m588.569 243.386c17.673 0 32-14.327 32-32V715.915H928c17.673 0 32-14.327 32-32s-14.327-32-32-32H688.513c-19.851 0-36 16.149-36 36v239.487c0 17.673 14.327 32 32 32z m4-587.763H928c17.673 0 32-14.327 32-32s-14.327-32-32-32H716.513V96.151c0-17.673-14.327-32-32-32s-32 14.327-32 32v239.488c0 19.85 16.149 36 36 36z"
                            p-id="5253"></path>
                    </svg>
                </el-icon>
            </el-tooltip>

            <!-- <el-switch v-model="isDark" :active-icon="Moon" :inactive-icon="Sunny" inline-prompt @change="toggleDark" /> -->

            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex items-center text-light-50">
                    <!-- @vue-ignore -->
                    <el-avatar class="mr-2" :size="25" :src="userInfo.user.avatar" />
                    <!-- @vue-ignore -->
                    {{ userInfo.user.username }}
                    <el-icon class="el-icon--right">
                        <ArrowDown />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item :icon="Setting" command="setPass">修改密码</el-dropdown-item>
                        <el-dropdown-item :icon="SwitchButton" command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <FormDrawer ref="formDrawerRef" title="修改密码" destoryOnClose @submit="submitPassForm(passFormRef)">
        <el-form ref="passFormRef" :model="passFormModel" :rules="passFormRules" label-width="80px">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input type="password" v-model="passFormModel.oldpassword" placeholder="请输入旧密码" />
            </el-form-item>

            <el-form-item prop="password" label="新密码">
                <el-input type="password" v-model="passFormModel.password" placeholder="请输入密码" />
            </el-form-item>

            <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" v-model="passFormModel.repassword" placeholder="请输入确认密码" show-password />
            </el-form-item>
        </el-form>
    </FormDrawer>
    <LockDialog ref="LockDialogRef" />
    <LockScreen v-if="LockStatus" />
</template>

<style lang="scss" scoped>
.admin_header {
    z-index: 999;
    @apply flex items-center h-[64px] bg-indigo-500 text-light-50 fixed top-0 left-0 right-0;

    .logo {
        @apply flex justify-center items-center w-[250px] text-xl font-thin;
    }

    .icon-btn {
        @apply flex justify-center items-center w-[42px] h-[64px] cursor-pointer;
    }

    .icon-btn:hover {
        @apply bg-indigo-400;
    }

    .dropdown {
        @apply h-[64px] flex justify-center items-center mx-5 cursor-pointer;
    }

    /**
    * 去除边框样式
    * Vue 3 引入了 :deep() 伪类，它可以用来穿透组件的样式作用域，修改子组件的样式。
    * 述样式规则将移除 el-tooltip__trigger 类（通常是下拉框的触发元素）在聚焦时的默认边框。
    * :focus-visible 伪类确保只有在用户通过键盘聚焦元素时才会应用样式，这样鼠标聚焦时的默认样式不会被影响。
    */
    :deep(.el-tooltip__trigger:focus-visible) {
        outline: unset;
    }
}
</style>
