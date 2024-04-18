<template>
  <div class="no-live-tip-modal">
    <Modal
      title="提示"
      :mask-closable="false"
      @close="emits('close')"
    >
      <div>直播已结束</div>
      <template #footer></template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    msg?: string;
  }>(),
  {
    msg: '',
  }
);
const emits = defineEmits(['close', 'ok']);
</script>

<style lang="scss" scoped>
.no-live-tip-modal {
}
</style>
