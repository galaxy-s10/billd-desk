<template>
  <div
    v-if="show"
    class="useTip-wrap"
  >
    <Modal
      :title="title"
      :mask-closable="maskClosable"
      :hidden-close="hiddenClose"
      @close="handleCancel()"
      :width="width"
    >
      <div ref="domRef"></div>
      <template v-if="typeof content === 'string'">{{ content }}</template>
      <template #footer>
        <div class="footer">
          <div
            v-if="!hiddenCancel"
            class="btn return"
            @click="handleCancel()"
          >
            {{ cancelButtonText }}
          </div>
          <div
            :class="{ btn: 1, next: 1, hiddenCancel }"
            @click="handleOk()"
          >
            {{ confirmButtonText }}
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { VNode, defineComponent, ref, render, watch } from 'vue';

export default defineComponent({
  name: 'tipModal',
  emits: ['ok', 'cancel'],
  setup() {
    const title = ref('提示');
    const cancelButtonText = ref('取消');
    const confirmButtonText = ref('确认');
    const width = ref('320px');
    const content = ref<string | VNode>('');
    const show = ref(false);
    const hiddenCancel = ref(false);
    const hiddenClose = ref(false);
    const maskClosable = ref(true);
    const domRef = ref();
    watch([() => show.value, () => domRef.value], ([val1, val2]) => {
      if (!val1 || !val2) return;
      if (typeof content.value !== 'string') {
        render(content.value, domRef.value);
      }
    });
    function handleCancel(cb?) {
      cb?.();
    }
    function handleOk(cb?) {
      cb?.();
    }
    return {
      title,
      width,
      content,
      show,
      hiddenCancel,
      hiddenClose,
      maskClosable,
      domRef,
      handleCancel,
      handleOk,
      confirmButtonText,
      cancelButtonText,
    };
  },
});
</script>

<style lang="scss" scoped>
.useTip-wrap {
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn {
      box-sizing: border-box;
      width: 130px;
      height: 44px;
      border-radius: 100px;
      text-align: center;
      line-height: 44px;
      cursor: pointer;

      user-select: none;

      &.return {
        border: 1px solid rgba(153, 153, 153, 0.3);
        background: #ffffff;
        color: #666;
        font-size: 14px;
      }
      &.next {
        background: $theme-color-gold;
        color: white;
        font-weight: 700;
        font-size: 16px;
        &.hiddenCancel {
          width: 100%;
        }
      }
    }
  }
}
</style>
