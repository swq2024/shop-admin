<script setup lang="ts">
import MenuItem from './components/MenuItem.vue';
import HeaderItem from './components/HeaderItem.vue';
import TabsItem from './components/TabsItem.vue';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

const userInfo = useUserStore()
const KeepAliveMaxNum = ref(10)
</script>

<template>
    <el-container>
        <el-header>
            <HeaderItem />
        </el-header>

        <el-container>
            <el-aside :width="userInfo.asideWidth">
                <MenuItem></MenuItem>
            </el-aside>
            <el-main>
                <TabsItem />
                <RouterView v-slot="{ Component }">
                    <!-- 全局过渡动画 -->
                    <Transition name="fade">
                        <!-- keep-alive页面缓存 -->
                        <KeepAlive :max="KeepAliveMaxNum">
                            <component :is="Component"></component>
                        </KeepAlive>
                    </Transition>
                </RouterView>
            </el-main>
        </el-container>

    </el-container>
</template>



<style scoped>
.el-aside {
    transition: all 0.2s;
}

.fade-enter-from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);

}

.fade-enter-to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}

.fade-leave-from {
    opacity: 1;
}

.fade-leave-to {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
}

.fade-leave-active {
    transition: all 0.3s ease-out;
}

.fade-enter-active {
    transition: all 0.3s ease-in;
}

.fade-enter-active {
    transition-delay: 0.3s;
}
</style>
