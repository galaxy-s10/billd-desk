<template>
  <div
    class="profile-wrap"
    v-loading="getUserLoading"
  >
    <div class="uid">用户id：{{ userInfo?.id }}</div>
    <div class="avatar">
      <span class="txt">用户头像：</span>
      <Avatar
        :avatar="userInfo?.avatar"
        :size="30"
      ></Avatar>
    </div>
    <div class="username">用户昵称：{{ userInfo?.username }}</div>
    <br />
    <div class="pull-url">
      <span
        v-if="!userInfo?.live_rooms?.length"
        class="link"
        @click="openLiveRoom"
      >
        未开通
      </span>
      <div v-else>
        <div>
          直播间地址：
          <a
            :href="getLiveRoomPageUrl(userInfo?.live_rooms?.[0].id!)"
            class="link"
            target="_blank"
          >
            {{ getLiveRoomPageUrl(userInfo?.live_rooms?.[0].id!) }}
          </a>
        </div>
        <div>直播间名称：{{ userInfo?.live_rooms?.[0].name }}</div>
        <div>直播间简介：{{ userInfo?.live_rooms?.[0].desc }}</div>
        <div>
          直播间分区：{{ userInfo.live_rooms[0].areas?.[0].name || '暂无分区' }}
        </div>
        <div
          v-if="
            userStore.userInfo?.id === userInfo.id &&
            userStore.auths?.find(
              (v) => v.auth_value === DEFAULT_AUTH_INFO.LIVE_PUSH.auth_value
            )
          "
          class="rtmp-url-wrap"
          v-loading="updateKeyLoading"
        >
          <div>
            <span>RTMP推流地址：{{ pushRes?.push_rtmp_url! }}，</span>
            <span
              class="link"
              @click="handleCopy(pushRes?.push_rtmp_url!)"
            >
              复制
            </span>
            <span>，</span>
            <span
              class="link"
              @click="handleUpdateKey"
            >
              更新
            </span>
          </div>
          <div>
            <span>OBS服务器：{{ pushRes?.push_obs_server! }}，</span>
            <span
              class="link"
              @click="handleCopy(pushRes?.push_obs_server!)"
            >
              复制
            </span>
          </div>
          <div>
            <span>OBS推流码：{{ pushRes?.push_obs_stream_key! }}，</span>
            <span
              class="link"
              @click="handleCopy(pushRes?.push_obs_stream_key!)"
            >
              复制
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { copyToClipBoard, openToTarget } from 'billd-utils';
import { ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchUpdateLiveRoomKey } from '@/api/liveRoom';
import { fetchFindUser } from '@/api/user';
import { DEFAULT_AUTH_INFO } from '@/constant';
import { loginTip } from '@/hooks/use-login';
import { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { IUser } from '@/types/IUser';
import { getLiveRoomPageUrl } from '@/utils';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const pushRes = ref();
const userId = ref(-1);
const userInfo = ref<IUser>();
const getUserLoading = ref(false);
const updateKeyLoading = ref(false);

watchEffect(() => {
  if (route.params.userId) {
    userId.value = Number(route.params.userId as string);
    handleUserInfo();
  }
});

watch(
  () => userStore.userInfo,
  (newval) => {
    if (newval) {
      pushRes.value = newval.live_rooms?.[0];
    }
  },
  { immediate: true }
);

async function handleUserInfo() {
  try {
    getUserLoading.value = true;
    const res = await fetchFindUser(userId.value);
    if (res.code === 200) {
      userInfo.value = res.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    getUserLoading.value = false;
  }
}

function handleCopy(url: string) {
  copyToClipBoard(url);
  window.$message.success('复制成功！');
}

function openLiveRoom() {
  if (!loginTip()) {
    return;
  }
  const url = router.resolve({
    name: routerName.push,
    query: { liveType: LiveRoomTypeEnum.srs },
  });
  openToTarget(url.href);
}

async function handleUpdateKey() {
  try {
    updateKeyLoading.value = true;
    const res = await fetchUpdateLiveRoomKey();
    if (res.code === 200) {
      pushRes.value = res.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    updateKeyLoading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.profile-wrap {
  position: relative;
  padding: 10px;
  .link {
    color: $theme-color-gold;
    text-decoration: none;
    cursor: pointer;
  }
  .avatar {
    display: flex;
    align-items: center;
    .txt {
      margin-right: 10px;
    }
  }
  .rtmp-url-wrap {
    position: relative;
  }
}
</style>
