import { Key } from '@nut-tree-fork/shared';

import type { BilldHtmlWebpackPluginLog } from '@/interface';

export const PROJECT_GITHUB = `https://github.com/galaxy-s10/billd-desk`;
export const WEB_DESK_URL = `https://desk.hsslive.cn`;

export const AUTHOR_INFO = {
  github: 'https://github.com/galaxy-s10',
  wechat: 'shuisheng9905',
  qq: '2274751790',
};

export const COMMON_URL = {
  privatizationDeployment: 'https://desk.hsslive.cn/#/privatizationDeployment',
  price: 'https://desk.hsslive.cn/#/price',
  hi: 'https://desk.hsslive.cn/#/hi',
  download: 'https://desk.hsslive.cn/#/download',
  wechatGroup: 'https://desk.hsslive.cn/#/wechatGroup',
  payCoursesArticle: `https://www.hsslive.cn/article/151`,
};

// @ts-ignore
export const APP_BUILD_INFO = process.env
  .BilldHtmlWebpackPlugin as BilldHtmlWebpackPluginLog;

export const NODE_ENV = process.env.NODE_ENV;

export const THEME_COLOR = '#ffd700';

export const PRODUCT_NAME = 'BilldDesk';

export const NUT_KEY_MAP = {
  Escape: Key.Escape, // esc
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

  Backquote: Key.Grave, // 波浪号
  Digit1: Key.Num1,
  Digit2: Key.Num2,
  Digit3: Key.Num3,
  Digit4: Key.Num4,
  Digit5: Key.Num5,
  Digit6: Key.Num6,
  Digit7: Key.Num7,
  Digit8: Key.Num8,
  Digit9: Key.Num9,
  Digit0: Key.Num0,
  Minus: Key.Minus, // 减号
  Equal: Key.Equal, // 等号
  Backspace: Key.Backspace, // 删除

  Tab: Key.Tab,
  KeyQ: Key.Q,
  KeyW: Key.W,
  KeyE: Key.E,
  KeyR: Key.R,
  KeyT: Key.T,
  KeyY: Key.Y,
  KeyU: Key.U,
  KeyI: Key.I,
  KeyO: Key.O,
  KeyP: Key.P,
  BracketLeft: Key.LeftBracket, // 左方括号
  BracketRight: Key.RightBracket, // 右方括号
  Backslash: Key.Backslash, // 反斜杠
  Delete: Key.Delete, // del

  CapsLock: Key.CapsLock, // 大小写切换
  KeyA: Key.A,
  KeyS: Key.S,
  KeyD: Key.D,
  KeyF: Key.F,
  KeyG: Key.G,
  KeyH: Key.H,
  KeyJ: Key.J,
  KeyK: Key.K,
  KeyL: Key.L,
  Semicolon: Key.Semicolon, // 分号
  Quote: Key.Quote, // 引号
  Enter: Key.Enter, // 回车enter

  ShiftLeft: Key.LeftShift, // 左边的shift
  KeyZ: Key.Z,
  KeyX: Key.X,
  KeyC: Key.C,
  KeyV: Key.V,
  KeyB: Key.B,
  KeyN: Key.N,
  KeyM: Key.M,
  Comma: Key.Comma, // 逗号
  Period: Key.Period, // 句号
  Slash: Key.Slash, // 斜杠
  ShiftRight: Key.RightShift, // 右边边的shift

  fn: 'fn',
  ControlLeft: Key.LeftControl,
  Alt: Key.LeftAlt,
  MetaLeft: Key.LeftCmd,
  Space: Key.Space,
  MetaRight: Key.RightCmd,
  AltRight: Key.RightAlt,
  ControlRight: Key.RightControl,

  ArrowUp: Key.Up,
  ArrowDown: Key.Down,
  ArrowLeft: Key.Left,
  ArrowRight: Key.Right,

  // 右侧小键盘
  Home: Key.Home,
  End: Key.End,
  Insert: Key.Insert,
  Print: Key.Print,
  PageUp: Key.PageUp,
  PageDown: Key.PageDown,
  Pause: Key.Pause,
  ScrollLock: Key.ScrollLock,

  // 数字小键盘
  Numpad1: Key.Num1,
  Numpad2: Key.Num2,
  Numpad3: Key.Num3,
  Numpad4: Key.Num4,
  Numpad5: Key.Num5,
  Numpad6: Key.Num6,
  Numpad7: Key.Num7,
  Numpad8: Key.Num8,
  Numpad9: Key.Num9,
  Numpad0: Key.Num0,

  // 没用到
  // RightCmd: Key.RightCmd,
};

// 全局的cookie的key
export const COOKIE_KEY = {};

export const LS_KEY_PREFIX = 'billd_desk___';

// 全局的localStorage的key
export const LS_KEY = {
  lastBuildDate: 'lastBuildDate',
  uuid: 'uuid',
  password: 'password',
  token: 'token',
  api: 'api',
  wss: 'wss',
  turn: 'turn',
  preview: 'preview',
  todaylock: 'todaylock',
};
