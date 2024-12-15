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
      style="width: 300px"
      title="联系作者"
      role="dialog"
      closable
      @close="showContach = false"
    >
      <div>
        <div>微信二维码：</div>
        <img
          src="@/assets/img/my-wechat.png"
          alt=""
          style="width: 250px"
        />
        <div>微信号：{{ AUTHOR_INFO.wechat }}</div>
        <div>qq号：{{ AUTHOR_INFO.qq }}</div>
        <div>添加时请备注：<b>desk私有化部署</b></div>
        <b style="color: red">
          <span>
            注意：项目开源，个人用户有问题github提Issue即可，不必添加作者！
          </span>
          <br />
          <i>如有商业合作，请充分了解该项目。咨询需付费（100元/小时）！</i>
        </b>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { AUTHOR_INFO, COMMON_URL, WEB_DESK_URL } from '@/constant';

const router = useRouter();
const showContach = ref(false);
const currentTab = ref<'personal' | 'openSource' | 'customized' | string>(
  'openSource'
);

const tab = ref([
  {
    id: 'personal',
    txt: '个人版',
  },
  {
    id: 'openSource',
    txt: '开源版',
  },
  {
    id: 'customized',
    txt: '定制版',
  },
]);

const detail = ref({
  personal: {
    slogan: ['欢迎使用BilldDesk~'],
    list: [
      {
        color: 'blue',
        name: 'VIP',
        desc: '适用于个人用户简单体验',
        price: {
          left: '￥',
          center: '0',
          right: '',
        },
        tip: '',
        feat: [
          {
            status: 'done',
            txt: '一对一远程控制',
          },
        ],
        btn: {
          type: 'link',
          link: WEB_DESK_URL,
          txt: '免费体验',
        },
      },
    ],
  },
  openSource: {
    slogan: ['BilldDesk开源至今，累计收获200k+ star', '值得信赖，欢迎部署~'],
    list: [
      {
        color: 'blue',
        name: 'Github',
        desc: '适用于个人学习/测试用途',
        price: {
          left: '￥',
          center: '0',
          right: '',
        },
        tip: '',
        feat: [
          {
            status: 'done',
            txt: '源码开源，自行部署',
          },
          {
            status: 'done',
            txt: '前台（Web）',
          },
          {
            status: 'todo',
            txt: '后台（Web）',
          },
          {
            status: 'todo',
            txt: '后端（Node.js）',
          },
          {
            status: 'todo',
            txt: '移动端（Flutter）',
          },
          {
            status: 'todo',
            txt: '客户端（Electron）',
          },
        ],
        btn: {
          type: 'link',
          link: 'https://github.com/billd-project/desk',
          txt: '立即部署',
        },
      },
      {
        color: 'green',
        name: '私有化部署',
        desc: '适用于个人/企业自建远程桌面',
        price: {
          left: '￥',
          center: '6000',
          right: '起',
        },
        tip: '涵盖Github全部/部分功能',
        feat: [
          {
            status: 'done',
            txt: '一次部署，永久使用',
          },
          {
            status: 'done',
            txt: '无门槛，全程专人负责部署',
          },
          {
            status: 'done',
            txt: '本地服务器部署',
          },
          {
            status: 'done',
            txt: '快速上线',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
    ],
  },
  customized: {
    slogan: ['BilldDesk支持定制化', '适合二开，定制个性化功能~'],
    list: [
      {
        color: 'blue',
        name: '在线咨询',
        desc: '咨询任何问题服务',
        price: {
          left: '￥',
          center: '100',
          right: '元/小时',
        },
        tip: '',
        feat: [
          {
            status: 'done',
            txt: '一对一解答',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
      {
        color: 'green',
        name: '付费课程',
        desc: '适用于前端/音视频小白',
        price: {
          left: '￥',
          center: '399',
          right: '元',
        },
        tip: '',
        feat: [
          {
            status: 'done',
            txt: '一对一解答（4小时）',
          },
          {
            status: 'done',
            txt: '视频讲解',
          },
          {
            status: 'done',
            txt: '单独的代码仓库',
          },
          {
            status: 'done',
            txt: `BilldDesk付费课微信群`,
          },
        ],
        btn: {
          type: 'link',
          link: COMMON_URL.payCoursesArticle,
          txt: '了解详情',
        },
      },
      {
        color: 'orange',
        name: '私有化部署',
        desc: '适用于个人/企业自建远程桌面',
        price: {
          left: '￥',
          center: '8000',
          right: '起',
        },
        tip: '',
        feat: [
          {
            status: 'done',
            txt: '一次部署，永久使用',
          },
          {
            status: 'done',
            txt: '无门槛，全程专人负责部署',
          },
          {
            status: 'done',
            txt: '本地服务器部署',
          },
          {
            status: 'done',
            txt: '快速上线',
          },
          {
            status: 'done',
            txt: '定制化功能',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
    ],
  },
});

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
  background-color: #f4f8ff;
  .title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    margin: 0 auto;
    width: 80%;
    height: 160px;
    // background-color: red;
    text-align: center;
    font-size: 30px;
  }
  .tab {
    display: flex;
    justify-content: center;
    margin: 10px auto 0;
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
    padding-top: 20px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .item {
      box-sizing: border-box;
      padding: 20px 20px;
      width: 80%;
      margin-bottom: 20px;
      // border: 1px solid #dde6ed;
      border-radius: 2px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      background-color: white;
      font-size: 14px;
      box-shadow:
        0 0.90667vw 2.13333vw 0 rgba(0, 0, 0, 0.10196078431372549),
        0 1px 0.53333vw 0 hsla(0, 0%, 100%, 0.5019607843137255);
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
        height: 190px;
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
