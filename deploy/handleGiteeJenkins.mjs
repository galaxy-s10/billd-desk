// WARN 该文件只是方便我将当前项目复制一份到我电脑的另一个位置（gitee私有仓库的位置)，其他人不需要管这个文件~

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import trash from 'trash';

const allFile = [];
const ignore = ['.DS_Store', '.git', 'node_modules', 'dist'];
const localDir = '/Users/huangshuisheng/Desktop/hss/galaxy-s10/desk';
const giteeDir = '/Users/huangshuisheng/Desktop/hss/jenkins/billd-desk';

const dir = fs.readdirSync(localDir).filter((item) => {
  if (ignore.includes(item)) {
    return false;
  }
  return true;
});

function findFile(inputDir) {
  for (let i = 0; i < inputDir.length; i += 1) {
    const file = inputDir[i];
    const filePath = `${localDir}/${file}`;
    const stat = fs.statSync(filePath);
    const isDir = stat.isDirectory();
    if (!isDir) {
      allFile.push(filePath);
    } else {
      findFile(fs.readdirSync(filePath).map((key) => `${file}/${key}`));
    }
  }
}

function putFile() {
  for (let i = 0; i < allFile.length; i += 1) {
    const file = allFile[i];
    const arr = [];
    const githubFile = file.replace(localDir, '');
    const githubFileArr = githubFile.split('/').filter((item) => item !== '');
    githubFileArr.forEach((item) => {
      if (arr.length) {
        arr.push(path.resolve(arr[arr.length - 1], item));
      } else {
        arr.push(path.resolve(giteeDir, item));
      }
    });
    arr.forEach((item, index) => {
      // 数组的最后一个一定是文件，因此不需要判断它是不是目录
      if (index !== arr.length - 1) {
        const flag = fs.existsSync(item);
        // eslint-disable-next-line
        !flag && fs.mkdirSync(item);
      }
    });
    fs.copyFileSync(
      file,
      path.join(giteeDir, './', file.replace(localDir, ''))
    );
  }
}

async function clearOld() {
  const giteeDirAllFile = fs.readdirSync(giteeDir);
  const queue = [];
  giteeDirAllFile.forEach((url) => {
    const fullurl = `${giteeDir}/${url}`;
    if (!['node_modules', '.git'].includes(url)) {
      queue.push(trash(fullurl));
    }
  });
  await Promise.all(queue);
}

const newPkgStr = fs.readFileSync(
  path.resolve(localDir, 'package.json'),
  'utf-8'
);
const viteConfigStr = fs.readFileSync(
  path.resolve(localDir, './deploy/vite.config.ts'),
  'utf-8'
);
const tsconfigStr = fs.readFileSync(
  path.resolve(localDir, './deploy/tsconfig.json'),
  'utf-8'
);
const newPkg = JSON.parse(newPkgStr);
delete newPkg['devDependencies']['@electron-toolkit/preload'];
delete newPkg['devDependencies']['@electron/rebuild'];
delete newPkg['devDependencies']['electron'];
delete newPkg['devDependencies']['electron-builder'];
delete newPkg['devDependencies']['electron-icon-builder'];

if (process.cwd().indexOf('jenkins') !== -1) {
  console.log('当前目录错误');
} else {
  clearOld().then(() => {
    findFile(dir);
    putFile();
    const gitignoreTxt =
      'node_modules\ndist\ncomponents.d.ts\n.eslintcache\n.DS_Store\n';
    fs.writeFileSync(path.resolve(giteeDir, './.gitignore'), gitignoreTxt);
    fs.writeFileSync(
      path.resolve(giteeDir, 'package.json'),
      // @ts-ignore
      JSON.stringify({ ...newPkg }, {}, 2)
    );
    fs.writeFileSync(
      path.resolve(giteeDir, 'vite.config.ts'),
      // @ts-ignore
      viteConfigStr
    );
    fs.writeFileSync(
      path.resolve(giteeDir, 'tsconfig.json'),
      // @ts-ignore
      tsconfigStr
    );
    execSync(`pnpm i`, { cwd: giteeDir });
    execSync(`git add .`, { cwd: giteeDir });
    execSync(`git commit -m 'feat: ${new Date().toLocaleString()}'`, {
      cwd: giteeDir,
    });
    execSync(`git push`, { cwd: giteeDir });
  });
}
