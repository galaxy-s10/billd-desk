<template>
  <div class="team-wrap">
    <h1 class="title">认识团队</h1>
    <p class="desc">
      billd-live目前是个人开发，暂时没有贡献者，但以后可能会有，以下是目前部分团队成员的个人信息。
    </p>
    <div class="hr"></div>
    <div class="core-team">
      <div class="info">
        <h2 class="title">核心团队成员</h2>
        <div class="desc">
          核心团队成员是那些积极参与维护一个或多个核心项目的人。他们对billd-live
          的生态系统做出了重大贡献，并对项目及其用户的成功做出了长期的承诺。
        </div>
      </div>
      <div class="members">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="item"
        >
          <img
            class="avatar"
            src="https://www.github.com/galaxy-s10.png"
            alt=""
          />
          <div class="data">
            <div class="name">{{ item.name }}</div>
            <div class="org">{{ item.org }}</div>
            <div class="profiles">
              <div class="desc skills">
                <n-icon size="18">
                  <CodeOutline></CodeOutline>
                </n-icon>
                <div class="txt">
                  <a
                    v-for="(iten, indey) in item.skill"
                    :key="'skill-' + indey"
                    class="skill link"
                    :href="iten.github"
                    @click.prevent="openToTarget(iten.github)"
                  >
                    {{ iten.label }}
                  </a>
                </div>
              </div>
              <div class="desc">
                <n-icon size="18">
                  <LocationOutline></LocationOutline>
                </n-icon>
                <div class="txt">{{ item.country }}</div>
              </div>
              <div class="desc langues">
                <n-icon size="18">
                  <GlobeOutline></GlobeOutline>
                </n-icon>
                <div class="txt">
                  <span
                    v-for="(iten, indey) in item.langues"
                    :key="'lang-' + indey"
                    class="langue"
                  >
                    {{ iten }}
                  </span>
                </div>
              </div>
              <div class="desc">
                <n-icon size="18">
                  <Link></Link>
                </n-icon>
                <a
                  :href="item.website"
                  class="txt link"
                  @click.prevent="openToTarget(item.website)"
                >
                  {{ item.website }}
                </a>
              </div>
            </div>
            <div class="social-list">
              <a
                v-for="(iten, indez) in item.social"
                :key="'social-' + indez"
                class="social link"
                :href="iten.github"
                @click.prevent="openToTarget(iten.github)"
              >
                <n-icon
                  size="22"
                  class="ico"
                >
                  <LogoGithub></LogoGithub>
                </n-icon>
              </a>
            </div>
          </div>
          <div class="sponsor">
            <n-icon
              size="18"
              class="ico"
            >
              <HeartOutline></HeartOutline>
            </n-icon>
            赞助
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  CodeOutline,
  GlobeOutline,
  HeartOutline,
  Link,
  LocationOutline,
  LogoGithub,
} from '@vicons/ionicons5';
import { openToTarget } from 'billd-utils';
import { ref } from 'vue';

import { prodDomain } from '@/spec-config';

const list = ref([
  {
    avatar: 'https://www.github.com/galaxy-s10.png',
    name: 'galaxy-s10',
    org: 'Creator @billd-live',
    country: 'Guangzho, China',
    langues: ['中文'],
    skill: [
      {
        label: 'billd-live',
        github: 'https://github.com/galaxy-s10/billd-live',
      },
      {
        label: 'billd-live-admin',
        github: 'https://github.com/galaxy-s10/billd-live-admin',
      },
      {
        label: 'billd-live-server',
        github: 'https://github.com/galaxy-s10/billd-live-server',
      },
    ],
    social: [{ github: 'https://www.github.com/galaxy-s10' }],
    website: `https://www.${prodDomain}`,
  },
]);
</script>

<style lang="scss" scoped>
.team-wrap {
  box-sizing: border-box;
  margin: 0 auto;
  padding-top: 50px;
  width: 960px;
  .link {
    color: $theme-color-gold;
    text-decoration: none;
    cursor: pointer;
  }

  .title {
    margin: 0;
    font-weight: 500;
    font-size: 40px;
  }
  .desc {
    margin: 0;
    color: #3c3c3cb3;
    font-size: 16px;
    line-height: 1.8;
  }
  .hr {
    margin: 60px 0 20px 0;
    width: 100%;
    height: 1px;
    background-color: #e7e7e7;
  }
  .core-team {
    display: flex;
    justify-content: space-between;
    padding-bottom: 30px;
    .info {
      .title {
        font-size: 20px;
      }
      .desc {
        box-sizing: border-box;
        margin-top: 3px;
        padding-right: 60px;
        width: 300px;
        font-size: 14px;
        line-height: 1.8;
      }
    }
    .members {
      flex-grow: 0.8;
      .item {
        position: relative;
        display: flex;
        padding: 30px 0;
        border-radius: 10px;
        background-color: #f9f9f9;
        .avatar {
          margin-left: 30px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
        .data {
          margin-left: 30px;
          .name {
            margin-bottom: 2px;
            font-size: 20px;
          }
          .org {
            margin-bottom: 10px;
            font-size: 14px;
          }
          .profiles {
            margin-bottom: 10px;

            .desc {
              display: flex;
              align-items: center;
              margin-bottom: 7px;
              .txt {
                margin-left: 10px;
              }
              &.langues,
              &.skills {
                .langue:not(:last-child),
                .skill:not(:last-child) {
                  &:after {
                    margin: 0 7px;
                    color: #3c3c3c54;
                    content: '•';
                    font-size: 14px;
                  }
                }
              }
            }
          }
          .social-list {
            padding-top: 2px;
            .social {
              color: #747474;
              cursor: pointer;
            }
          }
        }
        .sponsor {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          padding: 4px 8px;
          border: 1px solid $theme-color-gold;
          border-radius: 4px;
          color: $theme-color-gold;
          cursor: pointer;
          transition: all 0.3s ease;
          &:hover {
            background-color: $theme-color-gold;
            color: white;
          }
          .ico {
            margin-right: 4px;
          }
        }
      }
    }
  }
}
</style>
