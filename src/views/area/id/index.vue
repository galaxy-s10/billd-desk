<template>
  <div class="area-wrap">
    <div class="wrap">
      <div
        v-loading="loading"
        class="live-room-list"
      >
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
              直播中
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
    <div
      class="paging-wrap"
      v-if="pageParams.total > pageParams.pageSize"
    >
      <n-pagination
        v-model:page="pageParams.nowPage"
        v-model:page-size="pageParams.pageSize"
        :item-count="pageParams.total"
        show-size-picker
        :page-sizes="[30, 50, 100, 200]"
        @update-page="getData"
        @update-page-size="handleUpdatePageSize"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
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

const loading = ref(false);
const pageParams = reactive({
  nowPage: 1,
  pageSize: 30,
  total: 0,
  hasMore: false,
});

watch(
  () => route.params.id,
  (newVal) => {
    if (!newVal) return;
    pageParams.nowPage = 1;
    getData();
  }
);

function handleUpdatePageSize(v) {
  pageParams.nowPage = 1;
  pageParams.pageSize = v;
  getData();
}

function goRoom(item: ILiveRoom) {
  if (!item.live) {
    window.$message.info('该直播间没在直播~');
    return;
  }
  router.push({
    name: routerName.pull,
    params: { roomId: item.id },
  });
}

onMounted(() => {
  getData();
});

async function getData() {
  try {
    loading.value = true;
    const res = await fetchLiveRoomList({
      id: Number(route.params.id),
      live_room_is_show: LiveRoomIsShowEnum.yes,
      nowPage: pageParams.nowPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200) {
      liveRoomList.value = res.data.rows;
      pageParams.total = res.data.total;
      pageParams.hasMore = res.data.hasMore;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.area-wrap {
  .wrap {
    margin-top: 10px;
    padding: 0 20px;
    .live-room-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .live-room {
        display: inline-block;
        margin-right: 25px;
        margin-bottom: 12px;
        width: 300px;
        cursor: pointer;
        .cover {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 150px;
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
            top: -10px;
            right: -10px;
            z-index: 2;
            width: 70px;
            height: 28px;
            background-color: #f87c48;
            color: white;
            transform: rotate(45deg);
            transform-origin: bottom;
            .txt {
              margin-left: 18px;
              background-image: initial !important;
              font-size: 13px;
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
  .paging-wrap {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
