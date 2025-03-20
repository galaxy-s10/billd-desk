<template>
  <div></div>
</template>

<script lang="ts">
export default {
  name: 'naiveuiNotification',
};
</script>

<script lang="ts" setup>
import { useNotification } from 'naive-ui';

window.$notification = useNotification();
</script>

<style lang="scss" scoped></style>
