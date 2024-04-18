<template>
  <div class="order-wrap">
    <h2 class="title">
      我的钱包：<span class="val">{{
        formatMoney(userStore.userInfo?.wallet?.balance)
      }}</span>
      元
    </h2>
    <div class="list">
      <div class="head-wrap">
        <div
          v-for="(item, index) in headList"
          :key="index"
          class="head"
        >
          <div>{{ item.label }}</div>
        </div>
      </div>
      <div
        v-for="(item, index) in walletRecordList"
        :key="index"
        class="item"
      >
        <div>{{ item.created_at }}</div>
        <div>{{ item.order_id || '无' }}</div>
        <div>{{ typeMap[item.type!] }}</div>
        <div>{{ item.name }}</div>
        <div>
          <span>{{
            item.amount_status === WalletRecordAmountStatusEnum.add ? '+' : '-'
          }}</span>
          <span>{{ formatMoney(item.amount) }}元</span>
        </div>
      </div>
      <div v-if="!walletRecordList.length">{{ t('common.nonedata') }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { fetchWalletRecordMyList } from '@/api/walletRecord';
import { fullLoading } from '@/components/FullLoading';
import {
  IWalletRecord,
  WalletRecordAmountStatusEnum,
  WalletRecordEnum,
} from '@/interface';
import { useUserStore } from '@/store/user';
import { formatMoney } from '@/utils';

const userStore = useUserStore();
const walletRecordList = ref<IWalletRecord[]>([]);
const { t } = useI18n();

const headList = ref([
  {
    label: '创建时间',
    key: 'created_at',
  },
  {
    label: '订单id',
    key: 'order_id',
  },
  {
    label: '类型',
    key: 'type',
  },
  {
    label: '名称',
    key: 'name',
  },
  {
    label: '金额',
    key: 'amount',
  },
]);

const typeMap = {
  [WalletRecordEnum.recharge]: '充值',
  [WalletRecordEnum.reward]: '打赏',
  [WalletRecordEnum.signin]: '签到',
};

onUnmounted(() => {});

onMounted(() => {
  getPayList();
});

async function getPayList() {
  try {
    fullLoading({ loading: true });
    const res = await fetchWalletRecordMyList({});
    if (res.code === 200) {
      walletRecordList.value = res.data.rows;
    }
  } catch (error) {
    console.log(error);
  } finally {
    fullLoading({ loading: false });
  }
}
</script>

<style lang="scss" scoped>
.order-wrap {
  padding: 0px 30px 0;
  .title {
    text-align: center;
    .val {
      color: $theme-color-gold;
    }
  }
  .list {
    text-align: center;

    .head-wrap {
      display: flex;
      align-items: center;
      .head {
        flex: 1;
        box-sizing: border-box;
        margin-bottom: 5px;
      }
    }
    .item {
      display: flex;
      align-items: center;
      height: 40px;
      color: #666;
      > div {
        display: flex;
        align-items: center;
        flex: 1;
        justify-content: center;
      }
      &:nth-child(2n) {
        background-color: #fafbfc;
      }
    }
  }
}
</style>
