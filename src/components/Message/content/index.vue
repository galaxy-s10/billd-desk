<template>
  <div></div>
</template>

<script lang="ts">
import { useMessage } from 'naive-ui';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {},
  setup() {
    // @ts-ignore
    window.$message = useMessage();
  },
});
</script>

<style lang="scss" scoped></style>
