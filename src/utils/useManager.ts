import { useUserStore } from "@/stores/user";
import type { FormInstance, FormRules } from "element-plus";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { showModal, toast } from "./layer";
import { LogoutApi } from "@/api/manager";

export function useModifiedPass() {
  const userInfo = useUserStore();
  const router = useRouter();

  const passFormRef = ref<FormInstance>();

  const passFormModel = ref({
    oldpassword: "",
    password: "",
    repassword: "",
  });

  const passFormRules = ref<FormRules<typeof passFormModel>>({
    oldpassword: [
      {
        type: "string",
        required: true,
        message: "旧密码不能为空",
        trigger: "blur",
      },
    ],
    password: [
      {
        type: "string",
        required: true,
        message: "新密码不能为空",
        trigger: "blur",
      },
    ],
    repassword: [
      {
        type: "string",
        required: true,
        message: "确认密码不能为空",
        trigger: "blur",
      },
    ],
  });

  const submitPassForm = (FormEl: FormInstance | undefined) => {
    if (!FormEl) return;

    FormEl.validate((valid: boolean) => {
      if (!valid) return;
      else {
        // 模拟请求修改密码接口
        // ...
        //
        toast("模拟修改成功，请重新登录");
        //
        userInfo.removeLogoutStatus();
        //
        router.push("/login");
      }
    });
  };
  return {
    passFormRef,
    passFormModel,
    passFormRules,
    submitPassForm,

    userInfo,
    router,
  };
}

export function useLogout() {
  const userInfo = useUserStore();
  const router = useRouter();
  const handleLogout = () => {
    showModal("是否确认退出系统？")
      .then(async () => {
        await LogoutApi().then(() => {
          // 调用退出登录方法
          userInfo.removeLogoutStatus();
          // 路由跳转至 '/login'
          router.push("/login");
          // 提示
          toast("已退出登录");
        });
      })
      .catch(() => {
        console.log("取消退出");
      });
  };
  return {
    handleLogout,
  };
}
