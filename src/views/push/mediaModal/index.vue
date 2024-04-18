<template>
  <div class="media-wrap">
    <Modal
      :title="`${isEdit ? '编辑' : '添加'}直播素材`"
      :mask-closable="false"
      @close="emits('close')"
    >
      <div class="container">
        <div
          v-if="inputOptions.length"
          class="item"
        >
          <div class="label">设备选择</div>
          <div class="value">
            <n-select
              v-model:value="currentInput.deviceId"
              :options="inputOptions"
              :disabled="isEdit"
            />
          </div>
        </div>

        <div class="item">
          <div class="label">名称</div>
          <div class="value">
            <n-input v-model:value="mediaName" />
          </div>
        </div>
        <template v-if="props.mediaType === MediaTypeEnum.txt && txtInfo">
          <div class="item">
            <div class="label">内容</div>
            <div class="value">
              <n-input
                type="textarea"
                ref="inputInstRef"
                v-model:value="txtInfo.txt"
              />
            </div>
          </div>
          <div class="item">
            <div class="label">颜色</div>
            <div class="value">
              <n-color-picker v-model:value="txtInfo.color" />
            </div>
          </div>
        </template>
        <template v-if="props.mediaType === MediaTypeEnum.time && timeInfo">
          <div class="item">
            <div class="label">颜色</div>
            <div class="value">
              <n-color-picker v-model:value="timeInfo.color" />
            </div>
          </div>
        </template>
        <template
          v-if="props.mediaType === MediaTypeEnum.stopwatch && stopwatchInfo"
        >
          <div class="item">
            <div class="label">颜色</div>
            <div class="value">
              <n-color-picker v-model:value="stopwatchInfo.color" />
            </div>
          </div>
        </template>
        <template v-if="props.mediaType === MediaTypeEnum.img">
          <div class="item">
            <div class="label">图片</div>
            <div class="value">
              <n-upload
                :max="1"
                :accept="'image/png, image/jpeg, image/webp'"
                :on-update:file-list="changImg"
              >
                <n-button :disabled="isEdit">选择文件</n-button>
              </n-upload>
            </div>
          </div>
        </template>
        <template v-if="props.mediaType === MediaTypeEnum.media">
          <div class="item">
            <div class="label">视频</div>
            <div class="value">
              <n-upload
                :max="1"
                :accept="'video/mp4, video/quicktime'"
                :on-update:file-list="changMedia"
              >
                <n-button :disabled="isEdit">选择文件</n-button>
              </n-upload>
            </div>
          </div>
        </template>
      </div>

      <template #footer>
        <div class="margin-right">
          <n-button
            type="primary"
            @click="handleOk"
          >
            确定
          </n-button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { InputInst, UploadFileInfo } from 'naive-ui';
import { onMounted, ref } from 'vue';

import { MediaTypeEnum } from '@/interface';
import { AppRootState, useAppStore } from '@/store/app';

const inputInstRef = ref<InputInst | null>(null);
const mediaName = ref('');
const appStore = useAppStore();

const props = withDefaults(
  defineProps<{
    mediaType?: MediaTypeEnum;
    isEdit: boolean;
    initData?: AppRootState['allTrack'][0];
  }>(),
  {
    mediaType: MediaTypeEnum.camera,
    isEdit: false,
    initData: undefined,
  }
);
const emits = defineEmits(['close', 'addOk', 'editOk']);

const inputOptions = ref<{ label: string; value: string }[]>([]);
const txtInfo = ref<{ txt: string; color: string }>();
const timeInfo = ref<{ color: string }>();
const stopwatchInfo = ref<{ color: string }>();
const imgInfo = ref<UploadFileInfo[]>();
const mediaInfo = ref<UploadFileInfo[]>();
const currentInput = ref<{
  type: MediaTypeEnum;
  deviceId: string;
}>({
  type: MediaTypeEnum.camera,
  deviceId: '',
});

onMounted(() => {
  init();
});

function changImg(list: UploadFileInfo[]) {
  imgInfo.value = list;
}
function changMedia(list: UploadFileInfo[]) {
  mediaInfo.value = list;
}

function handleOk() {
  if (mediaName.value.length < 4 || mediaName.value.length > 10) {
    window.$message.info('名称要求4-10个字符！');
    return;
  }
  if (props.mediaType === MediaTypeEnum.txt) {
    if (txtInfo.value?.txt?.length! < 3 || txtInfo.value?.txt?.length! > 100) {
      window.$message.info('内容要求3-100个字符！');
      return;
    }
  }
  if (!props.isEdit) {
    if (props.mediaType === MediaTypeEnum.img) {
      if (imgInfo.value?.length! !== 1) {
        window.$message.info('请选择图片！');
        return;
      }
    }
    if (props.mediaType === MediaTypeEnum.media) {
      if (mediaInfo.value?.length! !== 1) {
        window.$message.info('请选择视频！');
        return;
      }
    }
  }
  if (props.isEdit) {
    emits('editOk', {
      ...props.initData,
      ...currentInput.value,
      mediaName: mediaName.value,
      txtInfo: txtInfo.value,
      imgInfo: imgInfo.value,
      mediaInfo: mediaInfo.value,
      timeInfo: timeInfo.value,
      stopwatchInfo: stopwatchInfo.value,
    });
  } else {
    emits('addOk', {
      ...currentInput.value,
      mediaName: mediaName.value,
      txtInfo: txtInfo.value,
      imgInfo: imgInfo.value,
      mediaInfo: mediaInfo.value,
      timeInfo: timeInfo.value,
      stopwatchInfo: stopwatchInfo.value,
    });
  }
}

async function init() {
  const res = await navigator.mediaDevices.enumerateDevices();
  if (props.mediaType === MediaTypeEnum.microphone) {
    res.forEach((item) => {
      if (item.kind === 'audioinput' && item.deviceId !== 'default') {
        inputOptions.value.push({
          label: item.label,
          value: item.deviceId,
        });
      }
    });
    currentInput.value = {
      ...currentInput.value,
      deviceId: inputOptions.value[0].value,
      type: MediaTypeEnum.microphone,
    };
    mediaName.value = `麦克风-${
      appStore.allTrack
        .filter((item) => item.type === MediaTypeEnum.microphone)
        .filter((item) => !item.hidden).length + 1
    }`;
  } else if (props.mediaType === MediaTypeEnum.camera) {
    res.forEach((item) => {
      if (item.kind === 'videoinput' && item.deviceId !== 'default') {
        inputOptions.value.push({
          label: item.label,
          value: item.deviceId,
        });
      }
    });
    currentInput.value = {
      ...currentInput.value,
      deviceId: inputOptions.value[0].value,
      type: MediaTypeEnum.camera,
    };
    mediaName.value = `摄像头-${
      appStore.allTrack
        .filter((item) => item.type === MediaTypeEnum.camera)
        .filter((item) => !item.hidden).length + 1
    }`;
  } else if (props.mediaType === MediaTypeEnum.screen) {
    currentInput.value = {
      ...currentInput.value,
      type: MediaTypeEnum.screen,
    };
    mediaName.value = `窗口-${
      appStore.allTrack
        .filter((item) => item.type === MediaTypeEnum.screen)
        .filter((item) => !item.hidden).length + 1
    }`;
  } else if (props.mediaType === MediaTypeEnum.txt) {
    currentInput.value = {
      ...currentInput.value,
      type: MediaTypeEnum.txt,
    };
    txtInfo.value = { txt: '', color: 'rgba(255,215,0,1)' };
    mediaName.value = `文字-${
      appStore.allTrack
        .filter((item) => item.type === MediaTypeEnum.txt)
        .filter((item) => !item.hidden).length + 1
    }`;
    setTimeout(() => {
      inputInstRef.value?.focus();
    }, 100);
  } else if (props.mediaType === MediaTypeEnum.time) {
    currentInput.value = {
      ...currentInput.value,
      type: MediaTypeEnum.time,
    };
    timeInfo.value = { color: 'rgba(255,215,0,1)' };
    mediaName.value = `时间-${
      appStore.allTrack
        .filter((item) => item.type === MediaTypeEnum.time)
        .filter((item) => !item.hidden).length + 1
    }`;
  } else if (props.mediaType === MediaTypeEnum.stopwatch) {
    currentInput.value = {
      ...currentInput.value,
      type: MediaTypeEnum.stopwatch,
    };
    stopwatchInfo.value = { color: 'rgba(255,215,0,1)' };
    mediaName.value = `秒表-${
      appStore.allTrack
        .filter((item) => item.type === MediaTypeEnum.stopwatch)
        .filter((item) => !item.hidden).length + 1
    }`;
  } else if (props.mediaType === MediaTypeEnum.img) {
    currentInput.value = {
      ...currentInput.value,
      type: MediaTypeEnum.img,
    };
    imgInfo.value = [];
    mediaName.value = `图片-${
      appStore.allTrack
        .filter((item) => item.type === MediaTypeEnum.img)
        .filter((item) => !item.hidden).length + 1
    }`;
  } else if (props.mediaType === MediaTypeEnum.media) {
    currentInput.value = {
      ...currentInput.value,
      type: MediaTypeEnum.media,
    };
    mediaInfo.value = [];
    mediaName.value = `视频-${
      appStore.allTrack
        .filter((item) => item.type === MediaTypeEnum.media)
        .filter((item) => !item.hidden).length + 1
    }`;
  }
  if (props.initData) {
    if (
      [MediaTypeEnum.camera, MediaTypeEnum.microphone].includes(
        props.initData.type
      )
    ) {
      currentInput.value = {
        deviceId: props.initData.deviceId!,
        type: props.initData.type,
      };
    }
    mediaName.value = props.initData.mediaName;
    timeInfo.value = props.initData.timeInfo;
    txtInfo.value = props.initData.txtInfo;
    stopwatchInfo.value = props.initData.stopwatchInfo;
  }
}
</script>

<style lang="scss" scoped>
.media-wrap {
  text-align: initial;

  .container {
    .item {
      .label {
        margin: 6px 0;
      }
    }
    .margin-right {
      text-align: right;
    }
  }
}
</style>
