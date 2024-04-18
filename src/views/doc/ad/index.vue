<template>
  <div class="ad-wrap">
    <h1 class="title">广告位招租</h1>
    <h3 class="title">
      billd-live服务器：阿里云轻量服务器：2核cpu、2GB内存、30M带宽（香港）
    </h3>

    <div class="ad-list">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item"
        @click="openToTarget(item.url)"
      >
        <div>
          <img
            class="cover"
            :src="item.cover"
            alt=""
          />
        </div>
        <div>
          <div>{{ item.name }}</div>
          <div
            v-for="(iten, indey) in item.list"
            :key="indey"
            class="hot"
          >
            {{ iten }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { ref } from 'vue';

const list = ref([
  {
    // eslint-disable-next-line
    cover: require('@/assets/img/ad/tencent-1.jpg'),
    name: '【腾讯云】个人开发者 买赠福利专区 买即送 个人开发者专享免费服务器3个月！',
    list: [
      '【腾讯云】：1年轻量服务器 2核cpu、2G内存、4M带宽、50G系统盘（上海/广州/北京），132元！',
      '【腾讯云】：1年轻量服务器 2核cpu、4G内存、5M带宽、60G系统盘（上海/广州/北京），198元！',
    ],
    url: 'https://cloud.tencent.com/act/cps/redirect?redirect=35916&cps_key=ebe55ad4d940d688bcde548b101dff5f',
  },
  {
    // eslint-disable-next-line
    cover: require('@/assets/img/ad/tencent-2.png'),
    name: '【腾讯云】爆品抢先购，预热专属折上折券限时领！',
    list: [
      '【腾讯云】：1年轻量服务器 2核cpu、2G内存、3M带宽、40G系统盘（上海/广州/北京），95元！',
      '【腾讯云】：1年轻量服务器 2核cpu、4G内存、5M带宽、60G系统盘（上海/广州/北京），168元！',
      '【腾讯云】：3年轻量服务器 2核cpu、2G内存、4M带宽、50G系统盘（上海/广州/北京），396元！',
      '【腾讯云】：3年轻量服务器 2核cpu、4G内存、5M带宽、60G系统盘（上海/广州/北京），628元！',
    ],
    url: 'https://cloud.tencent.com/act/cps/redirect?redirect=35864&cps_key=ebe55ad4d940d688bcde548b101dff5f',
  },
  {
    // eslint-disable-next-line
    cover: require('@/assets/img/ad/tencent-3.jpg'),
    name: '【腾讯云】推广者专属福利，新客户无门槛领取总价值高达2860元代金券，每种代金券限量500张，先到先得。',
    list: [
      '【腾讯云】满200减100，仅用于非促销新购云服务器、MySQL数据库',
      '【腾讯云】满500减250，仅用于非促销新购云服务器、MySQL数据库',
      '【腾讯云】满1000减500，仅用于非促销新购云服务器、MySQL数据库',
      '【腾讯云】满2000减1000，仅用于非促销新购云服务器、MySQL数据库',
    ],
    url: 'https://cloud.tencent.com/act/cps/redirect?redirect=35834&cps_key=ebe55ad4d940d688bcde548b101dff5f',
  },
  {
    // eslint-disable-next-line
    cover: require('@/assets/img/ad/aliyun-1.png'),
    name: '云小站特惠超底价',
    url: 'https://www.aliyun.com/minisite/goods?userCode=41m2k6bt',
  },
  {
    // eslint-disable-next-line
    cover: require('@/assets/img/ad/aliyun-2.jpg'),
    name: '云服务器t6 2核2G低至10.14元/月',
    url: 'https://www.aliyun.com/daily-act/ecs/activity_share?userCode=41m2k6bt',
  },
  {
    // eslint-disable-next-line
    cover: require('@/assets/img/ad/qiniu-1.jpg'),
    name: '新人免费 CDN（全球2000+节点无盲区覆盖，注册即可免费使用）',
    url: 'https://s.qiniu.com/Q7zqeq',
  },
  {
    // eslint-disable-next-line
    cover: require('@/assets/img/ad/qiniu-2.jpg'),
    name: '对象存储新人好礼（10年专注云存储，注册即可免费使用）',
    url: 'https://s.qiniu.com/iQR7Jz',
  },
  {
    // eslint-disable-next-line
    cover: require('@/assets/img/ad/qiniu-3.jpg'),
    name: '新人免费试用（多款云产品长期免费使用，注册即享超值赠送）',
    url: 'https://s.qiniu.com/JnIbyq',
  },
  {
    // eslint-disable-next-line
    cover: require('@/assets/img/ad/qiniu-4.jpg'),
    name: '新人免费云主机（注册免费领取 4核8G 云服务器，享免费数据迁移服务）',
    url: 'https://s.qiniu.com/B3i63y',
  },
]);
</script>

<style lang="scss" scoped>
.ad-wrap {
  .title {
    text-align: center;
  }
  .ad-list {
    padding: 20px;

    .item {
      display: flex;
      align-items: center;
      margin-right: 20px;
      padding: 10px;
      border-radius: 10px;
      box-shadow: 0 4px 30px 0 rgba(238, 242, 245, 0.8);
      cursor: pointer;
      transition: box-shadow 0.2s linear;
      margin-top: 10px;
      margin-bottom: 10px;
      &:hover {
        box-shadow: 4px 4px 20px 0 rgba(205, 216, 228, 0.6);
      }
      .cover {
        width: 300px;
        margin-right: 10px;
      }
      .hot {
        color: red;
      }
    }
  }
}
</style>
