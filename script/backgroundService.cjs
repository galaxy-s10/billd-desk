// import { ipcMain } from 'electron';
// const nutjs = require('@nut-tree-fork/nut-js');
// const { ipcMain } = require('electron');
// const fs = require('fs');
// const path = require('path');
// import fs from 'fs';
// import path from 'path';

// console.log('ipcMain.on', ipcMain.on);

// ipcMain.on('mouseMove', async (_event, reqData) => {
//   console.log(`electron收到${'mouseMove'}`, reqData);
//   const { requestId, data } = reqData;
//   const { windowId, x, y } = data;
//   try {
//     await nutjs.mouse.move([{ x, y }]);
//   } catch (error) {
//     console.log(error);
//   }
// });

// ipcMain.on('mouseMove2', (_event, reqData) => {
//   console.log(`electron收到${'mouseMove2'}`, reqData);
// });

const http = require('http');

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 获取请求的 URL
  const url = req.url;

  // 路由处理
  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ msg: '首页' }));
  } else if (url === '/about') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ msg: 'about' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ msg: '404' }));
  }
});

// 服务器监听指定端口
const PORT = 8002;
server.listen(PORT, () => {
  console.log(`服务器正在运行，访问 http://localhost:${PORT}`);
});

// setInterval(() => {
//   console.log('1113');
//   console.log(fs, path);
//   console.log('process.argv', process.argv);
//   const index = process.argv.findIndex((v) => v === '--path');
//   if (index !== -1) {
//     const path1 = process.argv[index + 1];
//     console.log(path1);
//     if (path1) {
//       fs.writeFile(
//         path.resolve(path1, 'text.txt'),
//         `${new Date().toLocaleString()}\n`,
//         {
//           flag: 'a', // a：追加写入；w：覆盖写入
//         },
//         (err) => {
//           if (err) {
//             console.error(err);
//           }
//         }
//       );
//     }
//   }
// }, 1000);
