// import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import { router } from "@/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "virtual:windi.css";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import updateLocale from "dayjs/plugin/updateLocale";
import calenderPlugin from "dayjs/plugin/calendar";
import "nprogress/nprogress.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import permission from "./directives/permission";

const app = createApp(App);
// 注册插件
dayjs.extend(updateLocale);
dayjs.extend(calenderPlugin);
//
dayjs.updateLocale("zh-cn", {
  // A : 上午/下午/晚上 , dddd: 星期
  calendar: {
    lastDay: "YYYY.MM.DD [昨天] A h:mm dddd",
    sameDay: "YYYY.MM.DD [今天] A h:mm dddd",
    nextDay: "YYYY.MM.DD [明天] A h:mm dddd",
    lastWeek: "YYYY.MM.DD A h:mm [上]dddd",
    nextWeek: "YYYY.MM.DD A h:mm [下]dddd",
    sameElse: "YYYY.MM.DD A h:mm dddd",
  },
});
// 使用 zh-cn
dayjs.locale('zh-cn');

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(permission);
app.use(createPinia());
app.use(ElementPlus);
app.use(router);

app.mount("#app");
