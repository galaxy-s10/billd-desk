<template>
  <div
    v-if="show"
    class="useTip-wrap"
  >
    <Modal
      :title="title"
      :mask-closable="maskClosable"
      @close="show = !show"
    >
      <div class="container">
        <img
          class="qq-logo"
          src="@/assets/img/qq-logo.webp"
          alt=""
          @click="handleQQlogin"
        />
        <div>qq登录</div>
      </div>

      <template #footer></template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { useQQLogin } from '@/hooks/use-login';

export default defineComponent({
  name: 'loginModal',
  setup() {
    const title = ref('登录');
    const show = ref(false);
    const maskClosable = ref(true);
    function handleQQlogin() {
      show.value = !show.value;
      useQQLogin({ exp: 24 });
    }
    return {
      title,
      show,
      maskClosable,
      handleQQlogin,
    };
  },
});
</script>

<style lang="scss" scoped>
.useTip-wrap {
  .container {
    text-align: center;
    .qq-logo {
      cursor: pointer;
      width: 60px;
    }
  }
}
</style>
