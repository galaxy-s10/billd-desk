<template>
  <div></div>
</template>

<script lang="ts">
export default {
  name: 'naiveuiModal',
};
</script>

<script lang="ts" setup>
import { useModal } from 'naive-ui';

window.$modal = useModal();
</script>

<style lang="scss" scoped></style>
