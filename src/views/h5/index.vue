<template>
  <div class="h5-wrap">
    <div
      class="swiper"
      :style="{ backgroundImage: `url(${currentSwiper.bgi})` }"
    >
      <!-- {{ currentSwiper.txt }} -->
    </div>

    <div class="type-list">
      <div
        v-for="(item, index) in liveRoomList"
        :key="index"
        class="item"
      >
        <div
          class="title"
          @click.stop
        >
          <div class="left">{{ item.name }}</div>
          <div
            class="right"
            @click="showAll(item)"
          >
            查看全部
          </div>
        </div>
        <div class="live-room-list">
          <div
            v-for="(iten, indey) in item.area_live_rooms"
            :key="indey"
            class="live-room"
            @click="goRoom(iten)"
          >
            <div
              class="cover"
              :style="{
                backgroundImage: `url('${
                  iten.live_room?.cover_img || iten.live_room?.users?.[0].avatar
                }')`,
              }"
            >
              <PullAuthTip
                v-if="
                  iten?.live_room?.pull_is_should_auth ===
                  LiveRoomPullIsShouldAuthEnum.yes
                "
              ></PullAuthTip>
              <div
                v-if="iten?.live_room?.live"
                class="living-ico"
              >
                直播中
              </div>
              <div
                v-if="
                  iten.live_room?.cdn === LiveRoomUseCDNEnum.yes ||
                  [
                    LiveRoomTypeEnum.tencent_css,
                    LiveRoomTypeEnum.tencent_css_pk,
                  ].includes(iten.live_room?.type!)
                "
                class="cdn-ico"
              >
                <div class="txt">CDN</div>
              </div>
              <div class="txt">{{ iten.live_room?.users?.[0].username }}</div>
            </div>
            <div class="desc">{{ iten.live_room?.name }}</div>
          </div>
          <div
            v-if="!item.area_live_rooms?.length"
            class="null"
          >
            {{ t('common.nonedata') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { fetchAreaLiveRoomList } from '@/api/area';
import { QINIU_RESOURCE } from '@/constant';
import { IArea, IAreaLiveRoom } from '@/interface';
import router, { mobileRouterName, routerName } from '@/router';
import { useAppStore } from '@/store/app';
import {
  LiveRoomIsShowEnum,
  LiveRoomPullIsShouldAuthEnum,
  LiveRoomTypeEnum,
  LiveRoomUseCDNEnum,
} from '@/types/ILiveRoom';

const appStore = useAppStore();
const liveRoomList = ref<IArea[]>([]);
const { t } = useI18n();

const swiperList = ref([
  {
    id: 1,
    txt: '广告位1',
    bgi: `${QINIU_RESOURCE.url}/billd-live/image/ecdece08eb3eda2f37433cb7c748766f.webp`,
    url: '',
  },
  {
    id: 2,
    txt: '广告位2',
    bgi: `${QINIU_RESOURCE.url}/billd-live/image/b2e3459e7d4a70463cd201ee468491a1.webp`,
    url: '',
  },
  {
    id: 3,
    txt: '广告位3',
    bgi: `${QINIU_RESOURCE.url}/billd-live/image/71d01ff0bd34c57586500e425e21938f.webp`,
    url: '',
  },
]);
const swiperTimer = ref();
const currentSwiper = ref(swiperList.value[0]);

async function getLiveRoomList() {
  try {
    const res = await fetchAreaLiveRoomList({
      live_room_is_show: LiveRoomIsShowEnum.yes,
      orderName: 'created_at',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      liveRoomList.value = res.data.rows;
    }
  } catch (error) {
    console.log(error);
  }
}

function showAll(item: IArea) {
  router.push({
    name: mobileRouterName.h5Area,
    params: { id: item.id },
  });
}

function goRoom(item: IAreaLiveRoom) {
  if (!item.live_room?.live) {
    window.$message.info('该直播间没在直播~');
    return;
  }
  router.push({
    name: routerName.h5Room,
    params: { roomId: item.live_room_id },
  });
}

onMounted(() => {
  getLiveRoomList();
  let num = 0;
  swiperTimer.value = setInterval(() => {
    num += 1;
    if (num > swiperList.value.length - 1) {
      num = 0;
    }
    currentSwiper.value = swiperList.value[num];
  }, 3000);
});

onUnmounted(() => {
  clearInterval(swiperTimer.value);
  appStore.showLoginModal = false;
});
</script>

<style lang="scss" scoped>
.h5-wrap {
  background-color: #f4f4f4;
  .logo-bar {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    height: 40px;
    border-bottom: 1px solid #e7e7e7;
    background-color: white;
    .logo {
      width: 90px;
      height: 36px;

      @include setBackground('@/assets/img/logo-txt.png');
    }
  }
  .nav-list {
    display: flex;
    align-items: center;
    height: 40px;
    background-color: white;
    line-height: 40px;
    .item {
      position: relative;
      margin: 0 20px;
      &.active {
        &::after {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 4px;
          background-color: $theme-color-gold;
          content: '';
        }
      }
    }
  }
  .swiper {
    width: 100%;
    height: 180px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .type-list {
    .item {
      margin: 15px 0;
      padding: 15px;
      background-color: white;

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .left {
        }
        .right {
          color: #999;
          font-size: 14px;
        }
      }
      .live-room-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        .live-room {
          display: inline-block;
          margin-bottom: 10px;
          width: 48%;
          height: 130px;

          .cover {
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 100px;
            border-radius: 8px;
            background-position: center center;
            background-size: cover;
            .living-ico {
              position: absolute;
              top: 0px;
              left: 0px;
              z-index: 10;
              padding: 0 10px;
              height: 20px;
              border-radius: 8px 0 10px;
              background-color: $theme-color-gold;
              color: white;
              text-align: center;
              font-size: 12px;
              line-height: 20px;
            }
            .cdn-ico {
              position: absolute;
              top: -12px;
              right: -12px;
              z-index: 2;
              width: 70px;
              height: 22px;
              background-color: #f87c48;
              transform: rotate(45deg);
              transform-origin: bottom;

              .txt {
                margin-left: 18px;
                background-image: initial !important;
                color: white;
                font-size: 10px;
                transform: scale(0.83333) translate(2px, 3px);
              }
            }

            .txt {
              position: absolute;
              bottom: 0;
              left: 0;
              box-sizing: border-box;
              padding: 4px 8px;
              width: 100%;
              border-radius: 0 0 4px 4px;
              background-image: linear-gradient(
                -180deg,
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 0.6)
              );
              color: white;
              text-align: initial;
              font-size: 13px;

              @extend %singleEllipsis;
            }
          }
          .desc {
            font-size: 14px;
            margin-top: 4px;
            @extend %singleEllipsis;
          }
        }
      }
    }
  }
}
</style>
