<template>
  <div class="notFound-wrap">
    404，
    <span
      class="click"
      @click="router.push('/')"
    >
      {{ t('app.notFoundClick') }}
    </span>
    {{ t('app.backHome') }}
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import router from '@/router';

const { t } = useI18n();
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
