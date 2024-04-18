<template>
  <div class="recharge-wrap">
    <n-modal
      v-model:show="showModal"
      style="width: 600px"
      title="充值"
      preset="card"
      class="container"
      @update:show="handleOnClose"
    >
      <n-input-group>
        <n-input-group-label>
          金额（{{ minMoney }}-{{ maxMoney }}元）
        </n-input-group-label>
        <n-input-number
          v-model:value="money"
          :precision="2"
          :min="minMoney"
          :max="maxMoney"
          :placeholder="'请输入金额'"
          clearable
        >
          <template #prefix>￥</template>
          <template #suffix>元</template>
        </n-input-number>
        <n-button
          type="primary"
          @click="startPay"
        >
          充值
        </n-button>
      </n-input-group>

      <QrPayCpt
        v-if="showQrPay"
        :money="goodsInfo.money"
        :goods-id="goodsInfo.goodsId"
        :live-room-id="goodsInfo.liveRoomId"
      ></QrPayCpt>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref, watch } from 'vue';

import { fetchFindByTypeGoods } from '@/api/goods';
import QrPayCpt from '@/components/QrPay/index.vue';
import { GoodsTypeEnum } from '@/interface';

const showModal = ref(false);
const maxMoney = 200;
const minMoney = 0.1;
const money = ref(1);

const showQrPay = ref(false);
const goodsInfo = reactive({
  money: 0,
  goodsId: -1,
  liveRoomId: -1,
});

const props = withDefaults(
  defineProps<{
    show: boolean;
  }>(),
  {
    show: false,
  }
);

const emits = defineEmits(['close']);

watch(
  () => props.show,
  (v) => {
    showModal.value = v;
  }
);

function handleOnClose(v) {
  emits('close', v);
  showQrPay.value = false;
}

async function startPay() {
  if (money.value < minMoney) {
    window.$message.warning(`最少充值${minMoney}元！`);
    return;
  }
  const res = await fetchFindByTypeGoods(GoodsTypeEnum.recharge);
  if (res.code === 200) {
    showQrPay.value = false;
    nextTick(() => {
      goodsInfo.money = money.value * 100;
      goodsInfo.goodsId = res.data.id!;
      showQrPay.value = true;
    });
  }
}
</script>

<style lang="scss" scoped>
.recharge-wrap {
  position: fixed;
  .title {
    display: flex;
    align-items: center;
  }
}
</style>
