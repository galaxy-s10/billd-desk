<template>
  <n-modal
    v-model:show="showModal"
    title="公告"
    preset="dialog"
    positive-text="OK"
  >
    <p></p>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const showModal = ref(false);
// const showModal = ref(true);
// const showModal = ref(router.currentRoute.value.name === routerName.home);
</script>

<style lang="scss" scoped>
.link {
  color: $theme-color-gold;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}
.hot {
  color: red;
}
</style>
