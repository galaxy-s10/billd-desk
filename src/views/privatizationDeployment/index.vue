<template>
  <div class="privatizationDeployment-wrap">
    <h2 class="title">
      <div
        v-for="(item, index) in detail[currentTab].slogan"
        :key="index"
      >
        {{ item }}
      </div>
    </h2>
    <div class="tab">
      <div
        v-for="(item, index) in tab"
        :key="index"
        class="item"
        :class="{ active: item.id === currentTab }"
        @click="currentTab = item.id"
      >
        {{ item.txt }}
      </div>
    </div>
    <div class="list">
      <div
        v-for="(item, index) in detail[currentTab].list"
        :key="index"
        class="item"
        :class="{ [item['color']]: 1 }"
      >
        <div class="name">{{ item.name }}</div>
        <div class="desc">{{ item.desc }}</div>
        <div class="price">
          <span class="t1">{{ item.price.left }}</span>
          <span class="t2">{{ item.price.center }}</span>
          <span class="t3">{{ item.price.right }}</span>
        </div>
        <div class="feat">
          <div
            v-if="item.tip !== ''"
            class="feat-item tip"
          >
            {{ item.tip }}
          </div>
          <div
            v-for="(iten, indey) in item.feat"
            :key="indey"
            class="feat-item"
          >
            <div
              :class="{
                done: iten.status === 'done',
                todo: iten.status === 'todo',
              }"
            ></div>
            <div class="txt">{{ iten.txt }}</div>
          </div>
        </div>
        <div
          class="btn"
          @click="handleClick(item.btn)"
        >
          {{ item.btn.txt }}
        </div>
      </div>
    </div>
  </div>
  <n-modal v-model:show="showContach">
    <n-card
      style="width: 500px"
      :title="t('deployment.contactAuthor')"
      role="dialog"
      closable
      @close="showContach = false"
    >
      <div>
        <div>{{ t('deployment.wechatQrCode') }}：</div>
        <img
          src="@/assets/img/my-wechat.png"
          alt=""
          style="width: 250px"
        />
        <div>{{ t('deployment.wechatId') }}：{{ AUTHOR_INFO.wechat }}</div>
        <div>{{ t('deployment.qqId') }}：{{ AUTHOR_INFO.qq }}</div>
        <div>
          {{ t('deployment.contactRemark') }}：<b>{{
            t('deployment.contactRemarkValue')
          }}</b>
        </div>
        <b style="color: red">
          <span>{{ t('deployment.openSourceNotice') }}</span>
          <br />
          <i>{{ t('deployment.businessNotice') }}</i>
        </b>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { AUTHOR_INFO, COMMON_URL, WEB_DESK_URL } from '@/constant';

const router = useRouter();
const { t } = useI18n();
const showContach = ref(false);
const currentTab = ref<'personal' | 'openSource' | 'customized' | string>(
  'openSource'
);

const tab = computed(() => [
  {
    id: 'personal',
    txt: t('deployment.personalVersion'),
  },
  {
    id: 'openSource',
    txt: t('deployment.openSourceVersion'),
  },
  {
    id: 'customized',
    txt: t('deployment.customVersion'),
  },
]);

const detail = computed(() => ({
  personal: {
    slogan: [t('deployment.personalSlogan')],
    list: [
      {
        color: 'blue',
        name: 'VIP',
        desc: t('deployment.personalDesc'),
        price: {
          left: '￥',
          center: '0',
          right: '',
        },
        tip: '',
        feat: [
          {
            status: 'done',
            txt: t('deployment.oneToOneRemoteControl'),
          },
        ],
        btn: {
          type: 'link',
          link: WEB_DESK_URL,
          txt: t('deployment.freeTrial'),
        },
      },
    ],
  },
  openSource: {
    slogan: [
      t('deployment.openSourceSlogan1'),
      t('deployment.openSourceSlogan2'),
    ],
    list: [
      {
        color: 'blue',
        name: 'Github',
        desc: t('deployment.openSourceDesc'),
        price: {
          left: '￥',
          center: '0',
          right: '',
        },
        tip: '',
        feat: [
          {
            status: 'done',
            txt: t('deployment.sourceOpenDeploy'),
          },
          {
            status: 'done',
            txt: t('deployment.frontendWeb'),
          },
          {
            status: 'todo',
            txt: t('deployment.adminWeb'),
          },
          {
            status: 'todo',
            txt: t('deployment.backendNode'),
          },
          {
            status: 'todo',
            txt: t('deployment.mobileFlutter'),
          },
          {
            status: 'todo',
            txt: t('deployment.clientElectron'),
          },
        ],
        btn: {
          type: 'link',
          link: 'https://github.com/billd-project/desk',
          txt: t('deployment.deployNow'),
        },
      },
      {
        color: 'green',
        name: t('deployment.privateDeployment'),
        desc: t('deployment.privateDesc'),
        price: {
          left: '￥',
          center: '6000',
          right: t('deployment.from'),
        },
        tip: t('deployment.githubFeatures'),
        feat: [
          {
            status: 'done',
            txt: t('deployment.permanentUse'),
          },
          {
            status: 'done',
            txt: t('deployment.turnkeyDeployment'),
          },
          {
            status: 'done',
            txt: t('deployment.localServerDeployment'),
          },
          {
            status: 'done',
            txt: t('deployment.quickLaunch'),
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: t('deployment.consultNow'),
        },
      },
    ],
  },
  customized: {
    slogan: [t('deployment.customSlogan1'), t('deployment.customSlogan2')],
    list: [
      {
        color: 'blue',
        name: t('deployment.onlineConsult'),
        desc: t('deployment.onlineConsultDesc'),
        price: {
          left: '￥',
          center: '100',
          right: t('deployment.yuanPerHour'),
        },
        tip: '',
        feat: [
          {
            status: 'done',
            txt: t('deployment.oneToOneAnswer'),
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: t('deployment.consultNow'),
        },
      },
      {
        color: 'green',
        name: t('deployment.paidCourse'),
        desc: t('deployment.paidCourseDesc'),
        price: {
          left: '￥',
          center: '399',
          right: t('deployment.yuan'),
        },
        tip: '',
        feat: [
          {
            status: 'done',
            txt: t('deployment.oneToOneAnswer4Hours'),
          },
          {
            status: 'done',
            txt: t('deployment.videoExplanation'),
          },
          {
            status: 'done',
            txt: t('deployment.privateRepo'),
          },
          {
            status: 'done',
            txt: t('deployment.paidCourseGroup'),
          },
        ],
        btn: {
          type: 'link',
          link: COMMON_URL.payCoursesArticle,
          txt: t('deployment.learnMore'),
        },
      },
      {
        color: 'orange',
        name: t('deployment.privateDeployment'),
        desc: t('deployment.privateDesc'),
        price: {
          left: '￥',
          center: '8000',
          right: t('deployment.from'),
        },
        tip: '',
        feat: [
          {
            status: 'done',
            txt: t('deployment.permanentUse'),
          },
          {
            status: 'done',
            txt: t('deployment.turnkeyDeployment'),
          },
          {
            status: 'done',
            txt: t('deployment.localServerDeployment'),
          },
          {
            status: 'done',
            txt: t('deployment.quickLaunch'),
          },
          {
            status: 'done',
            txt: t('deployment.customFeature'),
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: t('deployment.consultNow'),
        },
      },
    ],
  },
}));

function handleClick(item) {
  if (item.type === 'link') {
    openToTarget(item.link);
  } else if (item.type === 'push') {
    const url = router.resolve({
      name: item.link,
    });
    openToTarget(url.href);
  } else if (item.type === 'buy') {
    console.log('buy');
  } else if (item.type === 'toast') {
    window.$message.info(item.link);
  } else if (item.type === 'showContact') {
    showContach.value = true;
  }
}
</script>

<style lang="scss" scoped>
.privatizationDeployment-wrap {
  height: 100vh;
  background-color: #f4f8ff;
  .title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    margin: 0 auto;
    width: 1200px;
    height: 180px;
    // background-color: red;
    text-align: center;
    font-size: 40px;
  }
  .tab {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    padding: 8px 0;
    width: 320px;
    border-radius: 40px;
    background: white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);

    user-select: none;
    .item {
      padding: 4px 25px;
      border-radius: 40px;
      color: #686e88;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      &.active {
        background-color: $theme-color-gold;
        color: white;
      }
    }
  }
  .list {
    display: flex;
    justify-content: center;
    margin: 50px auto 0;
    width: 1200px;
    .item {
      box-sizing: border-box;
      margin: 0 10px;
      padding: 20px 20px;
      width: 240px;
      // border: 1px solid #dde6ed;
      border-radius: 2px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      background-color: white;
      font-size: 14px;

      &.blue {
        border-top: 7px solid #38c0ff;
      }
      &.green {
        border-top: 7px solid #30d1aa;
      }
      &.orange {
        border-top: 7px solid #ffbd33;
      }
      .name {
        padding: 10px 0 0;
        height: 40px;
        text-align: center;
        font-size: 30px;
        line-height: 1;
      }
      .desc {
        margin-top: 10px;
        height: 40px;
        color: #88898d;
        text-align: center;
        // background-color: red;
      }
      .price {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        height: 45px;
        color: #88898d;
        text-align: center;
        .t1 {
          color: #272727;
          font-weight: 600;
          font-size: 16px;
        }
        .t2 {
          color: #272727;
          font-size: 40px;
          line-height: 36px;
        }
        .t3 {
          color: #2c2c2c;
          font-size: 16px;
        }
        // background-color: red;
      }
      .feat {
        margin-top: 30px;
        height: 200px;
        .feat-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          &.tip {
            color: #88898d;
          }
          .todo,
          .done {
            margin-right: 10px;
            width: 18px;
            height: 18px;
            text-align: center;
          }
          .todo {
            position: relative;
            &::after {
              color: #ffc049;
              content: '-';
              text-align: center;
              font-size: 16px;
            }
          }
          .done {
            @include setBackground('@/assets/img/check.png');
          }
        }
      }
      .btn {
        margin: 0 auto;
        padding: 8px 0;
        width: 160px;
        border: 1px solid $theme-color-gold;
        border-radius: 4px;
        color: $theme-color-gold;
        text-align: center;
        font-size: 16px;
        cursor: pointer;
        transition: all 00.3s ease;
        &:hover {
          background-color: $theme-color-gold;
          color: white;
        }
      }
    }
  }
}
</style>
