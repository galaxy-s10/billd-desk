<template>
  <div class="slider-cpt-wrap">
    <div
      v-for="(slider, index) in sliderList"
      :key="'slider-' + index"
      class="slider"
      :class="{ [direction]: 1 }"
      :style="{
        width: width + 'px',
        '--container-width': widthMap[0],
        '--speed':
          width === 'auto' ? widthMap[0] / speed + 's' : width / speed + 's',
        ...styles,
      }"
    >
      <div
        ref="containerRef"
        class="container"
      >
        <div
          v-for="(slide, indey) in slider"
          :key="'slide-' + indey"
          class="slide"
          :data-txt="slide.txt"
          @click="openToTarget(slide.link)"
        >
          <div class="avatar">
            <div
              alt=""
              class="img"
              :style="{ backgroundImage: `url(${slide.img})` }"
            ></div>
          </div>

          <span class="txt">
            {{ slide.txt }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { CSSProperties, computed, nextTick, onMounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    list: any[];
    width: number | 'auto';
    speed: number;
    customStyle?: CSSProperties;
    direction?: 'l-r' | 'r-l';
  }>(),
  {
    list: () => [],
    // 宽度
    width: document.documentElement.clientWidth,
    // 滚动速率 (px/s)
    speed: 100,
    // @ts-ignore
    customStyle: () => {},
    direction: 'l-r',
  }
);

const containerRef = ref<HTMLDivElement[]>([]);
const sliderList = ref<any[]>([]);
const widthMap = ref<Record<number, number>>({});
const min = ref(0);

const styles = computed(() => {
  return {
    ...props.customStyle,
  } as CSSProperties;
});

onMounted(() => {
  sliderList.value = [[...props.list]];
  nextTick(() => {
    const res = {};
    containerRef.value.forEach((container, index) => {
      for (let i = 0; i < container.children.length; i += 1) {
        const slideList = container.children;
        for (let y = 0; y < slideList.length; y += 1) {
          const slide = slideList[y];
          if (index === i) {
            res[index] = res[index] || 0;
            res[index] += slide.getBoundingClientRect().width;
          }
        }
      }
    });

    Object.keys(res).forEach((item) => {
      if (min.value === 0) {
        min.value = res[item];
      }
      if (res[item] < min.value) {
        min.value = res[item];
      }
    });
    widthMap.value = res;
    if (props.width === 'auto') {
      sliderList.value[0].push(...props.list);
    } else if (widthMap.value[0] < props.width) {
      const num = (Math.ceil(widthMap.value[0] / props.width) + 1) * 2;
      for (let i = 0; i < num; i += 1) {
        sliderList.value[0].push(...props.list);
      }
      // console.log(
      //   '如果传入的宽度比一次展示的宽度要大，则一次滚动不完，则复制一份不够'
      // );
    } else if (widthMap.value[0] > props.width) {
      sliderList.value[0].push(...props.list);
      // console.log('如果传入的宽度比一次展示的宽度要小，则一次滚动即可');
    }
  });
});
</script>

<style lang="scss" scoped>
@keyframes left-right {
  0% {
    transform: translateX(calc(var(--container-width) * -1px));
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes right-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(var(--container-width) * -1px));
  }
}
.slider-cpt-wrap {
  overflow: hidden;
  .slider {
    position: relative;
    overflow: scroll;

    @extend %hideScrollbar;

    &.l-r {
      .container {
        animation: left-right var(--speed) linear infinite;
        &:hover {
          animation-play-state: paused;
        }
      }
    }
    &.r-l {
      .container {
        animation: right-left var(--speed) linear infinite;
        &:hover {
          animation-play-state: paused;
        }
      }
    }

    .container {
      display: inline-flex;

      .slide {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding-right: 30px;
        height: 40px;
        cursor: pointer;
        .avatar {
          display: flex;
          overflow: hidden;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #fff;

          .img {
            width: 25px;
            height: 25px;

            @extend %containBg;
          }
        }
        .txt {
          // max-width: 130px;
          font-size: 14px;

          @extend %singleEllipsis;
        }
      }
    }
  }
}
</style>
