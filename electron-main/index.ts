import path from 'path';
import { platform } from 'process';

import {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  Menu,
  powerMonitor,
  powerSaveBlocker,
  screen,
  shell,
} from 'electron';

import { IPC_EVENT } from '../src/event';
import { WINDOW_ID_ENUM } from '../src/pure-constant';
import { IIpcRendererData } from '../src/pure-interface';

import { nutjsTs } from './types';

const nutjs: nutjsTs = require('@nut-tree-fork/nut-js');

// 该版本electron所对应的node版本
console.log('process.version', process.version);
// electron版本
console.log('process.versions.electron', process.versions.electron);
// abi版本
console.log('process.versions.modules', process.versions.modules);

if (platform === 'darwin') {
  console.log('运行在 macOS 上');
} else if (platform === 'linux') {
  console.log('运行在 Linux 上');
} else if (platform === 'win32') {
  console.log('运行在 Windows 上');
} else {
  console.log(`运行在: ${platform}上`);
}

// https://www.electronjs.org/zh/docs/latest/tutorial/security#%E9%9A%94%E7%A6%BB%E4%B8%8D%E5%8F%97%E4%BF%A1%E4%BB%BB%E7%9A%84%E5%86%85%E5%AE%B9
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

const windowNormalParams = { width: 800, height: 500 };
let winBounds: Electron.Rectangle | null;
const mainWindowId = WINDOW_ID_ENUM.remote;
const windowMap = new Map<number, BrowserWindow>();
const appName = app.getName();

async function createWindow({
  windowId,
  width,
  height,
  minWidth,
  minHeight,
  route,
  query,
  x,
  y,
  useWorkAreaSize,
  frame,
}) {
  let w = width || windowNormalParams.width;
  let h = height || windowNormalParams.height;
  const workAreaSize = screen.getPrimaryDisplay().workAreaSize;

  if (useWorkAreaSize) {
    w = workAreaSize.width;
    h = workAreaSize.height;
  }
  let xx = x;
  let yy = y;
  if (x === undefined && y === undefined) {
    // 计算居中位置
    xx = Math.round((workAreaSize.width - w) / 2);
    yy = Math.round((workAreaSize.height - h) / 2);
  }
  const win = new BrowserWindow({
    width: w,
    height: h,
    minWidth: minWidth || w,
    minHeight: minHeight || h,
    autoHideMenuBar: true,
    x: xx,
    y: yy,
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      devTools: true,
      // nodeIntegration: true, // 在网页中集成Node
      preload: path.join(__dirname, 'preload.js'),
    },
    frame,
  });

  windowMap.set(windowId, win);
  let url = '';
  const params = `${(route ? route : '') as string}${handleUrlQuery({
    windowId: `${windowId as number}`,
    ...query,
  })}`;
  if (process.env.VITE_DEV_SERVER_URL) {
    url = `${process.env.VITE_DEV_SERVER_URL as string}#/${params}`;
    await win.loadURL(url);
  } else {
    url = `${path.join(process.env.DIST as string, 'index.html')}#/${params}`;
    await win.loadFile(
      `${path.join(process.env.DIST as string, 'index.html')}`,
      {
        hash: route
          ? `${route as string}${handleUrlQuery({
              windowId: `${windowId as number}`,
              ...query,
            })}`
          : undefined,
      }
    );
  }
  win.on('close', () => {
    console.log('close', windowId);
    winWebContentsSend({
      windowId,
      channel: IPC_EVENT.response_closeWindow,
      requestId: '',
      data: { windowId },
      code: 0,
    });
  });
  win.on('closed', () => {
    console.log('closed', windowId);
    win.removeAllListeners();
    windowMap.delete(windowId);
    winWebContentsSend({
      windowId,
      channel: IPC_EVENT.response_closeWindowed,
      requestId: '',
      data: { windowId },
      code: 0,
    });
  });
}

function winWebContentsSend(data: IIpcRendererData) {
  const win = windowMap.get(data.windowId);
  if (win && !win?.isDestroyed()) {
    win.webContents.send(data.channel, data);
  }
}

function handleUrlQuery(obj: Record<string, string>) {
  let res = '';
  Object.keys(obj).forEach((item) => {
    res += `${item}=${obj[item]}&`;
  });
  if (res.length > 0) {
    return `?${res.slice(0, -1)}`;
  } else {
    return res;
  }
}

function main() {
  const mainWindow = new BrowserWindow({
    width: windowNormalParams.width,
    height: windowNormalParams.height,
    minWidth: windowNormalParams.width,
    minHeight: windowNormalParams.height,
    maxWidth: windowNormalParams.width,
    maxHeight: windowNormalParams.height,
    // 隐藏菜单栏
    autoHideMenuBar: true,
    webPreferences: {
      // devTools: true,
      // nodeIntegration: true, // 在网页中集成Node
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: false,
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL as string);
  } else {
    mainWindow.loadFile(path.join(process.env.DIST as string, 'index.html'));
  }

  windowMap.set(mainWindowId, mainWindow);

  mainWindow.on('close', () => {
    console.log('mainWindow-close');
    windowMap.forEach((item) => {
      if (!item?.isDestroyed()) {
        item.removeAllListeners();
        item.close();
      }
    });
    windowMap.clear();
  });
  mainWindow.on('closed', () => {
    console.log('mainWindow-closed');
    windowMap.forEach((item) => {
      if (!item?.isDestroyed()) {
        item.removeAllListeners();
        item.close();
      }
    });
    windowMap.clear();
  });

  // 创建菜单
  const menu = Menu.buildFromTemplate([
    {
      label: '文件',
      submenu: [
        {
          label: `关于${appName}`,
          click: () => {
            winWebContentsSend({
              windowId: mainWindowId,
              channel: IPC_EVENT.response_open_about,
              requestId: '',
              data: {},
              code: 0,
            });
          },
        },
        { type: 'separator' }, // 分隔线
        {
          label: '检查更新',
          click: () => {
            winWebContentsSend({
              windowId: mainWindowId,
              channel: IPC_EVENT.response_open_version,
              requestId: '',
              data: {},
              code: 0,
            });
          },
        },

        { type: 'separator' }, // 分隔线
        {
          label: '重新启动',
          role: 'forceReload',
        },
        { role: 'quit', label: `退出${appName}` },
      ],
    },
    {
      label: '编辑',
      role: 'editMenu',
      submenu: [
        {
          label: '撤销',
          role: 'undo',
        },
        {
          label: '恢复',
          role: 'redo',
        },
        { type: 'separator' }, // 分隔线
        {
          label: '剪切',
          role: 'cut',
        },
        {
          label: '复制',
          role: 'copy',
        },
        {
          label: '粘贴',
          role: 'paste',
        },
        {
          label: '全选',
          role: 'selectAll',
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);

  winBounds = mainWindow.getBounds();

  ipcMain.handle(IPC_EVENT.getPlatform, (_event, reqData: IIpcRendererData) => {
    console.log(`electron收到${IPC_EVENT.getPlatform}`, reqData);
    const { requestId } = reqData;
    const res = {
      requestId,
      data: { platform },
      code: 0,
    };

    return res;
  });

  ipcMain.handle(
    IPC_EVENT.shellOpenExternal,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.shellOpenExternal}`, reqData);
      const { requestId, data } = reqData;
      const { url } = data;
      const res = {
        requestId,
        data: {},
        code: 0,
      };
      try {
        await shell.openExternal(url);
      } catch (error) {
        console.log(error);
        res.code = 1;
      }
      return res;
    }
  );

  ipcMain.on(
    IPC_EVENT.commonTest,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.commonTest}`, reqData);
      const { requestId, data } = reqData;
      const { windowId, x, y } = data;
      try {
        await nutjs.mouse.move([{ x, y }]);
        winWebContentsSend({
          windowId,
          channel: IPC_EVENT.commonTest,
          requestId,
          data: {},
          code: 0,
        });
      } catch (error) {
        winWebContentsSend({
          windowId,
          channel: IPC_EVENT.commonTest,
          requestId,
          data,
          code: 1,
          msg: JSON.stringify(error),
        });
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.powerSaveBlockerStart,
    (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.powerSaveBlockerStart}`, reqData);
      const { requestId, data } = reqData;
      const { windowId } = data;
      try {
        powerSaveBlocker.start('prevent-display-sleep');
        winWebContentsSend({
          windowId,
          channel: IPC_EVENT.response_powerSaveBlockerStart,
          requestId,
          data: {},
          code: 0,
        });
      } catch (error) {
        console.log('powerSaveBlockerStart失败');
        console.log(error);
        winWebContentsSend({
          windowId,
          channel: IPC_EVENT.response_powerSaveBlockerStart,
          requestId,
          data,
          code: 1,
          msg: JSON.stringify(error),
        });
      }
    }
  );

  ipcMain.on(IPC_EVENT.closeAllWindow, (_event, reqData: IIpcRendererData) => {
    console.log(`electron收到${IPC_EVENT.closeAllWindow}`, reqData);
    windowMap.forEach((item) => {
      if (!item?.isDestroyed()) {
        item.removeAllListeners();
        item.close();
      }
    });
    windowMap.clear();
  });

  ipcMain.on(IPC_EVENT.closeWindow, (_event, reqData: IIpcRendererData) => {
    console.log(`electron收到${IPC_EVENT.closeWindow}`, reqData);
    const { data } = reqData;
    const { windowId } = data;
    const win = windowMap.get(windowId);
    win?.close();
  });

  ipcMain.on(IPC_EVENT.windowMinimize, (_event, reqData: IIpcRendererData) => {
    console.log(`electron收到${IPC_EVENT.windowMinimize}`, reqData);
    const { data } = reqData;
    const { windowId } = data;
    const win = windowMap.get(windowId);
    win?.minimize();
  });

  ipcMain.on(IPC_EVENT.windowMaximize, (_event, reqData: IIpcRendererData) => {
    console.log(`electron收到${IPC_EVENT.windowMaximize}`, reqData);
    const { data } = reqData;
    const { windowId } = data;
    const win = windowMap.get(windowId);
    win?.maximize();
  });

  ipcMain.on(
    IPC_EVENT.handleOpenDevTools,
    (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.handleOpenDevTools}`, reqData);
      const { requestId, data } = reqData;
      const { windowId } = data;
      const win = windowMap.get(Number(windowId || 1));
      win?.webContents.openDevTools({
        mode: 'detach',
        activate: true,
      });
      winWebContentsSend({
        windowId,
        channel: IPC_EVENT.response_handleOpenDevTools,
        requestId,
        data,
        code: 0,
      });
    }
  );

  ipcMain.on(
    IPC_EVENT.handleMoveScreenRightBottom,
    (_event, reqData: IIpcRendererData) => {
      console.log(
        `electron收到${IPC_EVENT.handleMoveScreenRightBottom}`,
        reqData
      );
      const { requestId, data } = reqData;
      const { windowId } = data;
      const win = windowMap.get(windowId);
      if (win) {
        const { width, height, y } = screen.getPrimaryDisplay().workArea;
        // 窗口的高度和宽度
        const bounds = win.getBounds();
        const windowWidth = bounds.width;
        const windowHeight = bounds.height;
        // const [windowWidth, windowHeight] = win?.getContentSize() ;
        // 计算新位置
        const newX = width - windowWidth; // 屏幕左下角的 X 坐标是 0
        const newY = height - windowHeight; // 需要减去窗口本身的高度
        // 移动窗口
        win.setPosition(newX, newY + y);
        winWebContentsSend({
          windowId,
          channel: IPC_EVENT.response_handleMoveScreenRightBottom,
          requestId,
          data: {},
          code: 0,
        });
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.mouseScrollDown,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.mouseScrollDown}`, reqData);
      const { requestId, data } = reqData;
      const { windowId, amount } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          await nutjs.mouse.scrollDown(amount);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseScrollDown,
            requestId,
            data: { amount },
            code: 0,
          });
        } catch (error) {
          console.log(error);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseScrollDown,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.mouseScrollUp,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.mouseScrollUp}`, reqData);
      const { requestId, data } = reqData;
      const { windowId, amount } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          await nutjs.mouse.scrollUp(amount);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseScrollUp,
            requestId,
            data: { amount },
            code: 0,
          });
        } catch (error) {
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseScrollUp,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.mouseScrollLeft,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.mouseScrollLeft}`, reqData);
      const { requestId, data } = reqData;
      const { windowId, amount } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          await nutjs.mouse.scrollLeft(amount);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseScrollLeft,
            requestId,
            data: { amount },
            code: 0,
          });
        } catch (error) {
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseScrollLeft,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.mouseScrollRight,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.mouseScrollRight}`, reqData);
      const { requestId, data } = reqData;
      const { windowId, amount } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          await nutjs.mouse.scrollRight(amount);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseScrollRight,
            requestId,
            data: { amount },
            code: 0,
          });
        } catch (error) {
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseScrollRight,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.mouseSetPosition,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.mouseSetPosition}`, reqData);
      const { requestId, data } = reqData;
      const { windowId, x, y } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          await nutjs.mouse.setPosition({ x, y });
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseSetPosition,
            requestId,
            data: { x, y },
            code: 0,
          });
        } catch (error) {
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseSetPosition,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  ipcMain.on(IPC_EVENT.mouseMove, async (_event, reqData: IIpcRendererData) => {
    console.log(`electron收到${IPC_EVENT.mouseMove}`, reqData);
    const { requestId, data } = reqData;
    const { windowId, x, y } = data;
    const win = windowMap.get(windowId);
    if (win) {
      try {
        await nutjs.mouse.move([{ x, y }]);
        winWebContentsSend({
          windowId,
          channel: IPC_EVENT.response_mouseMove,
          requestId,
          data: { x, y },
          code: 0,
        });
      } catch (error) {
        winWebContentsSend({
          windowId,
          channel: IPC_EVENT.response_mouseMove,
          requestId,
          data,
          code: 1,
          msg: JSON.stringify(error),
        });
      }
    }
  });

  ipcMain.on(IPC_EVENT.mouseDrag, async (_event, reqData: IIpcRendererData) => {
    console.log(`electron收到${IPC_EVENT.mouseDrag}`, reqData);
    const { requestId, data } = reqData;
    const { windowId, x, y } = data;
    const win = windowMap.get(windowId);
    if (win) {
      try {
        await nutjs.mouse.drag([{ x, y }]);
        winWebContentsSend({
          windowId,
          channel: IPC_EVENT.response_mouseDrag,
          requestId,
          data: { x, y },
          code: 0,
        });
      } catch (error) {
        winWebContentsSend({
          windowId,
          channel: IPC_EVENT.response_mouseDrag,
          requestId,
          data,
          code: 1,
          msg: JSON.stringify(error),
        });
      }
    }
  });

  // 输入字符串或按键
  ipcMain.on(
    IPC_EVENT.keyboardType,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.keyboardType}`, reqData);
      const { requestId, data } = reqData;
      const { windowId, key } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          await nutjs.keyboard.type(key);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_keyboardType,
            requestId,
            data: { key },
            code: 0,
          });
        } catch (error) {
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_keyboardType,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  // 输入按键
  ipcMain.on(
    IPC_EVENT.keyboardPressKey,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.keyboardPressKey}`, reqData);
      const { requestId, data } = reqData;
      const { windowId, key } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          await nutjs.keyboard.pressKey(...key);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_keyboardPressKey,
            requestId,
            data: { key },
            code: 0,
          });
        } catch (error) {
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_keyboardPressKey,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  // 释放按键
  ipcMain.on(
    IPC_EVENT.keyboardReleaseKey,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.keyboardReleaseKey}`, reqData);
      const { requestId, data } = reqData;
      const { windowId, key } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          await nutjs.keyboard.releaseKey(...key);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_keyboardReleaseKey,
            requestId,
            data: { key },
            code: 0,
          });
        } catch (error) {
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_keyboardReleaseKey,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.mousePressButtonLeft,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.mousePressButtonLeft}`, reqData);
      const { requestId, data } = reqData;
      const { windowId } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          await nutjs.mouse.pressButton(nutjs.Button.LEFT);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mousePressButtonLeft,
            requestId,
            data: {},
            code: 0,
          });
        } catch (error) {
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mousePressButtonLeft,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.mouseReleaseButtonLeft,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.mouseReleaseButtonLeft}`, reqData);
      const { requestId, data } = reqData;
      const { windowId } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          await nutjs.mouse.releaseButton(nutjs.Button.LEFT);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseReleaseButtonLeft,
            requestId,
            data: {},
            code: 0,
          });
        } catch (error) {
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseReleaseButtonLeft,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.mouseDoubleClick,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.mouseDoubleClick}`, reqData);
      const { requestId, data } = reqData;
      const { windowId } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          await nutjs.mouse.doubleClick(nutjs.Button.LEFT);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseDoubleClick,
            requestId,
            data: {},
            code: 0,
          });
        } catch (error) {
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseDoubleClick,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.mouseLeftClick,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.mouseLeftClick}`, reqData);
      const { requestId, data } = reqData;
      const { windowId } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          await nutjs.mouse.click(nutjs.Button.LEFT);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseLeftClick,
            requestId,
            data: {},
            code: 0,
          });
        } catch (error) {
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseLeftClick,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.mouseRightClick,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.mouseRightClick}`, reqData);
      const { requestId, data } = reqData;
      const { windowId } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          await nutjs.mouse.click(nutjs.Button.RIGHT);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseRightClick,
            requestId,
            data: {},
            code: 0,
          });
        } catch (error) {
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_mouseRightClick,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.getMousePosition,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.getMousePosition}`, reqData);
      const { requestId, data } = reqData;
      const { windowId } = data;
      const win = windowMap.get(windowId);
      if (win) {
        try {
          const point = await nutjs.mouse.getPosition();
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_getMousePosition,
            requestId,
            data: { point },
            code: 0,
          });
        } catch (error) {
          console.log(error);
          winWebContentsSend({
            windowId,
            channel: IPC_EVENT.response_getMousePosition,
            requestId,
            data,
            code: 1,
            msg: JSON.stringify(error),
          });
        }
      }
    }
  );

  ipcMain.on(IPC_EVENT.setWindowBounds, (_event, reqData: IIpcRendererData) => {
    console.log(`electron收到${IPC_EVENT.setWindowBounds}`, reqData);
    const { requestId, data } = reqData;
    const { windowId, width, height } = data;
    const win = windowMap.get(windowId);
    if (win) {
      if (!win?.isDestroyed()) {
        win.setBounds({ width, height });
      }
      winWebContentsSend({
        windowId,
        channel: IPC_EVENT.response_setWindowBounds,
        requestId,
        data,
        code: 0,
      });
    }
  });

  ipcMain.handle(
    IPC_EVENT.getWindowTitlebarHeight,
    (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.getWindowTitlebarHeight}`, reqData);
      const { requestId, data } = reqData;
      const { windowId } = data;
      const win = windowMap.get(Number(windowId));
      const res = {
        windowId,
        requestId,
        data: { height: 0 },
        code: 0,
      };
      if (win) {
        const contentBounds = win.getContentBounds();
        const windowBounds = win.getBounds();
        const borderWidth = (windowBounds.width - contentBounds.width) / 2;
        res.data.height =
          windowBounds.height - contentBounds.height - borderWidth;
      } else {
        res.code = 1;
      }
      return res;
    }
  );

  ipcMain.handle(
    IPC_EVENT.setWindowPosition,
    (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.setWindowPosition}`, reqData);
      const { requestId, data } = reqData;
      const { x, y, windowId } = data;
      const win = windowMap.get(windowId);
      const res = {
        windowId,
        requestId,
        data: {},
        code: 0,
      };
      if (win) {
        if (winBounds) {
          // electron无边框窗口在Windows下拖拽导致窗口放大（Windows系统缩放不为100%时）
          // https://github.com/electron/electron/issues/20320
          // https://github.com/electron/electron/issues/10862
          if (!win?.isDestroyed()) {
            win.setBounds(winBounds);
          }
        }
        win?.setPosition(x, y);
      } else {
        res.code = 1;
      }
      return res;
    }
  );

  ipcMain.on(
    IPC_EVENT.setWindowPosition,
    (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.setWindowPosition}`, reqData);
      const { requestId, data } = reqData;
      const { x, y, windowId } = data;
      const win = windowMap.get(Number(windowId));
      if (win) {
        if (winBounds) {
          // electron无边框窗口在Windows下拖拽导致窗口放大（Windows系统缩放不为100%时）
          // https://github.com/electron/electron/issues/20320
          // https://github.com/electron/electron/issues/10862
          if (!win?.isDestroyed()) {
            win.setBounds(winBounds);
          }
        }
        win?.setPosition(x, y);
        winWebContentsSend({
          windowId,
          channel: IPC_EVENT.response_setWindowPosition,
          requestId,
          data: {},
          code: 0,
        });
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.getWindowPosition,
    (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.getWindowPosition}`, reqData);
      const { requestId, data } = reqData;
      const { windowId } = data;
      const win = windowMap.get(Number(windowId));
      if (win) {
        const point = win.getPosition();
        winWebContentsSend({
          windowId,
          channel: IPC_EVENT.response_getWindowPosition,
          requestId,
          data: { position: { x: point[0], y: point[1] } },
          code: 0,
        });
      }
    }
  );

  ipcMain.on(
    IPC_EVENT.getScreenStream,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.getScreenStream}`, reqData);
      const { requestId, data } = reqData;
      const { windowId } = data;
      const win = windowMap.get(Number(windowId));
      if (win) {
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
        winWebContentsSend({
          windowId,
          channel: IPC_EVENT.response_getScreenStream,
          requestId,
          data: { stream: res[0] },
          code: 0,
        });
      }
    }
  );

  ipcMain.on(IPC_EVENT.setAlwaysOnTop, (_event, reqData: IIpcRendererData) => {
    console.log(`electron收到${IPC_EVENT.setAlwaysOnTop}`, reqData);
    const { requestId, data } = reqData;
    const { flag } = data;
    const { windowId } = data;
    const win = windowMap.get(Number(windowId));
    if (win) {
      win.setAlwaysOnTop(flag);
      winWebContentsSend({
        windowId,
        channel: IPC_EVENT.response_setAlwaysOnTop,
        requestId,
        data,
        code: 0,
      });
    }
  });

  ipcMain.handle(IPC_EVENT.scaleFactor, (_event, reqData: IIpcRendererData) => {
    console.log(`electron收到${IPC_EVENT.scaleFactor}`, reqData);
    const { requestId, data } = reqData;
    const { windowId } = data;
    const win = windowMap.get(Number(windowId));
    const res = {
      windowId,
      requestId,
      data: { scaleFactor: 0, platform: '' },
      code: 0,
    };
    if (win) {
      const scaleFactor = screen.getPrimaryDisplay().scaleFactor;
      res.data.scaleFactor = scaleFactor;
      res.data.platform = platform;
    } else {
      res.code = 1;
    }
    return res;
  });

  ipcMain.on(IPC_EVENT.workAreaSize, (_event, reqData: IIpcRendererData) => {
    console.log(`electron收到${IPC_EVENT.workAreaSize}`, reqData);
    const { requestId, data } = reqData;
    const { windowId } = data;
    const win = windowMap.get(Number(windowId));
    if (win) {
      const { width, height } = screen.getPrimaryDisplay().workAreaSize;
      winWebContentsSend({
        windowId,
        channel: IPC_EVENT.response_workAreaSize,
        requestId,
        data: { width, height },
        code: 0,
      });
    }
  });

  ipcMain.handle(
    IPC_EVENT.getPrimaryDisplaySize,
    (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.getPrimaryDisplaySize}`, reqData);
      const { requestId, data } = reqData;
      const { windowId } = data;
      const win = windowMap.get(Number(windowId));
      const res = {
        windowId,
        requestId,
        data: { width: 0, height: 0 },
        code: 0,
      };
      if (win) {
        const { width, height } = screen.getPrimaryDisplay().size;
        res.data.width = width;
        res.data.height = height;
      } else {
        res.code = 1;
      }
      return res;
    }
  );

  ipcMain.on(
    IPC_EVENT.createWindow,
    async (_event, reqData: IIpcRendererData) => {
      console.log(`electron收到${IPC_EVENT.createWindow}`, reqData);
      const { data } = reqData;
      const {
        windowId,
        width,
        height,
        minWidth,
        minHeight,
        route,
        query,
        x,
        y,
        useWorkAreaSize,
        frame,
      } = data;
      try {
        await createWindow({
          windowId,
          width,
          height,
          minWidth,
          minHeight,
          route,
          query,
          x,
          y,
          useWorkAreaSize,
          frame,
        });
        console.log('createWindow成功');
      } catch (error) {
        console.log('createWindow失败');
        console.log(error);
      }
    }
  );
}

app.on('ready', () => {
  powerMonitor.on('suspend', () => {
    windowMap.forEach((item) => {
      const windowId = item.id;
      winWebContentsSend({
        windowId,
        channel: IPC_EVENT.response_powerMonitorSuspend,
        requestId: '',
        data: { windowId: item.id },
        code: 0,
      });
    });
  });
  powerMonitor.on('resume', () => {
    windowMap.forEach((item) => {
      const windowId = item.id;
      winWebContentsSend({
        windowId,
        channel: IPC_EVENT.response_powerMonitorResume,
        requestId: '',
        data: { windowId: item.id },
        code: 0,
      });
    });
  });
  main();
});

app.on('window-all-closed', () => {
  app.quit();
  windowMap.clear();
});

// app.whenReady().then(main);
