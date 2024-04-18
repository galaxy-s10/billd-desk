<template>
  <div
    class="pull-wrap"
    :class="{ isPageFull: appStore.videoControlsValue.pageFullMode }"
  >
    <div class="bg-img-wrap">
      <video
        v-if="configVideo && configVideo !== ''"
        class="bg-video"
        :src="configVideo"
        muted
        autoplay
        loop
      ></video>
      <div
        v-if="configBg && configBg !== ''"
        :style="{ backgroundImage: `url(${configBg})` }"
      ></div>
    </div>
    <div class="left">
      <div
        ref="topRef"
        class="head"
      >
        <div class="info">
          <div
            class="avatar"
            :style="{
              backgroundImage: `url(${anchorInfo?.avatar})`,
            }"
            @click="
              router.push({
                name: routerName.profile,
                params: { userId: anchorInfo?.id },
              })
            "
          ></div>
          <div class="detail">
            <div class="top">
              <div class="name">{{ anchorInfo?.username }}</div>
              <div class="follow">
                <div class="f-left">+关注</div>
                <div class="f-right">666</div>
              </div>
            </div>
            <div class="bottom">
              <span>{{ appStore.liveRoomInfo?.desc }}</span>
              <span v-if="NODE_ENV === 'development'">
                socketId:{{ mySocketId }}
              </span>
              <span
                class="area"
                @click="
                  router.push({
                    name: routerName.area,
                    query: { id: appStore.liveRoomInfo?.areas?.[0].id },
                  })
                "
              >
                {{ appStore.liveRoomInfo?.areas?.[0].name }}
              </span>
            </div>
          </div>
        </div>
        <div
          class="other"
          @click="handlePk"
        >
          <div class="top">
            <div
              class="item"
              v-if="NODE_ENV === 'development'"
            >
              {{ liveRoomTypeEnumMap[appStore.liveRoomInfo?.type || ''] }}
            </div>
            <div class="item">666人看过</div>
            <div class="item">666点赞</div>
            <div class="item">当前在线:{{ liveUserList.length }}人</div>
          </div>
          <div class="bottom">
            <n-popover
              placement="bottom"
              trigger="hover"
            >
              <template #trigger>
                <div class="tag">礼物成就</div>
              </template>
              <div class="popover-list">
                <template v-if="giftGroupList.length">
                  <div
                    class="item"
                    v-for="(item, index) in giftGroupList"
                    :key="index"
                  >
                    <div
                      class="ico"
                      :style="{ backgroundImage: `url(${item.goods?.cover})` }"
                    ></div>
                    <div class="nums">x{{ item.nums }}</div>
                  </div>
                </template>
                <span v-else>{{ t('common.nonedata') }}</span>
              </div>
            </n-popover>
            <div class="tag">人气榜</div>
          </div>
        </div>
      </div>
      <div
        class="video-wrap"
        v-loading="videoLoading"
      >
        <div
          class="no-live"
          v-if="!roomLiving"
        >
          主播还没开播~
        </div>
        <div
          class="cover"
          :style="{
            backgroundImage: `url(${
              appStore.liveRoomInfo?.cover_img || anchorInfo?.avatar
            })`,
          }"
        ></div>
        <div
          class="remote-video"
          ref="remoteVideoRef"
        ></div>
        <VideoControls
          :resolution="videoResolution"
          @refresh="handleRefresh"
          @full-screen="handleFullScreen"
          @picture-in-picture="hanldePictureInPicture"
          :control="appStore.videoControls"
        ></VideoControls>
      </div>

      <div
        ref="bottomRef"
        v-loading="giftLoading"
        class="gift-list"
      >
        <div
          v-for="(item, index) in giftGoodsList"
          :key="index"
          class="item"
          @click="handlePay(item)"
        >
          <div
            class="ico"
            :style="{ backgroundImage: `url(${item.cover})` }"
          >
            <div
              v-if="item.badge"
              class="badge"
              :style="{ backgroundColor: item.badge_bg }"
            >
              <span class="txt">{{ item.badge }}</span>
            </div>
          </div>
          <div class="name">{{ item.name }}</div>
          <div class="price">￥{{ formatMoney(item.price) }}</div>
        </div>
        <div
          class="item"
          @click="handleRecharge"
        >
          <div class="ico wallet"></div>
          <div class="name">
            余额:{{ formatMoney(userStore.userInfo?.wallet?.balance) }}元
          </div>
          <div class="price">立即充值</div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="rank-wrap">
        <div class="tab">
          <span>在线用户</span>
          <span> | </span>
          <span>排行榜</span>
        </div>
        <div class="user-list">
          <div
            v-for="(item, index) in liveUserList"
            :key="index"
            class="item"
          >
            <div
              class="info"
              v-if="item.value?.userInfo"
              @click="jumpProfile(item.value.userInfo.id!)"
            >
              <div
                class="avatar"
                :style="{
                  backgroundImage: `url(${item.value.userInfo.avatar})`,
                }"
              ></div>
              <div class="username">
                {{ item.value.userInfo.username }}
              </div>
            </div>
            <div
              class="info"
              v-else
            >
              <div class="avatar"></div>
              <div class="username">
                {{ item.value?.socketId }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref="danmuListRef"
        class="danmu-list"
      >
        <div
          v-for="(item, index) in damuList"
          :key="index"
          class="item"
        >
          <template v-if="item.msgType === DanmuMsgTypeEnum.reward">
            <div class="reward">
              <span>[{{ formatTimeHour(item.send_msg_time) }}]</span>
              <span>
                {{ item.userInfo?.username }} 打赏了{{ item.msg }}！
              </span>
            </div>
          </template>
          <template v-if="item.msgType === DanmuMsgTypeEnum.danmu">
            <span class="time">[{{ formatTimeHour(item.send_msg_time) }}]</span>
            <span class="name">
              <span
                v-if="
                  item.userInfo && userStore.userInfo?.id === item.userInfo.id
                "
              >
                <span>{{ item.userInfo.username }}</span>
                <span>
                  [{{ item.userInfo.roles?.map((v) => v.role_name).join() }}]
                </span>
              </span>
              <Dropdown
                trigger="click"
                positon="left"
                v-else-if="item.userInfo"
              >
                <template #btn>
                  <span>{{ item.userInfo.username }}</span>
                  <span>
                    [{{ item.userInfo.roles?.map((v) => v.role_name).join() }}]
                  </span>
                </template>
                <template #list>
                  <div class="list">
                    <div class="item">{{ item.userInfo.username }}</div>
                    <div
                      class="item operator"
                      @click="
                        handleDisableSpeakingUser({
                          userId: item.userInfo.id,
                          socketId: item.socket_id,
                        })
                      "
                    >
                      禁言该用户
                    </div>
                    <div
                      class="item operator"
                      @click="
                        handleRestoreSpeakingUser({
                          userId: item.userInfo.id,
                          socketId: item.socket_id,
                        })
                      "
                    >
                      解除禁言该用户
                    </div>
                    <div
                      class="item operator"
                      @click="handleKickUser"
                    >
                      踢掉该用户
                    </div>
                  </div>
                </template>
              </Dropdown>
              <span v-else>
                <span>{{ item.socket_id }}</span>
                <span>[游客]</span>
              </span>
            </span>
            <span>：</span>
            <span
              class="msg"
              v-if="item.msgIsFile === WsMessageMsgIsFileEnum.no"
            >
              {{ item.msg }}
            </span>
            <div
              class="msg img"
              v-else
            >
              <img
                :src="item.msg"
                alt=""
                @load="handleScrollTop"
              />
            </div>
          </template>
          <template v-else-if="item.msgType === DanmuMsgTypeEnum.otherJoin">
            <span class="name system">系统通知：</span>
            <span class="msg">
              {{ item.userInfo?.username || item.socket_id }}进入直播！
            </span>
          </template>
          <template v-else-if="item.msgType === DanmuMsgTypeEnum.userLeaved">
            <span class="name system">系统通知：</span>
            <span class="msg">
              {{ item.userInfo?.username || item.socket_id }}离开直播！
            </span>
          </template>
        </div>
      </div>
      <div
        class="send-msg"
        v-loading="msgLoading"
      >
        <div
          class="disableSpeaking"
          v-if="appStore.disableSpeaking.get(appStore.liveRoomInfo?.id || -1)"
        >
          <div class="bg"></div>
          <span class="txt">
            你被禁言了（{{
              appStore.disableSpeaking.get(appStore.liveRoomInfo?.id || -1)
                ?.label
            }}）
          </span>
        </div>
        <div class="control">
          <div
            class="emoji-list"
            v-if="showEmoji"
          >
            <div
              class="item"
              v-for="(item, index) in emojiArray"
              :key="index"
              @click="handlePushStr(item)"
            >
              {{ item }}
            </div>
          </div>
          <div
            class="ico face"
            title="表情"
            @click="handleEmoji"
          ></div>
          <div
            class="ico img"
            title="图片"
            @click="mockClick"
          >
            <input
              ref="uploadRef"
              type="file"
              class="input-upload"
              accept=".webp,.png,.jpg,.jpeg,.gif"
              @change="uploadChange"
            />
          </div>
        </div>
        <textarea
          ref="danmuIptRef"
          :placeholder="'发个弹幕吧~'"
          v-model="danmuStr"
          class="ipt"
          @keydown="keydownDanmu"
        ></textarea>
        <div
          class="btn"
          @click="handleSendDanmu"
        >
          发送
        </div>
      </div>
    </div>
    <RechargeCpt
      :show="showRecharge"
      @close="(v) => (showRecharge = v)"
    ></RechargeCpt>
  </div>
</template>

<script lang="ts" setup>
import { getRandomString, openToTarget } from 'billd-utils';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import {
  fetchGiftGroupList,
  fetchGiftRecordCreate,
  fetchGiftRecordList,
} from '@/api/giftRecord';
import { fetchGoodsList } from '@/api/goods';
import { fetchGetWsMessageList } from '@/api/wsMessage';
import { QINIU_RESOURCE, liveRoomTypeEnumMap } from '@/constant';
import { emojiArray } from '@/emoji';
import { commentAuthTip, loginTip } from '@/hooks/use-login';
import { useFullScreen, usePictureInPicture } from '@/hooks/use-play';
import { usePull } from '@/hooks/use-pull';
import { useQiniuJsUpload } from '@/hooks/use-upload';
import {
  DanmuMsgTypeEnum,
  GiftRecordStatusEnum,
  GoodsTypeEnum,
  IGiftRecord,
  IGoods,
  LiveRenderEnum,
  WsMessageMsgIsFileEnum,
  WsMessageMsgIsShowEnum,
  WsMessageMsgIsVerifyEnum,
} from '@/interface';
import router, { routerName } from '@/router';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { WsDisableSpeakingType, WsMsgTypeEnum } from '@/types/websocket';
import { formatMoney, formatTimeHour, handleUserMedia } from '@/utils';
import { NODE_ENV } from 'script/constant';

import RechargeCpt from './recharge/index.vue';

const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();
const networkStore = useNetworkStore();
const { t } = useI18n();

const roomId = ref(route.params.roomId as string);
const configBg = ref();
const configVideo = ref();
const giftGoodsList = ref<IGoods[]>([]);
const giftRecordList = ref<IGiftRecord[]>([]);
const giftGroupList = ref<Array<IGiftRecord & { nums: number }>>([]);
const height = ref(0);
const giftLoading = ref(false);
const showRecharge = ref(false);
const showEmoji = ref(false);
const msgLoading = ref(false);
const topRef = ref<HTMLDivElement>();
const bottomRef = ref<HTMLDivElement>();
const danmuListRef = ref<HTMLDivElement>();
const remoteVideoRef = ref<HTMLDivElement>();
const uploadRef = ref<HTMLInputElement>();
const danmuIptRef = ref<HTMLTextAreaElement>();
const {
  initPull,
  closeWs,
  closeRtc,
  keydownDanmu,
  sendDanmu,
  handlePlay,
  handleSendGetLiveUser,
  videoWrapRef,
  danmuMsgType,
  msgIsFile,
  mySocketId,
  videoResolution,
  videoLoading,
  roomLiving,
  damuList,
  liveUserList,
  danmuStr,
  anchorInfo,
} = usePull(roomId.value);

onMounted(() => {
  appStore.videoControls.fps = true;
  appStore.videoControls.fullMode = true;
  appStore.videoControls.kbs = true;
  appStore.videoControls.line = true;
  appStore.videoControls.networkSpeed = true;
  appStore.videoControls.pageFullMode = true;
  appStore.videoControls.pipMode = true;
  appStore.videoControls.renderMode = LiveRenderEnum.video;
  appStore.videoControls.resolution = true;
  appStore.videoControls.speed = true;

  videoWrapRef.value = remoteVideoRef.value;
  setTimeout(() => {
    scrollTo(0, 0);
  }, 100);
  handleHistoryMsg();
  getGoodsList();
  if (topRef.value && bottomRef.value && remoteVideoRef.value) {
    const res =
      bottomRef.value.getBoundingClientRect().top -
      (topRef.value.getBoundingClientRect().top +
        topRef.value.getBoundingClientRect().height);
    height.value = res;
  }
  getBg();
  initPull({});
  getGiftRecord();
  getGiftGroupList();
  handleSendGetLiveUser(Number(roomId.value));
});

onUnmounted(() => {
  closeWs();
  closeRtc();
});

function handleSendDanmu() {
  danmuMsgType.value = DanmuMsgTypeEnum.danmu;
  sendDanmu();
}

async function getGiftGroupList() {
  const res = await fetchGiftGroupList({
    live_room_id: Number(roomId.value),
    status: GiftRecordStatusEnum.ok,
  });
  if (res.code === 200) {
    // @ts-ignore
    giftGroupList.value = res.data.rows.map((item) => {
      try {
        const json = JSON.parse(item.goods_snapshot!);
        item.goods = json;
      } catch (error) {
        console.log(error);
      }
      return item;
    });
  }
}

async function getGiftRecord() {
  const res = await fetchGiftRecordList({
    live_room_id: Number(roomId.value),
    status: GiftRecordStatusEnum.ok,
  });
  if (res.code === 200) {
    giftRecordList.value = res.data.rows;
  }
}

async function handleHistoryMsg() {
  try {
    const res = await fetchGetWsMessageList({
      nowPage: 1,
      pageSize: appStore.liveRoomInfo?.history_msg_total || 10,
      orderName: 'created_at',
      orderBy: 'desc',
      live_room_id: Number(roomId.value),
      is_show: WsMessageMsgIsShowEnum.yes,
      is_verify: WsMessageMsgIsVerifyEnum.yes,
    });
    if (res.code === 200) {
      res.data.rows.forEach((v) => {
        damuList.value.unshift({
          ...v,
          live_room_id: v.live_room_id!,
          msg_id: v.id!,
          socket_id: '',
          msgType: v.msg_type!,
          msgIsFile: v.msg_is_file!,
          userInfo: v.user,
          msg: v.content!,
          username: v.username!,
          send_msg_time: Number(v.send_msg_time),
          redbag_send_id: v.redbag_send_id,
        });
      });
      if (
        appStore.liveRoomInfo?.system_msg &&
        appStore.liveRoomInfo?.system_msg !== ''
      ) {
        damuList.value.push({
          live_room_id: Number(roomId.value),
          socket_id: '',
          msgType: DanmuMsgTypeEnum.system,
          msgIsFile: WsMessageMsgIsFileEnum.no,
          msg: appStore.liveRoomInfo.system_msg,
          send_msg_time: Number(+new Date()),
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function handlePk() {
  const stream = await handleUserMedia({ video: true, audio: true });
  const rtc = networkStore.rtcMap.get(`${roomId.value}`)!;
  if (rtc?.peerConnection) {
    rtc.peerConnection.onnegotiationneeded = () => {
      console.log('onnegotiationneeded');
    };
    stream?.getTracks().forEach((track) => {
      rtc.peerConnection?.addTrack(track, stream);
    });
  }
}

watch(
  () => damuList.value.length,
  () => {
    setTimeout(() => {
      handleScrollTop();
    }, 0);
  }
);

watch(
  () => appStore.liveRoomInfo,
  () => {
    getBg();
  },
  {
    deep: true,
  }
);

/**
 * 禁言用户逻辑：
 * 主播开播了，可以禁言所有看自己直播的用户
 * 使用redis存储记录，key是主播直播间id，value是禁言用户id
 */
function handleDisableSpeakingUser({ socketId, userId }) {
  console.log('handleDisableSpeakingUser');
  const instance = networkStore.wsMap.get(roomId.value);
  if (instance) {
    instance.send<WsDisableSpeakingType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.disableSpeaking,
      data: {
        socket_id: socketId,
        user_id: userId,
        live_room_id: Number(roomId.value),
        duration: 60 * 5,
      },
    });
  }
}

function handleRestoreSpeakingUser({ socketId, userId }) {
  console.log('handleRestoreSpeakingUser');
  const instance = networkStore.wsMap.get(roomId.value);
  if (instance) {
    instance.send<WsDisableSpeakingType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.disableSpeaking,
      data: {
        socket_id: socketId,
        user_id: userId,
        live_room_id: Number(roomId.value),
        restore: true,
      },
    });
  }
}

function jumpProfile(userId: number) {
  const url = router.resolve({
    name: routerName.profile,
    params: { userId },
  });
  openToTarget(url.href);
}

function handleKickUser() {
  console.log('handleKickUser');
}

function getBg() {
  try {
    const reg = /.+\.mp4$/g;
    const url = appStore.liveRoomInfo?.bg_img;
    if (url) {
      if (reg.exec(url)) {
        configVideo.value = url;
      } else {
        configBg.value = url;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function handlePushStr(str) {
  danmuStr.value += str;
  showEmoji.value = false;
  danmuIptRef.value?.focus();
}

function handleEmoji() {
  if (!loginTip()) {
    return;
  }
  if (!commentAuthTip()) {
    return;
  }
  showEmoji.value = !showEmoji.value;
}

function mockClick() {
  if (!loginTip()) {
    return;
  }
  if (!commentAuthTip()) {
    return;
  }
  uploadRef.value?.click();
}

async function uploadChange() {
  const fileList = uploadRef.value?.files;
  if (fileList?.length) {
    try {
      msgLoading.value = true;
      msgIsFile.value = WsMessageMsgIsFileEnum.yes;
      const res = await useQiniuJsUpload({
        prefix: QINIU_RESOURCE.prefix['billd-live/msg-image/'],
        file: fileList[0],
      });
      if (res?.resultUrl) {
        danmuMsgType.value = DanmuMsgTypeEnum.danmu;
        danmuStr.value = res.resultUrl || '错误图片';
        sendDanmu();
      }
    } catch (error) {
      console.log(error);
    } finally {
      msgIsFile.value = WsMessageMsgIsFileEnum.no;
      msgLoading.value = false;
      if (uploadRef.value) {
        uploadRef.value.value = '';
      }
    }
  }
}

async function handlePay(item: IGoods) {
  const res = await fetchGiftRecordCreate({
    goodsId: item.id!,
    goodsNums: 1,
    liveRoomId: Number(roomId.value),
  });
  if (res.code === 200) {
    window.$message.success('打赏成功！');
    danmuMsgType.value = DanmuMsgTypeEnum.reward;
    danmuStr.value = item.name || '';
    sendDanmu();
  }
  userStore.updateMyWallet();
  getGiftGroupList();
}

function handleFullScreen() {
  const el = remoteVideoRef.value?.childNodes[0];
  if (el) {
    useFullScreen(el);
  }
}

async function hanldePictureInPicture() {
  if (appStore.videoControlsValue.pipMode) {
    document.exitPictureInPicture();
  } else {
    const el = remoteVideoRef.value?.childNodes[0];
    if (el && remoteVideoRef.value) {
      await usePictureInPicture(el, remoteVideoRef.value);
    }
  }
}

function handleRefresh() {
  if (appStore.liveRoomInfo) {
    handlePlay(appStore.liveRoomInfo);
  }
}

async function getGoodsList() {
  try {
    giftLoading.value = true;
    const res = await fetchGoodsList({
      type: GoodsTypeEnum.gift,
      orderName: 'created_at',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      giftGoodsList.value = res.data.rows;
    }
  } catch (error) {
    console.log(error);
  } finally {
    giftLoading.value = false;
  }
}

function handleRecharge() {
  if (!loginTip()) return;
  showRecharge.value = true;
}

function handleScrollTop() {
  if (danmuListRef.value) {
    danmuListRef.value.scrollTop = danmuListRef.value.scrollHeight + 10000;
  }
}
</script>

<style lang="scss" scoped>
.popover-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 140px;
  .item {
    margin-top: 10px;
    margin-right: 10px;
    text-align: center;
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
      margin-top: 5px;
    }
    &:nth-child(3n) {
      margin-right: 0px;
    }
    .ico {
      position: relative;
      width: 40px;
      height: 40px;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .nums {
      margin-top: 5px;
      color: #18191c;
    }
  }
}
.pull-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  margin: 15px auto 0;
  width: $w-1200;

  .bg-img-wrap {
    position: absolute;
    top: $layout-head-h;
    left: 50%;
    max-width: 1920px;
    max-height: 890px;
    width: 100%;
    height: 100%;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    transform: translateX(-50%);
    .bg-img {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .bg-video {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
    }
  }
  .left {
    position: relative;
    display: inline-block;
    overflow: hidden;
    box-sizing: border-box;
    width: $w-900;
    height: 740px;
    border-radius: 6px;
    background-color: $theme-color-papayawhip;
    color: #61666d;
    vertical-align: top;
    .head {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 10px 20px;
      height: 80px;
      color: #18191c;

      .info {
        display: flex;
        align-items: center;
        text-align: initial;

        .avatar {
          margin-right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;

          @extend %containBg;
        }
        .detail {
          .top {
            display: flex;
            margin-bottom: 10px;
            .follow {
              display: flex;
              align-items: center;
              margin-left: 10px;
              height: 20px;
              border-radius: 12px;
              background-color: $theme-color-gold;
              font-size: 12px;
              .f-left {
                display: flex;
                align-items: center;
                padding: 0 10px;
                color: white;
                cursor: pointer;
              }
              .f-right {
                display: flex;
                align-items: center;
                padding: 0 10px;
                height: 100%;
                border-radius: 0 12px 12px 0;
                background-color: #e3e5e7;
              }
            }
          }
          .bottom {
            font-size: 14px;
            .area {
              margin-left: 10px;
              color: #9499a0;
              cursor: pointer;
            }
          }
        }
      }
      .other {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 14px;
        .top {
          display: flex;
          margin-bottom: 10px;
          .item {
            margin-right: 10px;
          }
        }
        .bottom {
          font-size: 12px;
          .tag {
            display: inline-block;
            margin-right: 10px;
            padding: 4px 10px;
            border-radius: 10px;
            background-color: $theme-color-gold;
            color: white;
            text-align: center;
            line-height: 1;
            cursor: pointer;
          }
        }
      }
    }
    .video-wrap {
      position: relative;
      display: flex;
      overflow: hidden;
      align-items: center;
      justify-content: space-between;
      height: calc(100% - 80px - 100px);
      background-color: rgba($color: #000000, $alpha: 0.5);
      .remote-video {
        position: relative;
        width: 100%;
        height: 100%;
        :deep(video) {
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          margin: 0 auto;
          height: calc(100% - 80px - 100px);
          transform: translate(-50%, -50%);
        }
        :deep(canvas) {
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          margin: 0 auto;
          height: calc(100% - 80px - 100px);
          transform: translate(-50%, -50%);
        }
      }

      .cover {
        position: absolute;
        background-position: center center;
        background-size: cover;
        filter: blur(10px);

        inset: 0;
      }
      .no-live {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 20;
        color: white;
        font-size: 28px;
        transform: translate(-50%, -50%);
      }
    }

    .gift-list {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      box-sizing: border-box;
      box-sizing: border-box;
      padding: 5px 0;
      height: 100px;
      > :last-child {
        position: absolute;
      }
      .item {
        display: flex;
        align-items: center;
        flex-direction: column;
        box-sizing: border-box;
        width: 90px;
        height: 88px;
        text-align: center;
        cursor: pointer;
        &:hover {
          background-color: #ebe0ce;
        }

        .ico {
          position: relative;
          margin-top: 12px;
          width: 40px;
          height: 40px;
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
          &.wallet {
            background-image: url('@/assets/img/wallet.webp');
          }
          .badge {
            position: absolute;
            top: -8px;
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
        .name {
          color: #18191c;
          font-size: 12px;
        }
        .price {
          color: #9499a0;
          font-size: 12px;
        }
      }
    }
  }
  .right {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    width: $w-250;
    height: 740px;
    border-radius: 6px;
    background-color: $theme-color-papayawhip;
    color: #9499a0;
    .rank-wrap {
      .tab {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        height: 30px;
        font-size: 12px;
      }
      .user-list {
        overflow-y: scroll;
        box-sizing: border-box;
        padding: 0 15px;
        height: 100px;

        @extend %customScrollbar;
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 12px;
          .info {
            display: flex;
            align-items: center;
            cursor: pointer;
            .avatar {
              margin-right: 5px;
              width: 25px;
              height: 25px;
              border-radius: 50%;

              @extend %containBg;
            }
            .username {
              color: black;
            }
          }
        }
      }
    }

    .danmu-list {
      overflow-y: scroll;
      box-sizing: border-box;
      padding-top: 4px;
      height: calc(100% - 30px - 100px - 135px);
      background-color: #f6f7f8;
      text-align: initial;

      @extend %customScrollbar;
      .item {
        box-sizing: border-box;
        margin-bottom: 4px;
        padding: 2px 10px;
        white-space: normal;
        word-wrap: break-word;
        font-size: 13px;
        .reward {
          color: $theme-color-gold;
          font-weight: bold;
        }

        .name,
        .time {
          color: #9499a0;
          &.system {
            color: red;
          }
          .dropdown-wrap {
            :deep(.container) {
              width: 120px;
            }
          }
          .list {
            .item {
              &:hover {
                &.operator {
                  color: $theme-color-gold;
                  cursor: pointer;
                }
              }
            }
          }
        }
        .msg {
          margin-top: 4px;
          color: #61666d;
          &.img {
            img {
              width: 80%;
            }
          }
        }
      }
    }
    .send-msg {
      position: absolute;
      bottom: 0;
      left: 0;
      box-sizing: border-box;
      padding: 2px 10px;
      width: 100%;
      height: 135px;
      .disableSpeaking {
        cursor: no-drop;

        .bg {
          position: absolute !important;

          @extend %maskBg;
        }
        .txt {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          text-align: center;
          font-size: 14px;
          transform: translate(-50%, -50%);
        }
      }
      .control {
        display: flex;
        margin: 4px 0;
        .emoji-list {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          overflow: scroll;
          box-sizing: border-box;
          padding: 3px;
          padding-right: 0;
          height: 160px;
          background-color: #fff;
          transform: translateY(-100%);

          @extend %customScrollbar;
          .item {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            width: 14%;
            height: 18%;
            border: 1px solid #f8f8f8;
            font-size: 20px;
            cursor: pointer;
          }
        }
        .ico {
          margin-right: 6px;
          width: 24px;
          height: 24px;
          cursor: pointer;
          .input-upload {
            width: 0;
            height: 0;
            opacity: 0;
          }
          &.face {
            @include setBackground('@/assets/img/msg-face.webp');
          }
          &.img {
            @include setBackground('@/assets/img/msg-img.webp');
          }
        }
      }
      .ipt {
        display: block;
        box-sizing: border-box;
        margin: 0 auto;
        padding: 10px;
        width: 100%;
        height: 60px;
        outline: none;
        border: 1px solid hsla(0, 0%, 60%, 0.2);
        border-radius: 4px;
        background-color: #fff;
        font-size: 14px;

        &::placeholder {
          font-size: 13px;
        }
      }
      .btn {
        box-sizing: border-box;
        margin-top: 10px;
        margin-left: auto;
        padding: 4px;
        width: 70px;
        height: 24px;
        border-radius: 4px;
        background-color: $theme-color-gold;
        color: white;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
      }
    }
  }
  &.isPageFull {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    justify-content: space-between;
    margin: 0;
    width: 100vw;
    height: 100vh;

    .left {
      width: calc(100vw - 300px);
      height: 100%;
      border-radius: 0;
      .head {
        display: none;
      }
      .video-wrap {
        height: calc(100% - 100px);
        .remote-video {
          :deep(video) {
            max-width: 100%;
          }
          :deep(canvas) {
            max-width: 100%;
          }
        }
      }
      .gift-list {
        background-color: #8ec5fc;
        background-image: linear-gradient(62deg, #8ec5fc 0%, #e0c3fc 100%);

        .item {
          .name {
            color: white;
          }
          .price {
            color: black;
          }
        }
      }
    }
    .right {
      width: 300px;
      height: 100%;
      border-radius: 0;
      .rank-wrap {
        background-color: #8ec5fc;
        background-image: linear-gradient(62deg, #8ec5fc 0%, #e0c3fc 100%);
      }

      .send-msg {
        background-color: #0093e9;
        background-image: linear-gradient(328deg, #0093e9 0%, #80d0c7 100%);
      }
    }
  }
}

// 屏幕宽度大于1500的时候
@media screen and (min-width: $w-1500) {
  .pull-wrap {
    width: $w-1450;

    .left {
      width: $w-1100;
      :deep(video) {
        max-width: $w-1100;
      }
      :deep(canvas) {
        max-width: $w-1100;
      }
    }
    .right {
      width: $w-300;
    }
  }
}
</style>
