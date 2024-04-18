<template>
  <div class="qr-pay-wrap">
    <div class="money">
      {{ t('common.payMoney', { money: formatMoney(props.money) }) }}
    </div>
    <div
      class="qrcode-wrap"
      v-loading="loading"
    >
      <img
        v-if="aliPayBase64 !== ''"
        class="qrcode"
        :src="aliPayBase64"
        alt=""
      />
      <template v-if="isExpired">
        <div class="mask">
          <div class="txt">二维码已过期</div>
        </div>
      </template>
      <template v-else-if="currentPayStatus !== PayStatusEnum.wait">
        <div class="mask">
          <div class="txt">
            {{
              currentPayStatus === PayStatusEnum.TRADE_SUCCESS
                ? '支付成功'
                : '等待支付'
            }}
          </div>
        </div>
      </template>
    </div>
    <div v-if="aliPayBase64 !== ''">
      <div class="bottom">
        <div class="sao">
          {{ t('common.aliPayScanTip') }}
        </div>
        <div
          class="expr"
          v-if="!isExpired"
        >
          {{
            t('common.aliPayScanTip', {
              minutes: 5,
            })
          }}（{{
            formatDownTime({
              endTime: downTimeEnd,
              startTime: downTimeStart,
            })
          }}）
        </div>
        <div
          class="expr"
          v-else
        >
          <span
            class="link"
            @click="handleStartPay"
          >
            点击重新获取
          </span>
        </div>
      </div>
    </div>

    <h3
      v-if="currentPayStatus === PayStatusEnum.WAIT_BUYER_PAY"
      class="tip"
    >
      ps：支付宝标题显示：东圃牛杂档，是正常的~
    </h3>
  </div>
</template>

<script lang="ts" setup>
import { hrefToTarget, isMobile } from 'billd-utils';
import QRCode from 'qrcode';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { fetchAliPay, fetchAliPayStatus } from '@/api/order';
import { PayStatusEnum } from '@/interface';
import { useUserStore } from '@/store/user';
import { formatDownTime, formatMoney } from '@/utils';

const userStore = useUserStore();
const aliPayBase64 = ref('');
const payStatusTimer = ref();
const downTimer = ref();
const downTimeStart = ref();
const downTimeEnd = ref();
const loading = ref(false);
const isExpired = ref(false);

const currentPayStatus = ref(PayStatusEnum.wait);
const { t } = useI18n();
const props = withDefaults(
  defineProps<{
    money: number;
    goodsId: number;
    liveRoomId: number;
  }>(),
  {
    money: 0,
    goodsId: -1,
    liveRoomId: -1,
  }
);

onUnmounted(() => {
  clearInterval(payStatusTimer.value);
  clearInterval(downTimer.value);
});

onMounted(() => {
  handleStartPay();
});

async function generateQR(text) {
  let base64 = '';
  try {
    base64 = await QRCode.toDataURL(text, {
      margin: 1,
    });
  } catch (err) {
    console.error('生成二维码失败！', err);
  }
  return base64;
}

function handleDownTime() {
  clearInterval(downTimer.value);
  const nowTime = Math.floor(Date.now() / 1000) * 1000;
  downTimeEnd.value = nowTime + 1000 * 60 * 5;
  downTimeStart.value = nowTime;
  downTimer.value = setInterval(() => {
    if (downTimeEnd.value - downTimeStart.value <= 0) {
      clearInterval(downTimer.value);
      isExpired.value = true;
    }
    downTimeStart.value = Math.floor(Date.now() / 1000) * 1000;
  }, 1000);
}

async function handleStartPay() {
  loading.value = true;
  aliPayBase64.value = '';
  isExpired.value = false;
  currentPayStatus.value = PayStatusEnum.wait;
  clearInterval(payStatusTimer.value);
  clearInterval(downTimer.value);
  try {
    const res = await fetchAliPay({
      money: props.money,
      goodsId: props.goodsId,
      liveRoomId: props.liveRoomId,
    });
    if (res.code === 200) {
      if (isMobile()) {
        hrefToTarget(res.data.qr_code);
        return;
      }
      const base64 = await generateQR(res.data.qr_code);
      aliPayBase64.value = base64;
      getPayStatus(res.data.out_trade_no);
      handleDownTime();
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

function getPayStatus(outTradeNo: string) {
  clearInterval(payStatusTimer.value);
  payStatusTimer.value = setInterval(async () => {
    try {
      const res = await fetchAliPayStatus({
        out_trade_no: outTradeNo,
      });
      if (res.data.tradeStatus === PayStatusEnum.WAIT_BUYER_PAY) {
        currentPayStatus.value = PayStatusEnum.WAIT_BUYER_PAY;
        console.log('等待支付');
      }
      if (res.data.tradeStatus === PayStatusEnum.TRADE_SUCCESS) {
        currentPayStatus.value = PayStatusEnum.TRADE_SUCCESS;
        clearInterval(downTimer.value);
        clearInterval(payStatusTimer.value);
        userStore.updateMyWallet();
        console.log('支付成功！');
      }
    } catch (error) {
      console.log(error);
    }
  }, 2000);
}
</script>

<style lang="scss" scoped>
.qr-pay-wrap {
  padding: 10px;
  .money {
    text-align: center;
    font-size: 20px;
  }
  .qrcode-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    margin: 0 auto;
    width: 140px;
    height: 140px;

    .mask {
      position: absolute !important;
      display: flex;
      align-items: center;
      justify-content: center;

      @extend %maskBg;
      .txt {
        color: white;
        font-weight: bold;
      }
    }
  }
  .tip {
    text-align: center;
  }
  .bottom {
    margin-top: 2px;
    width: 100%;
    text-align: center;
    font-size: 14px;
    .link {
      cursor: pointer;
      color: $theme-color-gold;
    }
  }
}
</style>
