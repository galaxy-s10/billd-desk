<template>
  <div
    v-show="loading"
    :class="{ 'full-loading-wrap': 1, [isFixed ? 'fixed' : 'absolute']: 1 }"
  >
    <div :style="style">
      <div
        v-if="showMask"
        class="mask"
      ></div>
      <div class="container"></div>
      <div class="txt">{{ content }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { StyleValue, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'fullLoading',
  setup() {
    const isFixed = ref(false);
    const loading = ref(false);
    const showMask = ref(false);
    const content = ref('');
    const style = ref<StyleValue>();
    return { content, style, loading, showMask, isFixed };
  },
});
</script>

<style lang="scss" scoped>
@import 'billd-scss/src/animate/loading-size.scss';

.full-loading-wrap {
  z-index: 10;

  @extend %flexCenter;
  &.fixed {
    @include full(fixed);
  }
  &.absolute {
    @include full(absolute);
  }
  .mask {
    @extend %maskBg;
  }
  .container {
    @include loadingSizeChange(30px, rgba($theme-color-gold, 0.5));
  }
  .txt {
    position: relative;
    margin-top: 10px;
    font-size: 14px;
  }
}
</style>
