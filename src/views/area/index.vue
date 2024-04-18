<template>
  <div class="tab-list">
    <div
      v-for="(item, index) in areaList"
      :key="index"
      class="tab"
      :class="{ active: router.currentRoute.value.params.id === item.id + '' }"
      @click.prevent="changeArea(item)"
    >
      {{ item.name }}
    </div>
  </div>

  <router-view></router-view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { fetchAreaList } from '@/api/area';
import { IArea } from '@/interface';
import router, { routerName } from '@/router';

const areaList = ref<IArea[]>([]);

function changeArea(item: IArea) {
  router.push({ name: routerName.areaDetail, params: { id: item.id } });
}

async function getAreaList() {
  const res = await fetchAreaList();
  if (res.code === 200) {
    areaList.value = res.data.rows;
    router.push({
      name: routerName.areaDetail,
      params: { id: areaList.value[0].id },
    });
  }
}

onMounted(() => {
  getAreaList();
});
</script>

<style lang="scss" scoped>
.tab-list {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  height: 40px;
  font-size: 14px;
  padding: 0 30px;

  user-select: none;
  .tab {
    position: relative;
    margin-right: 20px;
    cursor: pointer;
    &.active {
      color: $theme-color-gold;
      font-size: 16px;

      &::after {
        position: absolute;
        bottom: -6px;
        left: 50%;
        width: 20px;
        height: 2px;
        border-radius: 10px;
        background-color: $theme-color-gold;
        content: '';
        transform: translateX(-50%);
      }
    }
  }
}
</style>
