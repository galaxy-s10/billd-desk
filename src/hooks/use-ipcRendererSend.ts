import { getRandomString, openToTarget } from 'billd-utils';

import { IPC_EVENT } from '@/event';
import { useAppStore } from '@/store/app';
import {
  BilldDeskBehaviorEnum,
  WsBilldDeskBehaviorType,
} from '@/types/websocket';
import { ipcRenderer, ipcRendererInvoke, ipcRendererSend } from '@/utils';

export const useIpcRendererSend = () => {
  const appStore = useAppStore();

  function mouseScrollDown({ windowId, amount }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.mouseScrollDown,
      requestId: getRandomString(8),
      data: { amount },
    });
  }

  function mouseScrollUp({ windowId, amount }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.mouseScrollUp,
      requestId: getRandomString(8),
      data: { amount },
    });
  }

  function mouseScrollLeft({ windowId, amount }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.mouseScrollLeft,
      requestId: getRandomString(8),
      data: { amount },
    });
  }

  function mouseScrollRight({ windowId, amount }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.mouseScrollRight,
      requestId: getRandomString(8),
      data: { amount },
    });
  }

  function mouseSetPosition({ windowId, x, y }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.mouseSetPosition,
      requestId: getRandomString(8),
      data: { x, y },
    });
  }

  function mouseMove({ windowId, x, y }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.mouseMove,
      requestId: getRandomString(8),
      data: { x, y },
    });
  }

  function mouseDrag({ windowId, x, y }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.mouseDrag,
      requestId: getRandomString(8),
      data: { x, y },
    });
  }

  function mouseDoubleClick({ windowId }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.mouseDoubleClick,
      requestId: getRandomString(8),
      data: {},
    });
  }

  function mousePressButtonLeft({ windowId }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.mousePressButtonLeft,
      requestId: getRandomString(8),
      data: {},
    });
  }

  /** 将窗口移动到屏幕右下角 */
  function handleMoveScreenRightBottom({ windowId }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.handleMoveScreenRightBottom,
      requestId: getRandomString(8),
      data: {},
    });
  }

  /** 将窗口置顶 */
  function handlesetAlwaysOnTop({ windowId, flag }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.setAlwaysOnTop,
      requestId: getRandomString(8),
      data: { flag },
    });
  }

  function handleScreen({ windowId }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.getScreenStream,
      requestId: getRandomString(8),
      data: {},
    });
  }

  function handleOpenExternal({ windowId, url }) {
    if (!ipcRenderer) {
      openToTarget(url);
    } else {
      ipcRendererInvoke({
        windowId,
        channel: IPC_EVENT.shellOpenExternal,
        requestId: getRandomString(8),
        data: { url },
      });
    }
  }

  function keyboardType({ windowId, key }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.keyboardType,
      requestId: getRandomString(8),
      data: { key },
    });
  }

  function keyboardPressKey({ windowId, key }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.keyboardPressKey,
      requestId: getRandomString(8),
      data: { key },
    });
  }

  function keyboardReleaseKey({ windowId, key }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.keyboardReleaseKey,
      requestId: getRandomString(8),
      data: { key },
    });
  }

  function mouseReleaseButtonLeft({ windowId }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.mouseReleaseButtonLeft,
      requestId: getRandomString(8),
      data: {},
    });
  }

  function mouseLeftClick({ windowId, x, y }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.mouseLeftClick,
      requestId: getRandomString(8),
      data: { x, y },
    });
  }

  function mouseRightClick({ windowId, x, y }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.mouseRightClick,
      requestId: getRandomString(8),
      data: { x, y },
    });
  }

  function handleOpenDevTools({ windowId }) {
    ipcRendererSend({
      windowId,
      channel: IPC_EVENT.handleOpenDevTools,
      requestId: getRandomString(8),
      data: {},
    });
  }

  function handleRtcBilldDeskBehavior(
    windowId,
    data: WsBilldDeskBehaviorType['data']
  ) {
    const x =
      (appStore.primaryDisplaySize.width || 0) *
      appStore.scaleFactor *
      (data.x / 1000);
    const y =
      (appStore.primaryDisplaySize.height || 0) *
      appStore.scaleFactor *
      (data.y / 1000);
    if (data.type === BilldDeskBehaviorEnum.setPosition) {
      mouseSetPosition({ windowId, x, y });
    } else if (data.type === BilldDeskBehaviorEnum.mouseMove) {
      mouseMove({ windowId, x, y });
    } else if (data.type === BilldDeskBehaviorEnum.mouseDrag) {
      mouseDrag({ windowId, x, y });
    } else if (data.type === BilldDeskBehaviorEnum.leftClick) {
      mouseLeftClick({ windowId, x, y });
    } else if (data.type === BilldDeskBehaviorEnum.rightClick) {
      mouseRightClick({ windowId, x, y });
    } else if (data.type === BilldDeskBehaviorEnum.doubleClick) {
      mouseDoubleClick({ windowId });
    } else if (data.type === BilldDeskBehaviorEnum.pressButtonLeft) {
      mousePressButtonLeft({ windowId });
    } else if (data.type === BilldDeskBehaviorEnum.releaseButtonLeft) {
      mouseReleaseButtonLeft({ windowId });
    } else if (data.type === BilldDeskBehaviorEnum.keyboardType) {
      keyboardType({ windowId, key: data.key });
    } else if (data.type === BilldDeskBehaviorEnum.keyboardPressKey) {
      keyboardPressKey({ windowId, key: data.key });
    } else if (data.type === BilldDeskBehaviorEnum.keyboardReleaseKey) {
      keyboardReleaseKey({ windowId, key: data.key });
    } else if (data.type === BilldDeskBehaviorEnum.scrollDown) {
      mouseScrollDown({ windowId, amount: data.amount });
    } else if (data.type === BilldDeskBehaviorEnum.scrollUp) {
      mouseScrollUp({ windowId, amount: data.amount });
    } else if (data.type === BilldDeskBehaviorEnum.scrollLeft) {
      mouseScrollLeft({ windowId, amount: data.amount });
    } else if (data.type === BilldDeskBehaviorEnum.scrollRight) {
      mouseScrollRight({ windowId, amount: data.amount });
    }
  }

  return {
    mouseDoubleClick,
    mouseDrag,
    mouseLeftClick,
    mouseMove,
    mousePressButtonLeft,
    mouseReleaseButtonLeft,
    mouseRightClick,
    mouseScrollDown,
    mouseScrollLeft,
    mouseScrollRight,
    mouseScrollUp,
    mouseSetPosition,
    keyboardPressKey,
    keyboardReleaseKey,
    keyboardType,
    handleOpenDevTools,
    handlesetAlwaysOnTop,
    handleMoveScreenRightBottom,
    handleScreen,
    handleOpenExternal,
    handleRtcBilldDeskBehavior,
  };
};
