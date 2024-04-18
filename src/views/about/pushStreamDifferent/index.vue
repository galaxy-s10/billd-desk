<template>
  <div class="release-wrap">
    <div class="content">
      <h1 class="title">不同开播的区别</h1>
      <div class="hr"></div>
      <div class="list">
        <div class="item">
          <h2>SRS直播</h2>
          <p>
            推流到服务器，由服务器的SRS进行转发（RTMP、FLV、HLS、WebRTC等）。
          </p>
          <p>优点：不同客户端都能拉流；缺点：对服务器带宽要求高。</p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>WebRTC直播</h2>
          <p>原生WebRTC一对多。</p>
          <p>优点：延迟低。缺点：对客户端上传带宽要求高。</p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>WebRTC会议</h2>
          <p>原生WebRTC多对多。</p>
          <p>优点：延迟低。缺点：对客户端上传带宽要求高。</p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>Msr直播</h2>
          <p>
            类似bilibili的web直播间实现，浏览器录制直播画面，并上传到服务器进行推流。
          </p>
          <p>
            优点：兼容性对比webRTC好；缺点：延迟高，且对网络要求严格，并且也需要后端和音视频相关部门的支持。
          </p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>打PK直播</h2>
          <p>
            不同主播之间进行直播互动，然后由任意一个主播将所有画面进行混流，推送到服务器的SRS进行转发，让观众能看到这个直播互动。
          </p>
          <p>此方式是webRTC直播和SRS直播的混合，优缺点也继承自它们。</p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>腾讯云直播</h2>
          <p>
            推流到腾讯云云直播，由腾讯云进行转发（RTMP、FLV、HLS、WebRTC等）。
          </p>
          <p>优点：腾讯云云直播自带CDN；缺点：收费。</p>
        </div>
        <div class="item">
          <h2>腾讯云打PK</h2>
          <p>在打PK直播的基础上，将SRS替换成腾讯云云直播。</p>
          <p>优点：腾讯云云直播自带CDN；缺点：收费。</p>
        </div>
      </div>
    </div>
    <div class="aside">
      <div class="title">本页目录</div>
      <div class="item">SRS直播</div>
      <div class="item">WebRTC直播</div>
      <div class="item">WebRTC会议</div>
      <div class="item">Msr直播</div>
      <div class="item">打PK直播</div>
      <div class="item">腾讯云直播</div>
      <div class="item">腾讯云打PK</div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.release-wrap {
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
      margin-bottom: 20px;
    }
    .hr {
      margin: 60px 0 20px 0;
      width: 100%;
      height: 1px;
      background-color: #e7e7e7;
    }
    .list {
      h2 {
        font-weight: 600;
      }
      .item {
        position: relative;
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
