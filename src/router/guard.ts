import { useUserStore } from "@/stores/user";
import { getToken } from "@/utils/access";
import {
  hideFullScreenLoading,
  showFullScreenLoading,
  toast,
} from "@/utils/layer";
import type { Router } from "vue-router";
import { dynamicAddRoutes } from ".";

/**
 * 通用守卫配置
 * @param router
 */
function setupCommonGuard(router: Router) {
  // 防止重复发送网络请求数据
  let hasGetInfo = false
  router.beforeEach(async (to, from, next) => {
    // 切换路由前，显示开始加载进度条
    showFullScreenLoading();

    const userInfo = useUserStore();
    const token = getToken();
    // 验证是否登录
    if (!token && to.path !== "/login") {
      toast("请先登录", "error");
      return next({ path: "/login" });
    }

    // 防止重复登录
    if (token && to.path === "/login") {
      toast("请勿重复登录", "warning");
      return next({ path: from.path ? from.path : "/" });
    }
    let hasNewRoutes = false;
    // 如果获取到了登录态token，自动请求接口获取用户信息，并进行pinia存储
    if (token && !hasGetInfo) {
      // @ts-ignore
      const { menus } = await userInfo.getUserInfo();
      // 请求完成后，避免重复请求数据
      hasGetInfo = true
      // 动态添加路由
      hasNewRoutes = dynamicAddRoutes(menus);
    }
    // 设置页面标题  ??空值合并运算符 处理左侧为null | undefined，0和false不做处理直接返回itself
    document.title = (to.meta?.title ?? "商品后台管理系统") as string;
    //
    hasNewRoutes ? next(to.fullPath) : next();
  });

  router.afterEach(() => {
    // 路由加载结束后，完成加载进度
    hideFullScreenLoading();
  });

  // router.isReady().then(() => {
  //   const userInfo = useUserStore();
  //   const token = getToken();
  //   if (token) {
  //     // @ts-ignore
  //     const { menus } = userInfo.user;

  //     dynamicAddRoutes(menus);
  //   }
  //   router.replace(router.currentRoute.value.fullPath);
  // });
}

/**
 * 权限访问守卫配置
 * @param router
 */

function setupAccessGuard(router: Router) {
  router.beforeEach(() => {});
}

/**
 * 项目守卫配置
 * @param router
 */

function createRouterGuard(router: Router) {
  /** 通用 */
  setupCommonGuard(router);
  /** 权限访问 */
  setupAccessGuard(router);
}

export { createRouterGuard };
