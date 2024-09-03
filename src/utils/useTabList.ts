import { useUserStore } from "@/stores/user";
import type { tabListType } from "@/types/tabs";
import { useCookies } from "@vueuse/integrations/useCookies.mjs";
import type { TabPaneName } from "element-plus";
import { ref } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

export function useTabList() {
  const route = useRoute();
  const router = useRouter();
  const userInfo = useUserStore();
  const cookie = useCookies();

  const currentTab = ref(route.path);
  const tabList = ref<tabListType[]>([
    {
      title: "后台首页",
      path: "/",
    },
  ]);
  const addTab = (tab: tabListType) => {
    const notHasTab =
      tabList.value.findIndex((t) => t.path === tab.path) === -1;
    if (notHasTab) {
      tabList.value.push(tab);
    }
    // 把标签列表存入cookie
    cookie.set("tabList", tabList.value);
  };
  //
  const initTabList = () => {
    const tabs = cookie.get("tabList");
    if (tabs) {
      tabList.value = tabs;
    }
  };

  initTabList();

  onBeforeRouteUpdate((to, from) => {
    currentTab.value = to.path;
    addTab({
      path: to.path,
      title: to.meta.title as string,
    });
  });

  const changeTab = (targetName: string) => {
    // 移除标签页时，v-model的 currentTab 重新赋值，没有触发@tab-change事件进行路由切换，
    // 解决 ---> 使用 :before-leave 切换标签之前的钩子函数进行标签页的路由切换
    console.log("标签页切换到了", targetName);

    currentTab.value = targetName;
    // 点击才能触发该事件???
    router.push(targetName);
  };
  const removeTab = (targetName: string) => {
    const tabs = tabList.value;
    // console.log(targetName);
    let activeTab = currentTab.value;

    if (activeTab === targetName) {
      tabs.forEach((item, index) => {
        if (item.path === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            activeTab = nextTab.path;
          }
        }
      });
    }
    currentTab.value = activeTab;
    console.log(currentTab.value);

    tabList.value = tabList.value.filter((tab) => tab.path !== targetName);

    cookie.set("tabList", tabList.value);

    // return activeTab
  };
  //
  const handleBeforeLeave = (
    activeName: TabPaneName,
    oldActiveName: TabPaneName
  ) => {
    const To = tabList.value.find((item) => item.path === activeName);
    if (To) {
      console.log({
        to: To.title,
        from: oldActiveName,
      });
    }
    //
    router.push(activeName as string);
  };
  const handleClose = (e: string) => {
    if (e === "clearAll") {
      // 切换回首页标签
      currentTab.value = "/";
      // 标签列表只留下首页
      tabList.value = [
        {
          title: "后台首页",
          path: "/",
        },
      ];
    }
    if (e === "clearOther") {
      tabList.value = tabList.value.filter(
        (tab) => tab.path === "/" || tab.path === currentTab.value
      );
    }
    cookie.set("tabList", tabList.value);
  };
  return {
    currentTab,
    tabList,
    userInfo,
    changeTab,
    removeTab,
    handleBeforeLeave,
    handleClose
  }
}
