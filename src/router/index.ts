import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import { createRouterGuard } from "./guard";
import type { menuListType } from "@/types/menus";
import LoginView from "@/views/login/LoginView.vue";
import IndexView from "@/views/IndexView.vue";
import AdminView from "@/layout/AdminView.vue";
// const LoginView = () => import("@/views/login/LoginView.vue");
// const AdminView = () => import("@/layout/AdminView.vue");
// const IndexView = () => import("@/views/IndexView.vue");
const CommodityManage = () => import("@/views/commodity/CommodityManage.vue");
const CategoryManage = () => import("@/views/commodity/CategoryManage.vue");
const SpecificationManage = () => import("@/views/commodity/SkuManage.vue");
const CouponManage = () => import("@/views/commodity/CouponManage.vue");
const UserManage = () => import("@/views/user/UserManage.vue");
const CommentManage = () => import("@/views/order/CommentManage.vue");
const ManagerManage = () => import("@/views/manager/managerManage.vue");
const AuthorityManage = () => import("@/views/manager/AuthorityManage.vue");
const RoleManage = () => import("@/views/manager/RoleManage.vue");
const VipLevel = () => import("@/views/user/VipLevel.vue");
const BaseSetting = () => import("@/views/system/BaseSetting.vue");
const DealSetting = () => import("@/views/system/DealSetting.vue");
const TransportSetting = () => import("@/views/system/TransportSetting.vue");
const DistributorManage = () =>
  import("@/views/distribution/DistributorManage.vue");
const DistributionSetting = () =>
  import("@/views/distribution/DistributionSetting.vue");
const ImageManage = () => import("@/views/other/ImageManage.vue");
const AnnouncementManage = () => import("@/views/other/AnnouncementManage.vue");
const OrderManage = () => import("@/views/order/OrderManage.vue");
const NotFound = () => import("@/views/NotFound.vue");

// 基本路由，所有人共享
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Admin",
    component: AdminView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      title: "登录",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      titile: "404",
    },
  },
];

// 动态路由
const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "/",
    component: IndexView,
    meta: {
      title: "后台首页",
    },
  },
  {
    path: "/goods/list",
    name: "/goods/list",
    component: CommodityManage,
    meta: {
      title: "商品管理",
    },
  },
  {
    path: "/category/list",
    name: "/category/list",
    component: CategoryManage,
    meta: {
      title: "分类管理",
    },
  },
  {
    path: "/skus/list",
    name: "/skus/list",
    component: SpecificationManage,
    meta: {
      title: "规格管理",
    },
  },
  {
    path: "/coupon/list",
    name: "/coupon/list",
    component: CouponManage,
    meta: {
      title: "优惠券管理",
    },
  },
  {
    path: "/user/list",
    name: "/user/list",
    component: UserManage,
    meta: {
      title: "用户管理",
    },
  },
  {
    path: "/level/list",
    name: "/level/list",
    component: VipLevel,
    meta: {
      title: "会员管理",
    },
  },
  {
    path: "/order/list",
    name: "/order/list",
    component: OrderManage,
    meta: {
      title: "订单管理",
    },
  },
  {
    path: "/comment/list",
    name: "/comment/list",
    component: CommentManage,
    meta: {
      title: "评论管理",
    },
  },
  {
    path: "/manager/list",
    name: "/manager/list",
    component: ManagerManage,
    meta: {
      title: "管理员管理",
    },
  },
  {
    path: "/access/list",
    name: "/access/list",
    component: AuthorityManage,
    meta: {
      title: "权限管理",
    },
  },
  {
    path: "/role/list",
    name: "/role/list",
    component: RoleManage,
    meta: {
      title: "角色管理",
    },
  },
  {
    path: "/setting/base",
    name: "/setting/base",
    component: BaseSetting,
    meta: {
      title: "基础设置",
    },
  },
  {
    path: "/setting/buy",
    name: "/setting/buy",
    component: DealSetting,
    meta: {
      title: "交易设置",
    },
  },
  {
    path: "/setting/ship",
    name: "/setting/ship",
    component: TransportSetting,
    meta: {
      title: "物流设置",
    },
  },
  {
    path: "/distribution/index",
    name: "/distribution/index",
    component: DistributorManage,
    meta: {
      title: "分销员管理",
    },
  },
  {
    path: "/distribution/setting",
    name: "/distribution/setting",
    component: DistributionSetting,
    meta: {
      title: "分销设置",
    },
  },
  {
    path: "/image/list",
    name: "/image/list",
    component: ImageManage,
    meta: {
      title: "图片管理",
    },
  },
  {
    path: "/notice/list",
    name: "/notice/list",
    component: AnnouncementManage,
    meta: {
      title: "公告管理",
    },
  },
];

// 动态添加路由
const dynamicAddRoutes = (menus: menuListType[]) => {
  // 是否有新路由
  let hasNewRoutes = false;

  const seekRoutesByMenuList = (menuList: menuListType[]) => {
    menuList.forEach((e: menuListType) => {
      const item = dynamicRoutes.find((o) => o.path === e.frontpath);
      if (item && !router.hasRoute(item.path)) {
        // 添加嵌套路由
        router.addRoute("Admin", item);

        hasNewRoutes = true;
      }
      if (e.child && e.child.length > 0) {
        //@ts-ignore
        seekRoutesByMenuList(e.child);
      }
    });
  };
  seekRoutesByMenuList(menus);

  return hasNewRoutes;
};

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

// 创建路由守卫
createRouterGuard(router);

export { router, dynamicAddRoutes };
