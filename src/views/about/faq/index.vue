<template>
  <div class="faq-wrap">
    <div class="content">
      <h1 class="title">常见问题</h1>
      <div class="hr"></div>
      <div class="list">
        <div class="item">
          <h2>如何本地运行billd-live？</h2>
          <p>
            一： 仔细看完
            <span
              class="link"
              @click="
                openToTarget('https://github.com/galaxy-s10/billd-live#readme')
              "
            >
              billd-live的Readme
            </span>
          </p>
          <p>
            二：仔细看完
            <span
              class="link"
              @click="openToTarget(COMMON_URL.bilibiliCollectiondetail)"
            >
              b站教程（封面是"从零搭建迷你b站直播间"）
            </span>
          </p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>billd-live是什么？</h2>
          <p>
            billd-live 是一个web端的直播平台，目前支持使用WebRTC或SRS进行直播：
          </p>
          <p>- 原生webrtc一对多直播（DONE）</p>
          <p>- srs-webrtc一对多直播（DONE）</p>
          <p>- 原生webrtc多对多直播（DONE）</p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>谁在维护billd-live？</h2>
          <p>
            billd-live 是由
            <a
              :href="AUTHOR_GITHUB"
              target="_blank"
              class="link"
            >
              galaxy-s10
            </a>
            在 2023 年作为其个人项目创建的，目前只有作者一人维护。
          </p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>billd-live使用了什么技术栈？</h2>
          <p>billd-live是一个偏前端的全栈项目，几乎所有技术栈都是前端相关。</p>
          <p>
            前端相关：Typescript、Vue3、<a
              target="_blank"
              class="link"
              href="https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API"
            >
              WebRTC </a
            >、Web Audio、Web Worker、Canvas
          </p>
          <p>后端相关：Node、Koa2、MySQL、Redis、Socket.io、 Typescript</p>
          <p>
            音视频相关：
            <a
              target="_blank"
              class="link"
              href="https://ossrs.net"
            >
              SRS
            </a>
            <span>、</span>
            <a
              target="_blank"
              class="link"
              href="https://ffmpeg.org"
            >
              FFmpeg
            </a>
          </p>
          <p>部署相关：Docker、Jenkins</p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>obs/ffmpeg推流到billd-live失败</h2>
          <p>
            服务器性能有限，限制了推流码率为：<b>3000kbps</b>，超过则会导致推流失败！
          </p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>如何参与贡献？</h2>
          <p>非常欢迎！欢迎提Issue 或 PR！</p>
        </div>
      </div>
    </div>
    <div class="aside">
      <div class="title">本页目录</div>
      <div class="item">如何本地运行billd-live？</div>
      <div class="item">billd-live是什么？</div>
      <div class="item">谁在维护billd-live？</div>
      <div class="item">billd-live使用了什么技术栈？</div>
      <div class="item">obs/ffmpeg推流到billd-live失败</div>
      <div class="item">如何参与贡献？</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';

import { AUTHOR_GITHUB, COMMON_URL } from '@/constant';
</script>

<style lang="scss" scoped>
.faq-wrap {
  display: flex;
  box-sizing: border-box;
  margin: 0 auto;
  padding-top: 50px;
  width: 960px;
  color: rgb(33, 53, 71);

  .content {
    flex: 1;
    .title {
      margin: 0;
      font-weight: 500;
      font-size: 40px;
      margin-bottom: 60px;
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
      cursor: pointer;
    }
    .list {
      h2 {
        font-weight: 600;
      }
      .item {
        font-size: 16px;
      }
    }
  }
  .aside {
    padding-left: 90px;
    width: 150px;

    .title {
      color: rgb(33, 53, 71);
      font-weight: 700;
      font-size: 12px;
      margin-bottom: 8px;
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
