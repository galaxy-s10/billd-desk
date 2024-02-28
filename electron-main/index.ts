// const { mouse, left } = require('@nut-tree/nut-js');
import path from 'path';

import { BrowserWindow, app, desktopCapturer, ipcMain } from 'electron';

const nutjs = require('@nut-tree/nut-js');

// 该版本electron所对应的node版本
console.log('process.version', process.version);
// electron 版本
console.log('process.versions.electron', process.versions.electron);
// abi
console.log('process.versions.modules', process.versions.modules);

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null;

async function getScreenStream() {
  const inputSources = await desktopCapturer.getSources({
    types: ['screen'],
  });
  const res: any[] = [];
  Object.keys(inputSources).forEach((key) => {
    const source = inputSources[key];
    if (!res.length) {
      res.push(source);
    }
  });
  win?.webContents.send('getScreenStream', res[0]);
}

function createWindow() {
  let x = 100;
  let y = 100;
  ipcMain.on('changeMousePosition', () => {
    console.log('收到changeMousePosition');
    x += 10;
    y += 10;
    nutjs.mouse.setPosition({ x, y });
  });
  ipcMain.on('getMousePosition', async () => {
    console.log('收到getMousePosition');
    const point = await nutjs.mouse.getPosition();
    console.log(point);
  });
  ipcMain.on('getScreenStream', () => {
    console.log('收到getScreenStream');
    getScreenStream();
  });
  win = new BrowserWindow({
    // @ts-ignore
    icon: path.join(process.env.VITE_PUBLIC, 'logo.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', (event) => {
    console.log('did-finish-load事件', event);
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
