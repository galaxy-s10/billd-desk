<template>
  <div class="notFound-wrap">
    404，
    <span
      class="click"
      @click="router.push('/')"
    >
      点我
    </span>
    回首页
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
</script>

<style lang="scss" scoped>
.notFound-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 30px;
  transform: translate(-50%, -50%);
  .click {
    color: $theme-color-gold;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
