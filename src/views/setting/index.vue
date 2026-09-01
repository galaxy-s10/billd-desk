<template>
  <div class="setting-wrap">
    <div class="nav"></div>
    <div class="container">
      <template v-if="ipcRenderer">
        <div class="item">
          <div class="label">{{ t('app.interfaceSettings') }}</div>
          <div class="value">
            <n-space>
              <div>{{ t('app.mainWindowAlwaysOnTop') }}：</div>
              <n-radio
                :checked="cacheStore.isAlwaysOnTop"
                @change="cacheStore.isAlwaysOnTop = true"
              >
                {{ t('app.yes') }}
              </n-radio>
              <n-radio
                :checked="!cacheStore.isAlwaysOnTop"
                @change="cacheStore.isAlwaysOnTop = false"
              >
                {{ t('app.no') }}
              </n-radio>
            </n-space>
          </div>
        </div>
        <div class="hr"></div>
      </template>

      <div class="item">
        <div class="label">{{ t('app.language') }}</div>
        <div class="value">
          <n-select
            v-model:value="currentLocale"
            class="language-select"
            :options="localeOptions"
            size="small"
            @update:value="handleLocaleChange"
          ></n-select>
        </div>
      </div>
      <div class="hr"></div>

      <div class="item">
        <div class="label">{{ t('app.apiConfig') }}</div>
        <div class="value">
          <div class="v-item one">
            <span
              class="link"
              @click="handleCopy(getWssUrl() || WEBSOCKET_URL)"
            >
              wss：{{ getWssUrl() || WEBSOCKET_URL }}
            </span>
          </div>
          <div class="v-item two">
            <span>axios：</span>
            <span
              class="link"
              @click="
                handleOpenExternal({
                  windowId: WINDOW_ID_ENUM.remote,
                  url: getAxiosBaseUrl() || AXIOS_BASEURL,
                })
              "
            >
              <span>{{ getAxiosBaseUrl() || AXIOS_BASEURL }}</span>
              <span>
                <VPIconExternalLink class="icon"></VPIconExternalLink>
              </span>
            </span>
          </div>
          <div class="v-item two">
            <span
              class="link"
              @click="handleCopy(getCoturnUrl() || COTURN_URL)"
            >
              coturn：{{ getCoturnUrl() || COTURN_URL }}
            </span>
          </div>
          <div
            class="v-item edit"
            @click="showUrlModalCpt = true"
          >
            {{ t('app.edit') }}
          </div>
        </div>
      </div>
      <div class="hr"></div>
      <div class="item">
        <div class="label">{{ t('app.authorInfo') }}</div>
        <div class="value">
          <div class="v-item one">
            <span
              class="link"
              @click="handleCopy(AUTHOR_INFO.wechat)"
            >
              {{ t('app.wechat') }}：{{ AUTHOR_INFO.wechat }}
            </span>
          </div>
          <div class="v-item two">
            <span
              class="link"
              @click="handleCopy(AUTHOR_INFO.qq)"
            >
              QQ：{{ AUTHOR_INFO.qq }}
            </span>
          </div>
          <div class="v-item two">
            <span>
              <span>Github：</span>
              <span
                class="link"
                @click="
                  handleOpenExternal({
                    windowId: WINDOW_ID_ENUM.remote,
                    url: AUTHOR_INFO.github,
                  })
                "
              >
                <span>{{ AUTHOR_INFO.github }}</span>
                <VPIconExternalLink class="icon"></VPIconExternalLink>
              </span>
            </span>
          </div>
        </div>
      </div>
      <div class="hr"></div>
      <div class="item">
        <div class="label">{{ t('app.webExperience') }}</div>
        <div class="value">
          <div class="v-item one">
            <span
              class="link"
              @click="
                handleOpenExternal({
                  windowId: WINDOW_ID_ENUM.remote,
                  url: WEB_DESK_URL,
                })
              "
            >
              <span>{{ WEB_DESK_URL }}</span>
              <VPIconExternalLink class="icon"></VPIconExternalLink>
            </span>
          </div>
        </div>
      </div>
      <div class="hr"></div>
      <div class="item">
        <div class="label">{{ t('app.privatizationDeployment') }}</div>
        <div class="value">
          <div class="v-item one">
            <span
              class="link"
              @click="
                handleOpenExternal({
                  windowId: WINDOW_ID_ENUM.remote,
                  url: COMMON_URL.privatizationDeployment,
                })
              "
            >
              <span>{{ t('app.learnMore') }}</span>
              <VPIconExternalLink class="icon"></VPIconExternalLink>
            </span>
          </div>
        </div>
      </div>
      <div class="hr"></div>
      <div class="item">
        <div class="label">{{ t('app.downloadClient') }}</div>
        <div class="value">
          <div class="v-item one">
            <div class="client-list">
              <div
                v-for="(item, index) in clientList"
                :key="index"
                class="client-btn"
                @click="
                  jumpToDownload({
                    windowId: WINDOW_ID_ENUM.remote,
                    url: item.url,
                  })
                "
              >
                <div class="name">{{ item.label }}</div>
                <div class="ext">{{ item.ext }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hr"></div>
      <div class="item">
        <div class="label">
          {{ t('app.aboutProduct', { product: PRODUCT_NAME }) }}
        </div>
        <div class="value">
          <div class="v-item one">
            <span>
              {{
                t('app.currentVersion', {
                  version: appStore.version,
                  date: appStore.lastBuildDate,
                })
              }}
            </span>
            <span
              v-if="ipcRenderer"
              class="btn"
              @click="handleDeskVersionCheck"
            >
              {{ t('app.checkUpdate') }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <UrlModalCpt
      v-if="showUrlModalCpt"
      @close="showUrlModalCpt = false"
    ></UrlModalCpt>
  </div>
</template>

<script lang="ts" setup>
import { copyToClipBoard } from 'billd-utils';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { fetchDeskVersionCheck } from '@/api/deskVersion';
import {
  AUTHOR_INFO,
  AXIOS_BASEURL,
  COMMON_URL,
  COTURN_URL,
  PRODUCT_NAME,
  WEB_DESK_URL,
  WEBSOCKET_URL,
  WINDOW_ID_ENUM,
} from '@/constant';
import {
  getCurrentLocale,
  setI18nLocale,
  SUPPORT_LOCALE_OPTIONS,
  SupportLocale,
} from '@/hooks/use-i18n';
import { useIpcRendererSend } from '@/hooks/use-ipcRendererSend';
import { useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';
import { ipcRenderer } from '@/utils';
import {
  getAxiosBaseUrl,
  getCoturnUrl,
  getWssUrl,
} from '@/utils/localStorage/app';

import UrlModalCpt from './urlModal.vue';

const appStore = useAppStore();
const cacheStore = usePiniaCacheStore();
const showUrlModalCpt = ref(false);
const { handleOpenExternal, handlesetAlwaysOnTop } = useIpcRendererSend();
const { t } = useI18n();
const localeOptions = SUPPORT_LOCALE_OPTIONS;
const currentLocale = ref<SupportLocale>(getCurrentLocale());

const clientList = ref<
  {
    label: string;
    ext: string;
    url: string;
  }[]
>([]);

function handleCopy(str) {
  copyToClipBoard(str);
  window.$message.success(t('app.copySuccess'));
}

function handleLocaleChange(locale: SupportLocale) {
  setI18nLocale(locale);
  currentLocale.value = locale;
}

watch(
  () => cacheStore.isAlwaysOnTop,
  () => {
    handlesetAlwaysOnTop({
      windowId: WINDOW_ID_ENUM.remote,
      flag: cacheStore.isAlwaysOnTop,
    });
  },
  { immediate: true }
);

watch(
  () => appStore.deskVersionInfo,
  (newval) => {
    if (newval) {
      Object.keys(newval).forEach((item) => {
        if (item.indexOf('download_linux') !== -1) {
          const arr = item.split('_');
          const bit = arr[2] === 'arm' ? 'arm' : `${arr[2]}bit`;
          clientList.value.push({
            label: `${arr[1]}(${bit})`,
            ext: arr[3],
            url: newval[item],
          });
        }
        if (item.indexOf('download_windows') !== -1) {
          const arr = item.split('_');
          const bit = arr[2] === 'arm' ? 'arm' : `${arr[2]}bit`;
          clientList.value.push({
            label: `${arr[1]}(${bit})`,
            ext: arr[3],
            url: newval[item],
          });
        }
        if (item.indexOf('download_macos') !== -1) {
          const arr = item.split('_');
          clientList.value.push({
            label: `${arr[1]}`,
            ext: arr[2],
            url: newval[item],
          });
        }
      });
    }
  },
  { immediate: true, deep: true }
);

function jumpToDownload({ windowId, url }) {
  if (!url || url === '') {
    window.$message.info(t('app.comingSoon'));
    return;
  }
  handleOpenExternal({
    windowId,
    url,
  });
}

async function handleDeskVersionCheck() {
  const res = await fetchDeskVersionCheck(appStore.version);
  if (res.code === 200 && res.data) {
    appStore.updateModalInfo = res.data;
    if (appStore.updateModalInfo?.checkUpdate === 2) {
      window.$message.success(t('app.noUpdateNeeded'));
    } else if (appStore.updateModalInfo?.isUpdate === 2) {
      window.$message.success(t('app.latestVersion'));
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-wrap {
  box-sizing: border-box;
  height: 100vh;
  .nav {
    height: $top-system-bar-height;
  }
  .container {
    overflow: scroll;
    padding: 0 40px;
    height: calc(100vh - $top-system-bar-height);

    @extend %customScrollbarHide;
    &:hover {
      @extend %customScrollbar;
    }
    .item {
      display: flex;
      margin-bottom: 20px;
      .icon {
        margin-left: 5px;
        width: 12px;
        height: 12px;
        vertical-align: middle;
      }
      .label {
        margin-right: 20px;
        width: 100px;
        text-align: right;
        font-weight: 500;
        font-size: 15px;
      }
      .value {
        flex: 1;
        color: #666;
        font-size: 14px;
        .language-select {
          width: 220px;
        }
        .v-item {
          margin-bottom: 5px;

          .link {
            cursor: pointer;
          }
          &.edit {
            font-size: 13px;
            cursor: pointer;
          }
          &.one {
            .btn {
              padding: 2px 10px;
              border: 1px solid #bec3ca;
              border-radius: 20px;
              font-size: 12px;
              cursor: pointer;

              user-select: none;
            }
            .client-list {
              display: flex;
              flex-wrap: wrap;
              .client-btn {
                display: flex;
                margin-right: 10px;
                margin-bottom: 10px;
                height: 30px;
                border-radius: 5px;
                background: #448ccb;
                color: white;
                font-size: 14px;
                line-height: 30px;
                cursor: pointer;

                user-select: none;
                .name {
                  width: 120px;
                  text-align: center;
                }
                .ext {
                  width: 40px;
                  background-color: #0000005c;
                  text-align: center;
                }
              }
            }
          }
          &.two {
            .btn {
              margin-right: 10px;
              padding: 2px 10px;
              border: 1px solid #bec3ca;
              border-radius: 20px;
              font-size: 12px;
              cursor: pointer;

              user-select: none;
            }
          }
        }
      }
    }
    .hr {
      margin: 20px 0;
      width: 100%;
      height: 1px;
      background-color: #ebedf1;
    }
  }
}
</style>
