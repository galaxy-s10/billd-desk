## 应用图标缓存问题

如果应用图标不更新，可以尝试替换一个图标图片再打包，或者你不希望换图标图片的话，可以将现在的图标图片拿去压缩一下，亲测也能解决问题。

## pnpm 安装 electron 时卡在 postinstall

1. 直接 ctrl+c 退出 npm 安装
2. 进入 node_modules/electron/install.js，将
   ```js
   downloadArtifact({
     version,
     artifactName: 'electron',
     force: process.env.force_no_cache === 'true',
     cacheRoot: process.env.electron_config_cache,
     checksums:
       process.env.electron_use_remote_checksums ??
       process.env.npm_config_electron_use_remote_checksums
         ? undefined
         : require('./checksums.json'),
     platform,
     arch,
   })
     .then(extractFile)
     .catch((err) => {
       console.error(err.stack);
       process.exit(1);
     });
   ```
   修改为：
   ```js
   downloadArtifact({
     version,
     artifactName: 'electron',
     force: process.env.force_no_cache === 'true',
     cacheRoot: process.env.electron_config_cache,
     checksums:
       process.env.electron_use_remote_checksums ??
       process.env.npm_config_electron_use_remote_checksums
         ? undefined
         : require('./checksums.json'),
     platform,
     arch,
     mirrorOptions: {
       mirror: 'https://npmmirror.com/mirrors/electron/',
       platform,
       arch,
     },
   })
     .then(extractFile)
     .catch((err) => {
       console.error(err.stack);
       process.exit(1);
     });
   ```
3. 在 node_modules/electron 目录下执行 node install

## rebuild

```bash
npm config set registry https://registry.npmmirror.com
```

```bash
./node_modules/.bin/electron-rebuild
```

## rebuild 时 cpu-feature 报错

直接删了 node_modules 的 cpu-feature，然后重新 rebuild
