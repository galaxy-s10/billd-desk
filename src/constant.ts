export * from '@/pure-constant';
import { Key } from '@nut-tree-fork/shared';

import { BilldHtmlWebpackPluginLog } from '@/interface';
import { prodDomain } from '@/spec-config';

export const PROJECT_GITHUB = `https://github.com/galaxy-s10/billd-desk-electron`;
export const WEB_DESK_URL = `https://desk.hsslive.cn`;

export const AUTHOR_INFO = {
  github: 'https://github.com/galaxy-s10',
  wechat: 'shuisheng9905',
  qq: '2274751790',
};

export const COMMON_URL = {
  privatizationDeployment: 'https://live.hsslive.cn/privatizationDeployment',
};

// @ts-ignore
export const APP_BUILD_INFO = process.env
  .BilldHtmlWebpackPlugin as BilldHtmlWebpackPluginLog;

export const NODE_ENV = process.env.NODE_ENV;

export const COTURN_URL = `turn:hk.${prodDomain}`;

// ======本地调试=====

// const LOCALHOST_IP = '192.168.1.101:4300';

// export const WEBSOCKET_URL =
//   process.env.NODE_ENV === 'development'
//     ? `ws://localhost:4300`
//     : `ws://${LOCALHOST_IP}`;

// export const AXIOS_BASEURL =
//   process.env.NODE_ENV === 'development' ? `/api` : `http://${LOCALHOST_IP}`;

// ======本地调试=====

// ======线上正式=====

export const WEBSOCKET_URL =
  process.env.NODE_ENV === 'development'
    ? `ws://localhost:4300`
    : `wss://srs-pull.${prodDomain}`;

export const AXIOS_BASEURL =
  process.env.NODE_ENV === 'development'
    ? `/api`
    : `https://live-api.${prodDomain}`;

// ======线上正式=====

export const COOKIE_DOMAIN =
  process.env.NODE_ENV === 'development' ? undefined : `.${prodDomain}`;

export const THEME_COLOR = '#ffd700';

export const PRODUCT_NAME = 'BilldDesk';

export const NUT_KEY_MAP = {
  A: Key.A,
  B: Key.B,
  C: Key.C,
  D: Key.D,
  E: Key.E,
  F: Key.F,
  G: Key.G,
  H: Key.H,
  I: Key.I,
  J: Key.J,
  K: Key.K,
  L: Key.L,
  M: Key.M,
  N: Key.N,
  O: Key.O,
  P: Key.P,
  Q: Key.Q,
  R: Key.R,
  S: Key.S,
  T: Key.T,
  U: Key.U,
  V: Key.V,
  W: Key.W,
  X: Key.X,
  Y: Key.Y,
  Z: Key.Z,
  0: Key.Num0,
  1: Key.Num1,
  2: Key.Num2,
  3: Key.Num3,
  4: Key.Num4,
  5: Key.Num5,
  6: Key.Num6,
  7: Key.Num7,
  8: Key.Num8,
  9: Key.Num9,
  Fn: Key.Fn,
  F1: Key.F1,
  F2: Key.F2,
  F3: Key.F3,
  F4: Key.F4,
  F5: Key.F5,
  F6: Key.F6,
  F7: Key.F7,
  F8: Key.F8,
  F9: Key.F9,
  F10: Key.F10,
  F11: Key.F11,
  F12: Key.F12,
  F13: Key.F13,
  F14: Key.F14,
  F15: Key.F15,
  F16: Key.F16,
  F17: Key.F17,
  F18: Key.F18,
  F19: Key.F19,
  F20: Key.F20,
  F21: Key.F21,
  F22: Key.F22,
  F23: Key.F23,
  F24: Key.F24,
  Delete: Key.Delete,
  Enter: Key.Enter,
  Space: Key.Space,
  Backspace: Key.Backspace,
  ShiftLeft: Key.LeftShift,
  ShiftRight: Key.RightShift,
  AltLeft: Key.LeftAlt,
  AltRight: Key.RightAlt,
  Tab: Key.Tab,
  Backquote: Key.Quote,
  Backslash: Key.Backslash,
  ArrowUp: Key.Up,
  ArrowDown: Key.Down,
  ArrowLeft: Key.Left,
  ArrowRight: Key.Right,
  CapsLock: Key.CapsLock,
  ControlLeft: Key.LeftControl,
  ControlRight: Key.RightControl,
  MetaLeft: Key.LeftCmd,
  LeftCmd: Key.LeftCmd,
  MetaRight: Key.RightCmd,
  RightCmd: Key.RightCmd,
  LeftWin: Key.LeftWin,
  RightWin: Key.RightWin,
};

export const SRS_CB_URL_PARAMS = {
  publishKey: 'pushkey',
  publishType: 'pushtype',
  userToken: 'usertoken',
  userId: 'userid',
  randomId: 'randomid',
};

// 全局的cookie的key
export const COOKIE_KEY = {
  thirdLoginInfo: 'thirdLoginInfo',
};

export const LS_KEY_PREFIX = 'billd_desk___';

// 全局的localStorage的key
export const LS_KEY = {
  lastBuildDate: 'lastBuildDate',
  uuid: 'uuid',
  password: 'password',
  token: 'token',
  axiosBaseUrl: 'axiosBaseUrl',
  wssUrl: 'wssUrl',
  coturnUrl: 'coturnUrl',
};
