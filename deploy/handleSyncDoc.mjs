// WARN 该文件只是方便我将当前项目同步到开源仓库，其他人不需要管这个文件~
import fs from 'node:fs';
import path from 'node:path';
import trash from 'trash';

const deskDir =
  '/Users/huangshuisheng/Desktop/hss/billd-project/billd-desk-pro/';

const deskAdminDir =
  '/Users/huangshuisheng/Desktop/hss/billd-project/billd-desk-admin-pro/';
const deskServerDir =
  '/Users/huangshuisheng/Desktop/hss/billd-project/billd-desk-server-pro/';

async function main() {
  const deskDocDir = deskDir + 'docs/';
  const deskServerDocDir = deskServerDir + 'docs/';
  const deskAdminDocDir = deskAdminDir + 'docs/';

  await trash(deskServerDocDir);
  await trash(deskAdminDocDir);

  await trash(deskServerDir + 'README.md');
  await trash(deskAdminDir + 'README.md');

  const README = fs.readFileSync(deskDir + '/README.md', 'utf-8');

  fs.writeFileSync(deskServerDir + '/README.md', README);
  fs.writeFileSync(deskAdminDir + '/README.md', README);

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

  const allfileArr = getDirAllFile(deskDocDir);

  function copyToDest(fileArr, destDir) {
    fileArr.forEach((url) => {
      const str = fs.readFileSync(url, 'utf-8');
      const txt1 = url.replace(deskDocDir, '');
      const desk = destDir + txt1;
      const deskdir = path.dirname(desk);
      // 检查并创建目录
      if (!fs.existsSync(deskdir)) {
        fs.mkdirSync(deskdir, { recursive: true });
      }
      fs.writeFileSync(desk, str);
    });
  }
  copyToDest(allfileArr, deskServerDocDir);
  copyToDest(allfileArr, deskAdminDocDir);
}

main();
