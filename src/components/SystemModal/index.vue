<template>
  <div>
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 500px"
        title="提示"
        role="dialog"
        closable
        @close="showModal = false"
      >
        <div>
          欢迎进入直播间，遇到问题请提<a
            href="https://github.com/galaxy-s10/billd-live/issues/new"
            target="_blank"
          >
            issue
          </a>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const showModal = ref(true);
</script>

<style lang="scss" scoped></style>
