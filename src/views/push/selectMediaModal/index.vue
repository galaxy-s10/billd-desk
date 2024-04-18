<template>
  <div class="select-media-wrap">
    <Modal
      title="选择直播素材"
      :mask-closable="false"
      @close="emits('close')"
      :width="'350px'"
    >
      <div class="btn-wrap">
        <div
          class="btn"
          v-for="(item, index) in allMediaTypeList"
          :key="index"
        >
          <n-button @click="emits('ok', item.type)">
            {{ item.txt }}
          </n-button>
        </div>
      </div>

      <template #footer></template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { MediaTypeEnum } from '@/interface';

withDefaults(
  defineProps<{
    allMediaTypeList: {
      [index: string]: {
        type: MediaTypeEnum;
        txt: string;
      };
    };
  }>(),
  {}
);
const emits = defineEmits(['close', 'ok']);
</script>

<style lang="scss" scoped>
.select-media-wrap {
  .btn-wrap {
    display: flex;
    flex-wrap: wrap;

    .btn {
      margin-right: 12px;
      margin-bottom: 12px;
    }
  }
}
</style>
