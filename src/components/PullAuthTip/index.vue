<template>
  <div class="pull-auth">
    <div class="auth-txt">SVIP</div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.pull-auth {
  position: absolute !important;
  z-index: 10;
  border-radius: 4px;
  background-color: rgba($color: black, $alpha: 0.2);

  @extend %maskBg;
  .auth-txt {
    position: absolute;
    top: 0;
    right: 0;
    padding: 2px 10px;
    border-radius: 0px 4px 0px 8px;
    background-color: rgba($color: $theme-color-gold, $alpha: 0.8);
    color: white;
    font-weight: bold;
    font-size: 13px;
  }
}
</style>
