import { useUserStore } from "@/stores/user";
import { getToken } from "@/utils/access";
import { toast } from "@/utils/layer";
import axios from "axios";

const service = axios.create({
  // 会产生跨域问题，
  // baseURL: "http://ceshi13.dishait.cn",
  // 使用 vite.config.ts 配置中的server.proxy代理
  baseURL: import.meta.env.VITE_APP_BASE_API,
});
// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 向其他接口发送请求时，默认在header请求头中添加token
    const token = getToken();
    if (token) {
      config.headers["token"] = token;
    }

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.request.responseType === "blob"
      ? response.data
      : response.data.data;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const msg = error.response.data.msg || "请求失败";
    const userInfo = useUserStore();
    if (msg === "非法token，请重新登录") {
      // 移除登录态，刷新页面到登录页
      userInfo.removeLogoutStatus().finally(() => location.reload());
    }
    toast(msg, "error");

    return Promise.reject(error);
  }
);
export { service };
