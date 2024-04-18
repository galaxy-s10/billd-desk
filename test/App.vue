<template>
  <div>
    <video
      ref="videoRef"
      controls
    ></video>
    <button @click="load">load</button>
  </div>
</template>

<script lang="ts" setup>
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { ref } from 'vue';

const ffmpegRef = new FFmpeg();
const videoRef = ref();

async function load() {
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  const ffmpeg = ffmpegRef;
  ffmpeg.on('log', ({ message }) => {
    console.log(message);
  });
  // toBlobURL is used to bypass CORS issue, urls with the same
  // domain can be used directly.
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    workerURL: await toBlobURL(
      `${baseURL}/ffmpeg-core.worker.js`,
      'text/javascript'
    ),
  });
  transcode();
}

async function transcode() {
  await ffmpegRef.writeFile(
    'input.mp4',
    // await fetchFile('/mini-video.mp4')
    // await fetchFile('/2024-02-25.mp4')
    await fetchFile('/2024-02-25-10s.mp4')
    // await fetchFile(
    //   'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm'
    // )
  );
  await ffmpegRef.exec([
    '-i',
    'input.mp4',
    '-vf',
    'scale=-1:1280',
    '-r',
    '20',
    '-crf',
    '23',
    'output.mp4',
  ]);
  const data = await ffmpegRef.readFile('output.mp4');
  console.log(data, 332322);
  videoRef.value.src = URL.createObjectURL(
    new Blob([data.buffer], { type: 'video/mp4' })
  );
}
</script>

<style lang="scss" scoped></style>
