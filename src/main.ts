// import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import { router } from "@/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "virtual:windi.css";
import "nprogress/nprogress.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import permission from "./directives/permission";

const app = createApp(App);
// app.directive("removeAriaHidden", (el, binding) => {
//   const ariaEls = el.querySelectorAll(".el-radio__original");
//   ariaEls.forEach((item: HTMLElement) => {
//     item.removeAttribute("aria-hidden");
//   });
// });
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(permission)
app.use(createPinia());
app.use(ElementPlus);
app.use(router);

app.mount("#app");
