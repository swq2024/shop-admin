import { ref } from "vue";
import { defineStore } from "pinia";
import { getInfoApi, loginApi } from "@/api/manager";
import { removeToken, setToken } from "@/utils/access";
import type { LoginFormType } from "@/types/login";
import type { menuListType } from "@/types/menus";

export const useUserStore = defineStore("Users", () => {
  // state
  const user = ref({}); // 用户信息
  const menus = ref<menuListType[]>([]); // 菜单数据
  const ruleNames = ref([]); // 权限管理
  const asideWidth = ref("240px");

  // computed

  // 设置token 用户登录态
  const SET_USERINFO = (userInfo: object) => {
    user.value = userInfo;
  };
  //
  const SET_MENUS = (menuList: []) => {
    menus.value = menuList;
  };
  //
  const SET_RULENAMES = (ruleNameList: []) => {
    ruleNames.value = ruleNameList;
  };
  //
  const handleAsideWidth = () => {
    asideWidth.value = asideWidth.value === "240px" ? "64px" : "240px";
  };
  // 登录
  const handleLogin = ({ username, password }: LoginFormType) => {
    return new Promise((resolve, reject) => {
      loginApi(username, password)
        .then((res) => {
          //@ts-ignore
          setToken(res.token);

          resolve(res);
        })
        .catch((err) => reject(err));
    });
  };
  // 获取当前用户登录信息
  const getUserInfo = () => {
    return new Promise((resolve, reject) => {
      getInfoApi()
        .then((res) => {
          // 存储用户信息
          SET_USERINFO(res);
          // @ts-ignore
          SET_MENUS(res.menus);
          // @ts-ignore
          SET_RULENAMES(res.ruleNames);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  // 退出登录
  const removeLogoutStatus = async () => {
    // 移除登录态 token
    removeToken();
    // 清除pinia存储的用户信息
    SET_USERINFO({});
  };

  return {
    user,
    menus,
    ruleNames,
    asideWidth,
    SET_USERINFO,
    SET_MENUS,
    SET_RULENAMES,
    handleLogin,
    handleAsideWidth,
    getUserInfo,
    removeLogoutStatus,
  };
});
