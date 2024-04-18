<template>
  <div class="sponsors-wrap">
    <div class="content">
      <h1 class="title">成为billd-live的赞助者</h1>
      <div class="desc">
        目前billd-live仅仅是作者业余时间开发以及维护，需要投入非常多时间以及精力，
        你的赞助将会为billd-live提供经济支持。
      </div>
      <div class="hr"></div>
      <div class="list">
        <div class="item">
          <h2>以企业名义赞助billd-live</h2>
          <p>如果你是企业用户，并且从billd-live中受益，请考虑捐赠以示感谢。</p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>以个人名义赞助billd-live</h2>
          <p>
            如果你是个人用户，并且从billd-live中受益，请考虑捐赠以示感谢——就当是偶尔请我们喝杯咖啡。
          </p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>赞助等级</h2>
          <ul>
            <li>铂金赞助商（2500元/月）</li>
            <li>金牌赞助商（1500元/月）</li>
            <li>银牌赞助商（1000元/月）</li>
            <li>铜牌赞助商（500元/月）</li>
            <li>慷慨支持者（100元/月）</li>
            <li>个人支持者（10元/月）</li>
          </ul>
        </div>
        <div class="hr"></div>
        <div class="item sponsors">
          <h2>当前赞助商</h2>
          <h3>铂金赞助商</h3>
          <div class="hr"></div>
          <div class="list platinum-list">
            <a
              v-for="(item, index) in platinumList"
              :key="index"
              class="bg platinum"
              :href="item.url"
              @click.prevent="openToTarget(item.url)"
            >
              <img
                :src="item.logo"
                alt=""
              />
            </a>
          </div>
          <h3>金牌赞助商</h3>
          <div class="hr"></div>
          <div class="list gold-list">
            <a
              v-for="(item, index) in goldList"
              :key="index"
              class="bg gold"
              :href="item.url"
              @click.prevent="openToTarget(item.url)"
            >
              <img
                :src="item.logo"
                alt=""
              />
            </a>
          </div>
          <h3>银牌赞助商</h3>
          <div class="hr"></div>
          <div class="list silver-list">
            <a
              v-for="(item, index) in silverList"
              :key="index"
              class="bg silver"
              :href="item.url"
              @click.prevent="openToTarget(item.url)"
            >
              <img
                :src="item.logo"
                alt=""
              />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="aside">
      <div class="title">本页目录</div>
      <div class="item">以个人名义赞助billd-live</div>
      <div class="item">以企业名义赞助billd-live</div>
      <div class="item">赞助等级</div>
      <div class="item">当前赞助商</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { ref } from 'vue';

// 铂金赞助
const platinumList = ref([
  {
    logo: 'https://sponsors.vuejs.org/images/line_corporation.avif',
    url: 'aaa',
  },
  {
    logo: 'https://sponsors.vuejs.org/images/vueschool.avif',
    url: 'bbb',
  },
]);

// 金牌赞助
const goldList = ref([
  {
    logo: 'https://sponsors.vuejs.org/images/famous_fonts.avif',
    url: '',
  },
  {
    logo: 'https://sponsors.vuejs.org/images/herodevs.avif',
    url: '',
  },
  {
    logo: 'https://sponsors.vuejs.org/images/herodevs.avif',
    url: '',
  },
]);

// 银牌赞助
const silverList = ref([
  {
    logo: 'https://sponsors.vuejs.org/images/vuemastery.avif',
    url: '',
  },
  {
    logo: 'https://sponsors.vuejs.org/images/herodevs.avif',
    url: '',
  },
  {
    logo: 'https://sponsors.vuejs.org/images/herodevs.avif',
    url: '',
  },
]);
</script>

<style lang="scss" scoped>
.sponsors-wrap {
  display: flex;
  box-sizing: border-box;
  margin: 0 auto;
  padding-top: 50px;
  width: 960px;
  color: rgb(33, 53, 71);

  .content {
    flex: 1;
    font-size: 16px;
    .title {
      margin: 0;
      margin-bottom: 60px;
      font-weight: 500;
      font-size: 40px;
    }
    .hr {
      margin: 60px 0 20px 0;
      width: 100%;
      height: 1px;
      background-color: #e7e7e7;
    }

    .link {
      color: $theme-color-gold;
      text-decoration: none;
      font-weight: 500;
    }
    .list {
      h2 {
        font-weight: 600;
      }

      .item {
        font-size: 16px;
        &.sponsors {
          h3 {
            margin-top: 50px;
            text-align: center;
          }
          .list {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
          }
          .bg {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            justify-content: center;
            box-sizing: border-box;
            margin-bottom: 5px;
            border-radius: 4px;
            background-color: #f9f9f9;
            cursor: pointer;
            &.platinum {
              width: 100%;
              height: 160px;
              img {
                width: 300px;
              }
            }
            &.gold {
              width: 49%;
              height: 120px;
              img {
                width: 200px;
              }
              // 最后一行是2个元素,则将最后一个元素添加一个30%
              &:last-child:nth-child(2n-1) {
                margin-right: calc(((100% - (49% * 2)) * 1 / 2) + (49% * 1));
              }
              // 最后一行是1个元素
              &:last-child:nth-child(2n-2) {
                margin-right: calc(((100% - (49% * 2)) * 2 / 2) + (49% * 2));
              }
            }
            &.silver {
              width: 32%;
              height: 90px;
              img {
                width: 150px;
              }
              // 最后一行是3个元素,则将最后一行3个元素都添加底部外边距
              &:last-child:nth-child(3n) {
              }
              // 最后一行是2个元素,则将最后一个元素添加一个30%
              &:last-child:nth-child(3n-1) {
                margin-right: calc(((100% - (32% * 3)) * 1 / 4) + (32% * 1));
              }
              // 最后一行是1个元素
              &:last-child:nth-child(3n-2) {
                margin-right: calc(((100% - (32% * 3)) * 2 / 4) + (32% * 2));
              }
            }
            img {
              max-width: 100%;
              max-height: 100%;
            }
          }
        }
      }
    }
  }
  .aside {
    padding-left: 90px;
    width: 150px;

    .title {
      margin-bottom: 8px;
      color: rgb(33, 53, 71);
      font-weight: 700;
      font-size: 12px;
    }
    .item {
      margin-bottom: 8px;
      color: rgba(60, 60, 60, 0.7);
      font-size: 13px;
      cursor: pointer;
      &:hover {
        color: #213547;
      }
    }
  }
}
</style>
