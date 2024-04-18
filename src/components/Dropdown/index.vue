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
      :class="{ [props.positon]: 1, isTop: props.isTop }"
      :style="{
        // display: show ? 'block' : 'none',
      }"
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
    positon?: 'left' | 'right' | 'center';
    isTop?: boolean;
  }>(),
  {
    trigger: 'hover',
    positon: 'right',
    isTop: false,
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
    top: 100%;
    z-index: 3;
    display: none;

    &.right {
      right: 0;
      left: auto;
    }
    &.left {
      right: auto;
      left: 0;
    }
    &.center {
      left: 50%;
      transform: translate(-50%, 0%);
    }
    &.isTop {
      top: 0%;
      transform: translate(-50%, -100%);
    }
    .wrap {
      box-sizing: border-box;
      margin-top: 5px;
      border-radius: 5px;
      background-color: #fff;
      box-shadow:
        0 12px 32px rgba(0, 0, 0, 0.1),
        0 2px 6px rgba(0, 0, 0, 0.08);
      color: black;
      font-size: 14px;
    }
  }
}
</style>
