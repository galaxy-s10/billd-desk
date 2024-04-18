<template>
  <div class="order-wrap">
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
        v-for="(item, index) in payList"
        :key="index"
        class="item"
      >
        <div class="time">{{ item.created_at }}</div>
        <div class="user">
          <template v-if="item.user">
            <img
              :src="item.user.avatar"
              class="avatar"
              alt=""
            />
            <span class="username">{{ item.user.username }}</span>
          </template>
          <span v-else>游客</span>
        </div>

        <div class="account">{{ item.buyer_logon_id }}</div>
        <div class="gift">{{ item.billd_live_order_subject }}</div>
        <div class="gift">{{ item.total_amount }}元</div>
        <div class="status">
          {{
            item.trade_status === PayStatusEnum.WAIT_BUYER_PAY
              ? '支付中'
              : '已支付'
          }}
        </div>
        <div class="time">{{ item.send_pay_date || '-' }}</div>
      </div>
      <div v-if="!payList.length">{{ t('common.nonedata') }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { fetchOrderList } from '@/api/order';
import { fullLoading } from '@/components/FullLoading';
import { IOrder, PayStatusEnum } from '@/interface';

const payList = ref<IOrder[]>([]);
const { t } = useI18n();

const headList = ref([
  {
    label: '创建时间',
    key: 'created_at',
  },
  {
    label: '用户',
    key: 'avatar',
  },
  {
    label: '支付宝账号',
    key: 'buyer_logon_id',
  },
  {
    label: '商品',
    key: 'subject',
  },
  {
    label: '价格',
    key: 'total_amount',
  },
  {
    label: '状态',
    key: 'trade_status',
  },
  {
    label: '完成时间',
    key: 'send_pay_date',
  },
]);

onUnmounted(() => {});

onMounted(() => {
  getPayList();
});

async function getPayList() {
  try {
    fullLoading({ loading: true });
    const res = await fetchOrderList({
      trade_status: PayStatusEnum.TRADE_SUCCESS,
    });
    if (res.code === 200) {
      payList.value = res.data.rows;
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
  padding: 50px 30px 0;
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
      .time {
      }
      .user {
        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
