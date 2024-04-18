<template>
  <header class="head-wrap">
    <div class="head">
      <div class="left">
        <div
          class="logo-wrap"
          @click="router.push('/')"
        >
          <div class="logo"></div>
        </div>

        <div class="nav">
          <a
            class="item"
            :class="{
              active: router.currentRoute.value.path === '/',
            }"
            href="/"
            @click.prevent="router.push('/')"
          >
            {{ t('layout.home') }}
          </a>

          <a
            class="item"
            :class="{
              active: router.currentRoute.value.name === routerName.area,
            }"
            @click.prevent="router.push({ name: routerName.area })"
          >
            {{ t('layout.area') }}
          </a>

          <a
            class="item"
            :href="COMMON_URL.admin"
            @click.prevent="openToTarget(COMMON_URL.admin)"
            v-if="!isMobile()"
          >
            {{ t('layout.liveAdmin') }}
          </a>

          <Dropdown
            class="item"
            v-if="!isMobile()"
          >
            <template #btn>
              <div class="btn">
                <span>{{ t('layout.download') }}</span>
                <VPIconChevronDown class="icon"></VPIconChevronDown>
              </div>
            </template>
            <template #list>
              <div class="list">
                <a
                  class="item"
                  @click.prevent="
                    router.push({ name: routerName.downloadLive })
                  "
                >
                  <div class="txt">{{ t('layout.liveClient') }}</div>
                </a>
                <a
                  class="item"
                  @click.prevent="
                    router.push({ name: routerName.downloadRemoteDesktop })
                  "
                >
                  <div class="txt">{{ t('layout.remoteDesktopClient') }}</div>
                </a>
              </div>
            </template>
          </Dropdown>

          <a
            class="item"
            @click.prevent="router.push({ name: routerName.remoteDesktop })"
          >
            {{ t('layout.remoteDesktop') }}
            <div class="badge">
              <div class="txt">stage</div>
            </div>
          </a>
        </div>
      </div>

      <div class="right">
        <Dropdown
          class="doc"
          v-if="!isMobile()"
        >
          <template #btn>
            <div class="btn">
              <span>{{ t('layout.doc') }}</span>
              <VPIconChevronDown class="icon"></VPIconChevronDown>
            </div>
          </template>
          <template #list>
            <div class="list">
              <a
                class="item"
                @click="handleTip"
              >
                <div class="txt">{{ t('layout.guide') }}</div>
              </a>
              <a
                class="item"
                :href="COMMON_URL.apifox"
                @click.prevent="openToTarget(COMMON_URL.apifox)"
              >
                <div class="txt">{{ t('layout.apiDoc') }}</div>
                <VPIconExternalLink class="icon"></VPIconExternalLink>
              </a>
              <a
                class="item"
                :href="COMMON_URL.bilibiliCollectiondetail"
                @click.prevent="
                  openToTarget(COMMON_URL.bilibiliCollectiondetail)
                "
              >
                <div class="txt">{{ t('layout.bilibiliTutorial') }}</div>
                <VPIconExternalLink class="icon"></VPIconExternalLink>
              </a>
              <a
                class="item"
                :href="COMMON_URL.payCoursesArticle"
                @click.prevent="openToTarget(COMMON_URL.payCoursesArticle)"
              >
                <div class="txt">{{ t('layout.vipCourses') }}</div>
                <VPIconExternalLink class="icon"></VPIconExternalLink>
              </a>
            </div>
          </template>
        </Dropdown>

        <Dropdown
          class="ecosystem"
          v-if="!isMobile()"
        >
          <template #btn>
            <div class="btn">
              <span>{{ t('layout.ecosystem') }}</span>
              <VPIconChevronDown class="icon"></VPIconChevronDown>
            </div>
          </template>
          <template #list>
            <div class="list">
              <div class="title">{{ t('layout.resource') }}</div>
              <a
                v-for="(item, index) in resource"
                :key="index"
                :href="item.url"
                class="item"
                @click.prevent="handleJump(item)"
              >
                <div class="txt">{{ item.label }}</div>
                <VPIconExternalLink
                  v-if="item.url"
                  class="icon"
                ></VPIconExternalLink>
              </a>
              <div class="hr"></div>
              <div class="title">{{ t('layout.libraries') }}</div>
              <a
                v-for="(item, index) in plugins"
                :key="index"
                class="item"
                :href="item.url"
                @click.prevent="handleJump(item)"
              >
                <div class="txt">{{ item.label }}</div>
                <VPIconExternalLink
                  v-if="item.url"
                  class="icon"
                ></VPIconExternalLink>
              </a>
            </div>
          </template>
        </Dropdown>

        <Dropdown
          class="about"
          v-if="!isMobile()"
        >
          <template #btn>
            <div class="btn">
              <span>{{ t('layout.about') }}</span>
              <VPIconChevronDown class="icon"></VPIconChevronDown>
            </div>
          </template>
          <template #list>
            <div class="list">
              <a
                v-for="(item, index) in about"
                :key="index"
                class="item"
                :href="item.url"
                @click.prevent="
                  item.routerName
                    ? router.push({ name: item.routerName })
                    : openToTarget(item.url)
                "
              >
                <div class="txt">{{ t(item.label) }}</div>
                <VPIconExternalLink
                  v-if="item.url"
                  class="icon"
                ></VPIconExternalLink>
              </a>
            </div>
          </template>
        </Dropdown>

        <a
          class="signin"
          @click="handleSignin"
          v-if="!isMobile()"
        >
          {{ t('layout.signin') }}
          <div
            class="red-dot"
            v-if="appStore.showSigninRedDot"
          ></div>
        </a>

        <a
          class="privatizationDeployment"
          :class="{
            active:
              router.currentRoute.value.name ===
              routerName.privatizationDeployment,
          }"
          href="/privatizationDeployment"
          @click.prevent="
            router.push({ name: routerName.privatizationDeployment })
          "
          v-if="!isMobile()"
        >
          {{ t('layout.deploy') }}
          <div class="badge">
            <div class="txt">hot</div>
          </div>
        </a>

        <a
          class="videoTools"
          :class="{
            active: router.currentRoute.value.name === routerName.videoTools,
          }"
          href="/videoTools"
          @click.prevent="router.push({ name: routerName.videoTools })"
          v-if="!isMobile()"
        >
          {{ t('layout.videoTools') }}
          <div class="badge">
            <div class="txt">beta</div>
          </div>
        </a>

        <a
          class="github"
          target="_blank"
          href="https://github.com/galaxy-s10/billd-live"
        >
          <img
            :src="githubStar"
            alt=""
          />
        </a>

        <Dropdown class="start-live">
          <template #btn>
            <div class="btn">{{ t('layout.startLive') }}</div>
          </template>
          <template #list>
            <div class="list">
              <a
                class="item"
                @click.prevent="handleStartLive(LiveRoomTypeEnum.srs)"
              >
                <div class="txt">{{ t('layout.srsLive') }}</div>
              </a>
              <a
                class="item"
                @click.prevent="
                  handleStartLive(LiveRoomTypeEnum.forward_bilibili)
                "
              >
                <div class="txt">{{ t('layout.forwardBilibili') }}</div>
              </a>
              <a
                class="item"
                @click.prevent="handleStartLive(LiveRoomTypeEnum.forward_huya)"
              >
                <div class="txt">{{ t('layout.forwardHuya') }}</div>
              </a>
              <a
                class="item"
                @click.prevent="handleStartLive(LiveRoomTypeEnum.forward_all)"
              >
                <div class="txt">{{ t('layout.forwardAll') }}</div>
              </a>
              <a
                class="item"
                @click.prevent="handleStartLive(LiveRoomTypeEnum.wertc_live)"
              >
                <div class="txt">{{ t('layout.webrtcLive') }}</div>
              </a>
              <a
                class="item"
                @click.prevent="
                  handleStartLive(LiveRoomTypeEnum.wertc_meeting_one)
                "
              >
                <div class="txt">{{ t('layout.webrtcMeeting') }}</div>
              </a>
              <a
                class="item"
                @click.prevent="handleStartLive(LiveRoomTypeEnum.msr)"
              >
                <div class="txt">{{ t('layout.msrLive') }}</div>
              </a>
              <a
                class="item"
                @click.prevent="handleStartLive(LiveRoomTypeEnum.pk)"
              >
                <div class="txt">{{ t('layout.pkLive') }}</div>
              </a>
              <a
                class="item"
                @click.prevent="handleStartLive(LiveRoomTypeEnum.tencent_css)"
              >
                <div class="txt">{{ t('layout.tencentCssLive') }}</div>
              </a>
              <a
                class="item"
                @click.prevent="
                  handleStartLive(LiveRoomTypeEnum.tencent_css_pk)
                "
              >
                <div class="txt">{{ t('layout.tencentCssPkLive') }}</div>
              </a>
              <div class="tip">
                <div
                  class="tip-txt"
                  @click="handleWebsiteJump"
                >
                  有什么区别？
                </div>
              </div>
            </div>
          </template>
        </Dropdown>

        <div
          v-if="!userStore.userInfo"
          class="qqlogin"
          @click="appStore.showLoginModal = true"
        >
          <div class="btn">{{ t('layout.login') }}</div>
        </div>

        <Dropdown
          v-else
          class="qqlogin"
        >
          <template #btn>
            <div
              class="btn"
              :style="{ backgroundImage: `url(${userStore.userInfo.avatar})` }"
            ></div>
          </template>
          <template #list>
            <div class="list">
              <a
                class="item"
                @click.prevent="
                  router.push({
                    name: routerName.profile,
                    params: {
                      userId: userStore.userInfo.id,
                    },
                  })
                "
              >
                <div class="txt">{{ t('layout.profile') }}</div>
              </a>
              <a
                class="item"
                @click.prevent="handleLogout"
              >
                <div class="txt">{{ t('layout.logout') }}</div>
              </a>
            </div>
          </template>
        </Dropdown>

        <Dropdown
          class="switch-lang"
          v-if="!isMobile()"
        >
          <template #btn>
            <div class="btn">
              {{ localeMap[locale] }}
              <VPIconChevronDown class="icon"></VPIconChevronDown>
            </div>
          </template>
          <template #list>
            <div class="list">
              <a
                class="item"
                v-for="(item, index) in localeMap"
                :key="index"
                :class="{ active: item === localeMap[locale] }"
                @click="locale = index"
              >
                <div class="txt">{{ item }}</div>
              </a>
            </div>
          </template>
        </Dropdown>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { isMobile, openToTarget, windowReload } from 'billd-utils';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { fetchCreateSignin, fetchTodayIsSignin } from '@/api/signin';
import Dropdown from '@/components/Dropdown/index.vue';
import VPIconChevronDown from '@/components/icons/VPIconChevronDown.vue';
import VPIconExternalLink from '@/components/icons/VPIconExternalLink.vue';
import { COMMON_URL, DEFAULT_AUTH_INFO } from '@/constant';
import { handleTip } from '@/hooks/use-common';
import { loginTip } from '@/hooks/use-login';
import { routerName } from '@/router';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';

const { t, locale } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
const githubStar = ref('');

const localeMap = {
  zh: '中文',
  en: 'English',
};

const about = ref([
  {
    label: 'layout.faq',
    routerName: routerName.faq,
    url: '',
  },
  {
    label: 'layout.team',
    routerName: routerName.team,
    url: '',
  },
  {
    label: 'layout.sponsor',
    routerName: routerName.sponsors,
    url: '',
  },
  {
    label: 'layout.officialGroup',
    routerName: routerName.group,
    url: '',
  },
  {
    label: 'layout.release',
    routerName: routerName.release,
    url: '',
  },
]);

const resource = ref([
  {
    label: 'billd-live',
    url: 'https://github.com/galaxy-s10/billd-live',
  },
  {
    label: 'billd-desk',
    url: 'https://github.com/galaxy-s10/billd-desk',
  },
  {
    label: 'billd-live-server',
    url: 'https://github.com/galaxy-s10/billd-live-server',
  },
  {
    label: 'billd-live-admin',
    url: 'https://github.com/galaxy-s10/billd-live-admin',
  },
  {
    label: 'billd-live-kotlin',
    url: 'https://github.com/galaxy-s10/billd-live-kotlin',
  },
  {
    label: 'billd-live-flutter',
    url: 'https://github.com/galaxy-s10/billd-live-flutter',
  },
  {
    label: 'billd-live-react-native',
    url: 'https://github.com/galaxy-s10/billd-live-react-native',
  },
]);

const plugins = ref([
  {
    label: 'billd-ui',
    url: 'https://github.com/galaxy-s10/billd-ui',
  },
  {
    label: 'billd-cli',
    url: 'https://github.com/galaxy-s10/billd-cli',
  },
  {
    label: 'billd-deploy',
    url: 'https://github.com/galaxy-s10/billd-deploy',
  },
  {
    label: 'billd-utils',
    url: 'https://github.com/galaxy-s10/billd-utils',
  },
  {
    label: 'billd-scss',
    url: 'https://github.com/galaxy-s10/billd-scss',
  },
  {
    label: 'billd-html-webpack-plugin',
    url: 'https://github.com/galaxy-s10/billd-html-webpack-plugin',
  },
]);

watch(
  () => userStore.userInfo?.id,
  (newval) => {
    if (newval) {
      initSigninStatus();
    }
  },
  {
    immediate: true,
  }
);

async function handleSignin() {
  const res = await fetchCreateSignin({});
  if (res.code === 200) {
    appStore.showSigninRedDot = false;
    // eslint-disable-next-line
    window.$message.success(`签到成功！已连续签到${res.data.nums}天`);
  }
}

async function initSigninStatus() {
  const res = await fetchTodayIsSignin({
    liveRoomId: appStore.liveRoomInfo?.id,
  });
  if (res.code === 200) {
    if (res.data) {
      appStore.showSigninRedDot = false;
    } else {
      appStore.showSigninRedDot = true;
    }
  }
}

function handleLogout() {
  userStore.logout();
  setTimeout(() => {
    windowReload();
  }, 500);
}

function handleJump(item) {
  if (item.url) {
    openToTarget(item.url);
  } else {
    handleTip();
  }
}

onMounted(() => {
  githubStar.value =
    'https://img.shields.io/github/stars/galaxy-s10/billd-live?label=Star&logo=GitHub&labelColor=white&logoColor=black&style=social&cacheSeconds=3600';
});

function handleStartLive(key: LiveRoomTypeEnum) {
  if (!loginTip()) {
    return;
  }
  if (
    [
      LiveRoomTypeEnum.msr,
      LiveRoomTypeEnum.tencent_css,
      LiveRoomTypeEnum.tencent_css_pk,
      LiveRoomTypeEnum.forward_all,
      LiveRoomTypeEnum.forward_bilibili,
      LiveRoomTypeEnum.forward_huya,
    ].includes(key)
  ) {
    if (
      !userStore.userInfo?.auths?.find(
        (v) => v.auth_value === DEFAULT_AUTH_INFO.LIVE_PULL_SVIP.auth_value
      )
    ) {
      window.$message.info('权限不足，请更换其他开播方式');
      return;
    }
  }
  const url = router.resolve({
    name: routerName.push,
    query: { liveType: key },
  });
  openToTarget(url.href);
}

function handleWebsiteJump() {
  const url = router.resolve({
    name: routerName.pushStreamDifferent,
  });
  openToTarget(url.href);
}
</script>

<style lang="scss" scoped>
.head-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  box-sizing: border-box;
  // min-width: $w-1100;
  width: 100%;
  background-color: #fff;

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    height: $layout-head-h;
    box-shadow: inset 0 -1px #f1f2f3 !important;
    font-size: 15px;
    .icon {
      margin-left: 5px;
      width: 13px;

      fill: currentColor;
    }
    .list {
      padding: 10px 0;
      width: 150px;

      .item {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        padding: 0 15px;
        color: black;
        text-decoration: none;
        cursor: pointer;
        &:hover {
          color: $theme-color-gold;
        }
        .icon {
          margin-left: 5px;
          width: 13px;
          color: #3c3c4354;

          fill: currentColor;
        }
      }
    }
    .badge {
      position: absolute;
      top: -10px;
      right: -10px;
      padding: 0 2px;
      border-radius: 4px;
      background-color: red;
      color: white;
      line-height: 1;
      .txt {
        transform-origin: top !important;

        @include minFont(10);
      }
    }
    .red-dot {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: red;
    }
    .hr {
      width: 100%;
      height: 1px;
      background-color: #e7e7e7;
    }
    .left {
      display: flex;
      align-items: center;
      height: 100%;
      .logo-wrap {
        display: flex;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;

        .logo {
          width: 90px;
          height: 56px;

          @include setBackground('@/assets/img/logo-txt.png');
        }
      }

      .nav {
        display: flex;
        align-items: center;
        height: 100%;
        .item {
          position: relative;
          display: flex;
          align-items: center;
          margin-right: 20px;
          color: black;
          text-decoration: none;
          cursor: pointer;

          &.active {
            &::after {
              position: absolute;
              top: calc(50% - 8px);
              right: -5px;
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background-color: $theme-color-gold;
              content: '';
              transition: all 0.1s ease;
              transform: translateY(-100%);
            }
          }
          &:hover {
            color: $theme-color-gold;
          }
        }
      }
    }
    .download,
    .doc,
    .about,
    .ecosystem {
      &:hover {
        color: $theme-color-gold;
      }
      .btn {
        display: flex;
        align-items: center;
        .icon {
          margin-left: 5px;
          width: 13px;

          fill: currentColor;
        }
        &:hover {
          color: $theme-color-gold;
        }
      }

      .list {
        padding: 10px 0;
        width: 150px;

        .item {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          padding: 0 15px;
          color: black;
          text-decoration: none;
          cursor: pointer;
          &:hover {
            color: $theme-color-gold;
          }
          .icon {
            margin-left: 5px;
            width: 13px;
            color: #3c3c4354;

            fill: currentColor;
          }
        }
      }
    }

    .right {
      display: flex;
      align-items: center;
      height: 100%;
      .doc,
      .about,
      .ecosystem {
        margin-right: 20px;
      }

      & > :last-child {
        margin-right: 0 !important;
      }

      .ecosystem {
        .list {
          padding: 10px 0;
          width: 225px;

          .title {
            margin: 10px 0 5px;
            padding: 0 15px;
            color: rgba(60, 60, 60, 0.33);

            &:first-child {
              margin-top: 0;
            }
          }
        }
      }

      .github,
      .sponsors,
      .privatizationDeployment,
      .videoTools,
      .signin {
        display: flex;
        align-items: center;
        margin-right: 20px;
        color: black;
        text-decoration: none;
        cursor: pointer;
        &:hover {
          color: $theme-color-gold;
        }
      }

      .videoTools,
      .privatizationDeployment,
      .signin {
        position: relative;
      }

      .start-live {
        margin-right: 20px;
        .btn {
          padding: 5px 15px;
          border-radius: 6px;
          background-color: $theme-color-gold;
          color: white;
          font-size: 13px;
          cursor: pointer;
        }
        .list {
          position: relative;
          padding: 10px 0;
          width: 180px;

          .item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            padding: 0 15px;
            cursor: pointer;

            &:hover {
              color: $theme-color-gold;
            }
            &.disabled {
              color: initial !important;
              opacity: 0.5;
              cursor: not-allowed;
            }
          }
          .tip {
            display: flex;
            justify-content: flex-end;
            padding-right: 6px;
            color: rgba(60, 60, 60, 0.7);
            font-size: 12px;
            .tip-txt {
              cursor: pointer;
            }
          }
        }
      }
      .qqlogin {
        margin-right: 20px;

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background-color: papayawhip;
          font-size: 12px;
          cursor: pointer;

          @extend %containBg;
        }
        .list {
          padding: 10px 0;
          width: 90px;

          .item {
            position: relative;
            display: flex;
            padding: 0 15px;
            cursor: pointer;
            &:hover {
              color: $theme-color-gold;
            }
          }
        }
      }
      .switch-lang {
        .btn {
          display: flex;
          align-items: center;
          .icon {
            margin-left: 5px;
            width: 13px;

            fill: currentColor;
          }
        }
        .list {
          padding: 10px 0;
          width: 80px;

          .item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            padding: 0 15px;
            cursor: pointer;

            &:hover,
            &.active {
              color: $theme-color-gold;
            }
            &.disabled {
              color: initial !important;
              opacity: 0.5;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }
}
</style>
