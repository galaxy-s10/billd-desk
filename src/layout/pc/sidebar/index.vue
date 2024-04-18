<template>
  <aside class="sidebar-wrap">
    <div
      class="item"
      @click="router.push({ name: routerName.rank })"
    >
      <div class="ico rank"></div>
      <div class="txt">{{ t('layout.rank') }}</div>
    </div>
    <div
      class="item"
      @click="router.push({ name: routerName.shop })"
    >
      <div class="ico shop"></div>
      <div class="txt">{{ t('layout.shop') }}</div>
    </div>
    <div
      class="item"
      @click="router.push({ name: routerName.order })"
    >
      <div class="ico data"></div>
      <div class="txt">{{ t('layout.siteOrder') }}</div>
    </div>
    <div
      class="item"
      @click="router.push({ name: routerName.wallet })"
    >
      <div class="ico wallet"></div>
      <div class="txt">{{ t('layout.myWallet') }}</div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import router, { routerName } from '@/router';

const { t } = useI18n();
</script>

<style lang="scss" scoped>
.sidebar-wrap {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 10;
  padding: 15px 10px;
  width: 70px;
  border-radius: 20px 0 0 20px;
  background-color: white;
  box-shadow: 0 0 20px 1px rgba($theme-color-gold, 0.15);
  color: $theme-color-gold;
  text-align: center;
  transform: translateY(-50%);
  .item {
    cursor: pointer;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    .ico {
      margin: 0 auto;
      width: 20px;
      height: 20px;
      opacity: 0.9;

      @extend %containBg;

      &.rank {
        @include setBackground('@/assets/img/rank.png');
      }
      &.shop {
        @include setBackground('@/assets/img/shop.png');
      }
      &.wallet {
        @include setBackground('@/assets/img/wallet.png');
      }
      &.data {
        @include setBackground('@/assets/img/data.png');
      }
    }
    .txt {
      font-size: 13px;
    }
  }
}
</style>
