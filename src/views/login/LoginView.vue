<script setup lang="ts">
import { ref } from 'vue'
import { type FormInstance, type FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { toast } from '@/utils/layer';
import { useUserStore } from '@/stores/user';


const router = useRouter()

const isLoading = ref(false)

const loginFormRef = ref<FormInstance>()

const loginFormModel = ref({
  username: "",
  password: ""
})

const loginFormRules = ref<FormRules<typeof loginFormModel>>({
  username: [
    { type: 'string', required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 5, max: 12, message: '用户名长度为5-12位', trigger: 'change' }
  ],
  password: [
    { type: 'string', required: true, message: '密码不能为空', trigger: 'blur' }
  ]
})

const submitLoginForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid: boolean) => {
    if (!valid) return
    else {
      const username = loginFormModel.value.username
      const password = loginFormModel.value.password
      const userInfo = useUserStore()
      // 调用登录接口
      isLoading.value = true
      userInfo.handleLogin({username, password})
        .then((res) => {
          // console.log(res);
          //
          toast("登录成功")
          //
          router.push("/")
        })
        // .catch(()=>{})// 捕获错误，在拦截器中做统一处理
        .finally(() => {
          isLoading.value = false
        })
      return
    }
  })
}

// const resetForm = (formEl: FormInstance | undefined) => {
//   if (!formEl) return
//   formEl.resetFields()
// }
</script>

<template>
  <el-row class="login_container">
    <el-col :lg="16" :md="12" class="left">
      <div>
        <h2>欢迎登录</h2>
        <p class="">Vue3 + Vite + WindICss + EP + VueRoute4 商品后台管理系统</p>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" class="right">
      <h2 class="title">
        Login
      </h2>
      <div class="sub_title">
        <span class="divider"></span>
        <span>账户密码登录</span>
        <span class="divider"></span>
      </div>
      <el-form ref="loginFormRef" :model="loginFormModel" :rules="loginFormRules" class="w-[250px]" v-on:keydown.enter="submitLoginForm(loginFormRef)">
        <el-form-item label="" prop="username">
          <el-input v-model="loginFormModel.username" placeholder="请输入用户名" clearable>
            <template #prefix>
              <el-icon class="el-input__icon">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="loginFormModel.password" type="password" placeholder="请输入密码" show-password>
            <template #prefix>
              <el-icon class="el-input__icon">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLoginForm(loginFormRef)" :loading="isLoading" class="w-[250px]" round
            color="#626aef">登
            录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>



<style lang="scss" scoped>
.login_container {
  @apply min-h-screen bg-indigo-500;

  .left,
  .right {
    @apply flex justify-center items-center;
  }

  .right {
    @apply bg-light-200 flex-col;
  }

  .left>div>:first-child {
    @apply font-bold text-5xl text-light-200 mb-4;
  }

  .left>div>:last-child {
    @apply text-green-50 text-sm;
  }

  .right>.title {
    @apply font-bold text-3xl;
  }

  .right>.sub_title {
    @apply flex justify-center items-center my-5 text-gray-400 space-x-2;
  }

  .right>.sub_title>.divider {
    @apply w-20 h-[1px] bg-gray-200
  }
}
</style>
