<template>
  <div
    class="dropdown-wrap"
    :class="{ hover: props.trigger === 'hover' }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClickWrap"
  >
    <div class="btn">
      <slot name="btn"></slot>
    </div>
    <div
      class="container"
      @click.stop="handleClick"
    >
      <div class="wrap">
        <slot name="list"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const show = ref(false);

const props = withDefaults(
  defineProps<{
    trigger?: 'hover' | 'click';
  }>(),
  {
    trigger: 'hover',
  }
);

function handleClick() {
  show.value = false;
}
function handleClickWrap() {
  show.value = true;
}
function handleMouseEnter() {
  if (props.trigger === 'hover') {
    show.value = true;
  }
}
function handleMouseLeave() {
  show.value = false;
}
</script>

<style lang="scss" scoped>
.dropdown-wrap {
  position: relative;
  display: inline-block;
  cursor: initial;
  &.hover {
    &:hover {
      .container {
        display: block;
      }
    }
  }

  .btn {
    cursor: pointer;

    user-select: none;
  }
  .container {
    position: absolute;
    top: 0;
    left: 99%;
    z-index: 3;
    display: none;
    width: 100%;
    // background-color: red;
    height: 100%;
    .wrap {
      box-sizing: border-box;
      border-radius: 5px;
      margin-left: calc(1% + 4px);
      color: black;
      font-size: 14px;
      background-color: #fff;
      box-shadow:
        0 12px 32px rgba(0, 0, 0, 0.1),
        0 2px 6px rgba(0, 0, 0, 0.08);
      // .inner {
      // }
    }
  }
}
</style>
