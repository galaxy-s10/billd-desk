<template>
  <div></div>
</template>

<script lang="ts" setup>
import { useMessage, useNotification } from 'naive-ui';

window.$message = useMessage();
window.$notification = useNotification();
</script>

<style lang="scss" scoped></style>
