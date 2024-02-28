// const { mouse, left } = require('@nut-tree/nut-js');
import path from 'path';

// import nutjs from '@nut-tree/nut-js';

// eslint-disable-next-line
// @ts-ignore
import { app, BrowserWindow } from 'electron';

const nutjs = require('@nut-tree/nut-js');

// 该版本electron所对应的node版本
console.log('process.version', process.version);
// electron 版本
console.log('process.versions.electron', process.versions.electron);
// abi
console.log('process.versions.modules', process.versions.modules);

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
// The built directory structure
//
// ├─┬ dist
// │ ├─┬ electron
// │ │ ├── main.js
// │ │ └── preload.js
// │ ├── index.html
// │ ├── ...other-static-files-from-public
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    // @ts-ignore
    icon: path.join(process.env.VITE_PUBLIC, 'logo.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', (event) => {
    console.log('did-finish-load事件：', event);
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  win.once('ready-to-show', () => {
    console.log('mouse');
    setTimeout(() => {
      nutjs.mouse.setPosition({ x: 100, y: 100 });
    }, 1000);
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    // @ts-ignore
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

app.on('window-all-closed', () => {
  app.quit();
  win = null;
});

app.whenReady().then(createWindow);
