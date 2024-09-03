<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import type { MenuInstance } from 'element-plus';
import { computed, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';

const userInfo = useUserStore()
const router = useRouter()
const route = useRoute()
const asideMenus = computed(() => userInfo.menus)

const handleSelect = (e: string) => {
    router.push(e)
}
const iscollapse = computed(() => !(userInfo.asideWidth === "240px"))

const defaultActive = ref(route.path)

const menuRef = ref<MenuInstance>()

// 路由更新时
onBeforeRouteUpdate((to, from) => {
    defaultActive.value = to.path
    /**
    * 删除标签页时，未激活的菜单栏自动收起
    * 直接为el-menu 添加unique-opened属性即可
    */

})
const handleClose = (e: string) => {
    console.log(e);
}

</script>

<template>
    <div class="admin_menu" :style="{ width: userInfo.asideWidth }">
        <el-scrollbar>
            <el-menu :default-active="defaultActive" unique-opened class="border-0 menu_scrollbar" @select="handleSelect"
                :collapse="iscollapse" :collapse-transition="false" @close="handleClose" ref="menuRef"
                :default-openeds="['']">
                <template v-for="(item, index) in asideMenus" :key="index">
                    <el-sub-menu v-if="item.child && item.child.length > 0" :key="index" :index="item.name">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon" />
                                <!-- <component :is="item.icon"></component> -->
                            </el-icon>
                            <span>{{ item.name }}</span>
                        </template>
                        <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.frontpath">
                            <el-icon>
                                <component :is="item2.icon" />
                                <!-- <component :is="item.icon"></component> -->
                            </el-icon>
                            <span>{{ item2.name }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-menu-item v-else :index="item.frontpath">
                        <component :is="item.icon"></component>
                        <span>{{ item.name }}</span>
                    </el-menu-item>
                </template>

            </el-menu>
        </el-scrollbar>
    </div>
</template>



<style>
.admin_menu {
    top: 64px;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    transition: all 0.2s;
    @apply fixed shadow-md bg-light-50;
}
</style>
