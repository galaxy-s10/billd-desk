<template>
  <div class="h5-area-wrap">
    <div class="title">{{ route.query.name }}</div>
    <div class="live-room-list">
      <div
        v-for="(iten, indey) in liveRoomList"
        :key="indey"
        class="live-room"
        @click="goRoom(iten)"
      >
        <div
          class="cover"
          :style="{
            backgroundImage: `url('${
              iten?.cover_img || iten?.users?.[0].avatar
            }')`,
          }"
        >
          <PullAuthTip
            v-if="
              iten?.pull_is_should_auth === LiveRoomPullIsShouldAuthEnum.yes
            "
          ></PullAuthTip>
          <div
            v-if="iten?.live"
            class="living-ico"
          >
            <div class="live-txt">直播中</div>
          </div>
          <div
            v-if="
              iten?.cdn === LiveRoomUseCDNEnum.yes ||
              [
                LiveRoomTypeEnum.tencent_css,
                LiveRoomTypeEnum.tencent_css_pk,
              ].includes(iten.type!)
            "
            class="cdn-ico"
          >
            <div class="txt">CDN</div>
          </div>
          <div class="txt">{{ iten?.users?.[0].username }}</div>
        </div>
        <div class="desc">{{ iten?.name }}</div>
      </div>
      <div
        v-if="!liveRoomList.length"
        class="null"
      >
        {{ t('common.nonedata') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { fetchLiveRoomList } from '@/api/area';
import router, { routerName } from '@/router';
import {
  ILiveRoom,
  LiveRoomIsShowEnum,
  LiveRoomPullIsShouldAuthEnum,
  LiveRoomTypeEnum,
  LiveRoomUseCDNEnum,
} from '@/types/ILiveRoom';

const liveRoomList = ref<ILiveRoom[]>([]);
const { t } = useI18n();

const route = useRoute();
function goRoom(item: ILiveRoom) {
  if (!item.live) {
    window.$message.info('该直播间没在直播~');
    return;
  }
  router.push({
    name: routerName.h5Room,
    params: { roomId: item.id },
  });
}

onMounted(() => {
  getData();
});

async function getData() {
  const res = await fetchLiveRoomList({
    id: Number(route.params.id),
    live_room_is_show: LiveRoomIsShowEnum.yes,
  });
  if (res.code === 200) {
    liveRoomList.value = res.data.rows;
  }
}
</script>

<style lang="scss" scoped>
.h5-area-wrap {
  padding: 0 20px;
  .title {
    margin-bottom: 10px;
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
          padding: 0 6px;
          border-radius: 8px 0 10px;
          background-color: $theme-color-gold;
          color: white;
          text-align: center;
          font-size: 12px;
          .live-txt {
            transform-origin: center !important;

            @include minFont(10);
          }
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
        margin-top: 4px;
        font-size: 14px;

        @extend %singleEllipsis;
      }
    }
  }
}
</style>
