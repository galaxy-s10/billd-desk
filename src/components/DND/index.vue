<template>
  <div
    ref="dndRef"
    class="dndRef"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';

const dndRef = ref<HTMLElement>();
const offset = reactive({ x: 0, y: 0 }); // x:距离最左边多少px；y:距离最下边多少px
const isDown = ref(false); // 是否按下
const position = reactive({ top: 0, left: 0 }); // 当前dnd的位置

const props = withDefaults(
  defineProps<{
    margin?: number;
    isWelt?: boolean;
  }>(),
  {
    margin: 0,
    isWelt: false,
  }
);

const emits = defineEmits(['move']);

const handleMove = move;

function handleInit() {
  if (!dndRef.value) return;
  // @ts-ignore
  dndRef.value.addEventListener('mousedown', handleStart);
  // @ts-ignore
  document.addEventListener('mousemove', handleMove);
  // @ts-ignore
  document.addEventListener('mouseup', handleEnd);
  // @ts-ignore
  dndRef.value.addEventListener('mouseup', handleEnd);
  // @ts-ignore
  dndRef.value.addEventListener('touchstart', handleStart);
  document.addEventListener(
    'touchmove',
    // @ts-ignore
    handleMove,
    // iOS safari 阻止“橡皮筋效果”
    { passive: false }
  );
  // @ts-ignore
  document.addEventListener('touchend', handleEnd);
}

onMounted(() => {
  handleInit();
});
onUnmounted(() => {
  // @ts-ignore
  dndRef.value?.removeEventListener('mousedown', handleStart);
  // @ts-ignore
  document.removeEventListener('mousemove', handleMove);
  // @ts-ignore
  document.removeEventListener('mouseup', handleEnd);
  // @ts-ignore
  dndRef.value?.removeEventListener('touchstart', handleStart);
  // @ts-ignore
  document.removeEventListener('touchmove', handleMove);
  // @ts-ignore
  document.removeEventListener('touchend', handleEnd);
});

function move(event: TouchEvent & MouseEvent) {
  // 禁用默认事件，让需要滑动的地方滑动，不需要滑动的地方禁止滑动。
  event.preventDefault();
  if (!dndRef.value) return;
  if (!isDown.value) return;
  if (event.targetTouches) {
    position.top = event.targetTouches[0].pageY - offset.y;
    position.left = event.targetTouches[0].pageX - offset.x;
  } else {
    position.top = event.pageY - offset.y;
    position.left = event.pageX - offset.x;
  }
  const parentEl = dndRef.value.parentElement!;
  const topRes = position.top - parentEl.getBoundingClientRect().top;
  const leftRes = position.left - parentEl?.getBoundingClientRect().left;

  dndRef.value.style.top = `${topRes}px`;
  dndRef.value.style.left = `${leftRes}px`;
  emits('move', { top: topRes, left: leftRes, el: dndRef.value.children[0] });
}

function handleStart(event: TouchEvent & MouseEvent) {
  if (!dndRef.value) return;
  isDown.value = true;
  let x = 0;
  let y = 0;
  if (event.targetTouches) {
    x = event.targetTouches[0].pageX - dndRef.value.getBoundingClientRect().x;
    y = event.targetTouches[0].pageY - dndRef.value.getBoundingClientRect().y;
  } else {
    x = event.pageX - dndRef.value.getBoundingClientRect().x;
    y = event.pageY - dndRef.value.getBoundingClientRect().y;
  }
  offset.x = x;
  offset.y = y;
}

function handleEnd() {
  if (!dndRef.value) return;
  isDown.value = false;
  const rect = dndRef.value.getBoundingClientRect();
  const clientWidth = window.document.documentElement.clientWidth;
  const clientHeight = window.document.documentElement.clientHeight;
  if (rect.top <= props.margin) {
    dndRef.value.style.top = `${props.margin}px`;
    position.top = props.margin;
  }
  if (rect.bottom >= clientHeight - props.margin) {
    dndRef.value.style.top = `${clientHeight - rect.height - props.margin}px`;
    position.top = clientHeight - rect.height - props.margin;
  }
  if (props.isWelt) {
    dndRef.value.style.transition = 'all .3s ease';
    if (rect.x + rect.width / 2 > clientWidth / 2) {
      setTimeout(() => {
        if (!dndRef.value) return;
        dndRef.value.style.left = `${
          clientWidth - props.margin - rect.width
        }px`;
        position.left = clientWidth - props.margin - rect.width;
      }, 0);
    } else {
      setTimeout(() => {
        if (!dndRef.value) return;
        dndRef.value.style.left = `${props.margin}px`;
        position.left = props.margin;
      }, 0);
    }

    setTimeout(() => {
      dndRef.value?.style.removeProperty('transition');
    }, 300);
  }
}
</script>

<style lang="scss" scoped>
.dndRef {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
