<script setup lang="ts">
import { useTabList } from '@/utils/useTabList';
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
const {
    currentTab,
    tabList,
    userInfo,
    changeTab,
    removeTab,
    handleBeforeLeave,
    handleClose,
} = useTabList()
</script>

<template>
    <div class="admin_tabList" :style="{ left: userInfo.asideWidth }">
        <!-- 标签页 -->
        <el-tabs v-model="currentTab" type="card" class="flex-1" @tab-remove="removeTab" @tab-change="changeTab"
            style="min-width: 100px;" :before-leave="handleBeforeLeave">
            <el-tab-pane v-for="item in tabList" :key="item.path" :label="item.title" :name="item.path"
                :closable="item.path !== '/'">
                <!-- {{ item.content }} -->
            </el-tab-pane>
        </el-tabs>
        <!-- 标签下拉选项 -->
        <span class="tag_dropdown">
            <el-dropdown @command="handleClose">
                <span class="el-dropdown-link cursor-pointer">
                    <el-icon>
                        <!-- <ArrowUp/> -->
                        <ArrowDown />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="clearAll">关闭全部</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <div class="h-[44px]"></div>
</template>



<style scoped>
.admin_tabList {
    @apply fixed bg-gray-100 flex items-center px-2;
    top: 64px;
    right: 0;
    height: 44px;
    z-index: 99;
}

.tag_dropdown {
    @apply flex justify-center items-center bg-light-50 rounded ml-auto px-2;
    height: 32px;
}

:deep(.el-tabs__header) {
    border-bottom: 0 !important;
    @apply mb-0;
}

:deep(.el-tabs__nav) {
    border: 0 !important;
}

:deep(.el-tabs__item) {
    border: 0 !important;
    height: 32px;
    line-height: 32px;
    @apply bg-white mx-1 rounded;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
    height: 32px;
    line-height: 32px;
}

:deep(.is-disabled) {
    cursor: not-allowed;
    @apply bg-gray-50;
}

/* 解决下拉菜单鼠标移入或点击后出现黑色边框的问题 */
.el-dropdown-link {
    outline: unset;
}
</style>
