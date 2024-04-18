<template>
  <Teleport to="body">
    <div
      class="teleport-login-modal-warp"
      @click.self.stop="handleClose"
    >
      <div class="content">
        <i
          class="close"
          @click="handleClose"
        ></i>
        <n-card>
          <n-tabs
            :value="currentTab"
            :default-value="currentTab"
            size="large"
            :on-update:value="tabChange"
          >
            <n-tab-pane
              name="pwdlogin"
              tab="账密登录"
            >
              <n-form
                ref="loginFormRef"
                label-placement="left"
                size="large"
                :model="loginForm"
                :rules="loginRules"
              >
                <n-form-item path="id">
                  <n-input
                    v-model:value="loginForm.id"
                    type="text"
                    placeholder="请输入账号"
                  >
                    <template #prefix>
                      <n-icon
                        size="20"
                        class="lang"
                      >
                        <PersonOutline></PersonOutline>
                      </n-icon>
                    </template>
                  </n-input>
                </n-form-item>
                <n-form-item path="password">
                  <n-input
                    v-model:value="loginForm.password"
                    type="password"
                    show-password-on="mousedown"
                    placeholder="请输入密码"
                    @focus="onFocus"
                    @blur="onBlur"
                    @keyup.enter="handleLoginSubmit"
                  >
                    <template #prefix>
                      <n-icon
                        size="20"
                        class="lang"
                      >
                        <LockClosedOutline></LockClosedOutline>
                      </n-icon>
                    </template>
                  </n-input>
                </n-form-item>
              </n-form>
              <n-button
                type="primary"
                block
                secondary
                strong
                @click="handleLoginSubmit"
              >
                登录
              </n-button>
            </n-tab-pane>
          </n-tabs>
        </n-card>
        <div class="other-login">
          <span>第三方登录：</span>
          <div
            class="logo-wrap"
            @click="handleQQLogin()"
          >
            <img
              class="logo"
              src="@/assets/img/qq_logo.webp"
            />
          </div>
          <div
            class="logo-wrap"
            @click="handleTip"
          >
            <img
              class="logo"
              src="@/assets/img/github_logo.webp"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { LockClosedOutline, PersonOutline } from '@vicons/ionicons5';
import { onMounted, onUnmounted, ref } from 'vue';

import { handleTip } from '@/hooks/use-common';
import { useQQLogin } from '@/hooks/use-login';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';

const loginRules = {
  id: { required: true, message: '请输入账号', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
};

const userStore = useUserStore();
const appStore = useAppStore();

const loginForm = ref({
  id: '',
  password: '',
});
const loginFormRef = ref(null);
const currentTab = ref('pwdlogin'); // pwdlogin
const loopTimer = ref();
const emits = defineEmits(['close']);

onMounted(() => {});
onUnmounted(() => {
  clearInterval(loopTimer.value);
});

function handleQQLogin() {
  useQQLogin({ exp: 24 });
}

function handleClose() {
  appStore.showLoginModal = false;
  emits('close');
}

const handleLogin = async () => {
  let token = null;
  token = await userStore.pwdLogin({
    id: +loginForm.value.id,
    password: loginForm.value.password,
  });
  if (token) {
    window.$message.success('登录成功!');
    userStore.getUserInfo();
    appStore.showLoginModal = false;
  }
};
const handleLoginSubmit = (e) => {
  e.preventDefault();
  // @ts-ignore
  loginFormRef.value.validate((errors) => {
    if (!errors) {
      handleLogin();
    }
  });
};
const tabChange = (v) => {
  currentTab.value = v;
  clearInterval(loopTimer.value);
};
const focus = ref(false);
const onFocus = () => {
  focus.value = true;
};
const onBlur = () => {
  focus.value = false;
};
</script>

<style lang="scss" scoped>
.teleport-login-modal-warp {
  z-index: 100 !important;

  @extend %maskBg;
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 350px;
    border-radius: 5px;
    background-color: #fff;
    transform: translate(-50%, -50%);
    .qrcode {
      width: 166px;
      height: 166px;
      margin: 0 auto;
      background-color: gray;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    .close {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 1;
      width: 18px;
      height: 18px;
      cursor: pointer;

      @include cross(#ccc, 3px);
    }

    .top {
      position: absolute;
      top: 0;
      left: 50%;
      z-index: 100;
      width: 120px;
      transform: translate(-50%, -90%);
      &.close {
        z-index: 0;
        transform: translate(-50%, -99%);
      }
    }

    .title {
      margin: 10px 0;
      text-align: center;
    }

    .other-login {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 5px 0;
      .logo-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: #f4f8fb;
        cursor: pointer;
        .logo {
          width: 26px;
          height: 26px;
        }
      }
    }
  }
}
</style>
