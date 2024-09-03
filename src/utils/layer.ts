import { ElMessageBox, ElNotification } from "element-plus";
import nProgress from "nprogress";
// 全局消息提示
export const toast = (
  message: string,
  type: "success" | "info" | "error" | "warning" = "success",
  dangerouslyUseHTMLString = true, // 解析返回的 html
  duration = 2500
) => {
  ElNotification({
    message,
    type,
    dangerouslyUseHTMLString,
    duration,
  });
};

// confirm消息提示
export const showModal = (
  content = "提示内容",
  title = "温馨提示",
  type: "success" | "info" | "error" | "warning" = "warning"
) => {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: type,
  });
};

// 加载全屏Loading
export const showFullScreenLoading = () => {
  nProgress.start();
};

// 隐藏
export const hideFullScreenLoading = () => {
  nProgress.done();
};

// 弹出提交内容的输入框
export const showPrompt = (
  // content: string,
  tip: string,
  value: string = ""
) => {
  return ElMessageBox.prompt("", tip, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    // inputPattern:
    //   /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    // inputErrorMessage: "名称不合规",
    inputValue: value,
  });
};
