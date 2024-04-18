<template>
  <div class="openMicophoneTip-wrap">
    <Modal
      title="提示"
      :mask-closable="false"
      @close="emits('close')"
    >
      <div class="container">
        <p>采集麦克风声音失败，请确认是否授权!</p>
      </div>
      <template #footer></template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

const emits = defineEmits(['close']);

onMounted(() => {});
</script>

<style lang="scss" scoped>
.openMicophoneTip-wrap {
  text-align: initial;

  .container {
    padding-top: 10px;
  }
}
</style>
