import { useUserStore } from "@/stores/user";

const hasPermission = (value: any, el = false) => {
  const userInfo = useUserStore();
  if (!Array.isArray(value))
    throw new Error(`需要配置权限，例如 v-permission=['getGoodsList,GET']`);
  // @ts-ignore
  const hasAuth = value.findIndex((v) => userInfo.ruleNames.includes(v)) !== -1;
  if (el && !hasAuth) {
    // @ts-ignore
    el.parentNode && el.parentNode.removeChild(el);
  }
  return hasAuth;
};

export default {
  install(app: any) {
    app.directive("permission", {
      mounted(el: any, binding: any) {
        hasPermission(binding.value, el);
      },
    });
  },
};
