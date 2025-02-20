// WARN 该文件只是方便我将当前项目同步到开源仓库，其他人不需要管这个文件~
import fs from 'node:fs';
import path from 'node:path';
import trash from 'trash';

async function main() {
  await trash(
    '/Users/huangshuisheng/Desktop/hss/billd-project/billd-desk-server-pro/docs/'
  );
  await trash(
    '/Users/huangshuisheng/Desktop/hss/billd-project/billd-desk-server-pro/README.md'
  );

  const docDir =
    '/Users/huangshuisheng/Desktop/hss/billd-project/billd-desk-pro/docs/';

  function getDirAllFile(dirPath) {
    const allFile = [];
    function findFile(inputDir) {
      for (let i = 0; i < inputDir.length; i += 1) {
        const file = inputDir[i];
        const filePath = `${dirPath}${file}`;
        const stat = fs.statSync(filePath);
        const isDir = stat.isDirectory();
        if (!isDir) {
          allFile.push(filePath);
        } else {
          findFile(fs.readdirSync(filePath).map((key) => `${file}/${key}`));
        }
      }
    }
    findFile(fs.readdirSync(dirPath));
    return allFile;
  }

  const allfileArr = getDirAllFile(docDir);

  allfileArr.forEach((url) => {
    const str = fs.readFileSync(url, 'utf-8');
    const desk = url.replace('billd-desk-pro', 'billd-desk-server-pro');
    const deskdir = path.dirname(desk);
    // 检查并创建目录
    if (!fs.existsSync(deskdir)) {
      fs.mkdirSync(deskdir, { recursive: true });
    }
    fs.writeFileSync(desk, str);
  });

  const README = fs.readFileSync(
    '/Users/huangshuisheng/Desktop/hss/billd-project/billd-desk-pro/README.md',
    'utf-8'
  );

  fs.writeFileSync(
    '/Users/huangshuisheng/Desktop/hss/billd-project/billd-desk-pro/README.md',
    README
  );
}

main();
