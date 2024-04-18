<template>
  <div class="shop-wrap">
    <div class="tab-list">
      <div
        v-for="(item, index) in tabList"
        :key="index"
        class="tab"
        :class="{ active: item.key === currTab }"
        @click="changeTab(item.key)"
      >
        {{ item.label }}
      </div>
    </div>
    <div
      v-loading="loading"
      class="goods-list"
    >
      <div
        v-for="(item, index) in list"
        :key="index"
        class="goods"
        @click="startPay(item)"
      >
        <div
          class="left"
          :style="{ backgroundImage: `url(${item.cover})` }"
        >
          <div
            v-if="item.badge"
            class="badge"
            :style="{ backgroundColor: item.badge_bg }"
          >
            <div class="txt">{{ item.badge }}</div>
          </div>
        </div>
        <div class="right">
          <div class="title">{{ item.name }}</div>
          <div class="info">100%好评</div>
          <div class="desc">{{ item.desc }}</div>
          <div class="price-wrap">
            <span class="price">￥{{ formatMoney(item.price) }}</span>
            <del
              v-if="item.price !== item.original_price"
              class="original-price"
            >
              {{ formatMoney(item.original_price) }}
            </del>
          </div>
        </div>
      </div>
    </div>
    <QrPayCpt
      v-if="showQrPay"
      :money="goodsInfo.money"
      :goods-id="goodsInfo.goodsId"
      :live-room-id="goodsInfo.liveRoomId"
    ></QrPayCpt>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchGoodsList } from '@/api/goods';
import QrPayCpt from '@/components/QrPay/index.vue';
import { GoodsTypeEnum, IGoods } from '@/interface';
import router from '@/router';
import { formatMoney } from '@/utils';

const route = useRoute();
const list = ref<IGoods[]>([]);
const loading = ref(false);
const showQrPay = ref(false);
const goodsInfo = reactive({
  money: 0,
  goodsId: -1,
  liveRoomId: -1,
});

const tabList = ref([
  { label: '礼物', key: GoodsTypeEnum.gift },
  { label: '赞助', key: GoodsTypeEnum.sponsors },
  { label: '服务', key: GoodsTypeEnum.support },
]);

const currTab = ref(tabList.value[0].key);

async function getGoodsList(type: GoodsTypeEnum) {
  try {
    loading.value = true;
    const res = await fetchGoodsList({
      type,
      orderName: 'created_at',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      list.value = res.data.rows;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const key = route.query.goodsType as GoodsTypeEnum;
  if (GoodsTypeEnum[key]) {
    currTab.value = key;
  } else {
    router.push({ query: {} });
  }
  getGoodsList(currTab.value);
});

function changeTab(type: GoodsTypeEnum) {
  showQrPay.value = false;
  currTab.value = type;
  getGoodsList(currTab.value);
}

function startPay(item: IGoods) {
  if (item.price! <= 0) {
    window.$message.info('该商品是免费的，不需要购买！');
    return;
  }
  showQrPay.value = false;
  nextTick(() => {
    goodsInfo.money = item.price!;
    goodsInfo.goodsId = item.id!;
    showQrPay.value = true;
  });
}
</script>

<style lang="scss" scoped>
.shop-wrap {
  padding: 0 30px;
  .tab-list {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    height: 40px;
    font-size: 14px;

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
  .goods-list {
    display: flex;
    flex-wrap: wrap;
    .goods {
      display: flex;
      box-sizing: border-box;
      margin-right: 20px;
      margin-bottom: 20px;
      padding: 18px 10px 10px;
      width: 400px;
      border-radius: 6px;
      box-shadow: 0 4px 30px 0 rgba(238, 242, 245, 0.8);
      cursor: pointer;
      transition: box-shadow 0.2s linear;
      &:hover {
        box-shadow: 4px 4px 20px 0 rgba(205, 216, 228, 0.6);
      }
      .left {
        position: relative;
        margin-right: 20px;
        width: 100px;
        height: 100px;
        @extend %containBg;
        .badge {
          position: absolute;
          top: -10px;
          right: -10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 2px;
          color: white;
          .txt {
            display: inline-block;
            line-height: 1;
            transform-origin: center !important;

            @include minFont(10);
          }
        }
      }
      .right {
        .title {
          font-size: 22px;
        }
        .info {
        }
        .price-wrap {
          display: flex;
          align-items: center;
          .price {
            color: $theme-color-gold;
            font-size: 22px;
          }
          .original-price {
            margin-left: 5px;
            color: #666;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
