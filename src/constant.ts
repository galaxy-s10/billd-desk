export * from '@/pure-constant';
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

  '`': Key.Grave, // 波浪号
  1: Key.Num1,
  2: Key.Num2,
  3: Key.Num3,
  4: Key.Num4,
  5: Key.Num5,
  6: Key.Num6,
  7: Key.Num7,
  8: Key.Num8,
  9: Key.Num9,
  0: Key.Num0,
  '-': Key.Minus, // 减号
  '+': Key.Equal, // 等号
  Backspace: Key.Backspace, // 删除

  Tab: Key.Tab,
  Q: Key.Q,
  W: Key.W,
  E: Key.E,
  R: Key.R,
  T: Key.T,
  Y: Key.Y,
  U: Key.U,
  I: Key.I,
  O: Key.O,
  P: Key.P,
  '[': Key.LeftBracket, // 左方括号
  ']': Key.RightBracket, // 右方括号
  '\\': Key.Backslash, // 反斜杠
  Delete: Key.Delete, // del

  CapsLock: Key.CapsLock, // 大小写切换
  A: Key.A,
  S: Key.S,
  D: Key.D,
  F: Key.F,
  G: Key.G,
  H: Key.H,
  J: Key.J,
  K: Key.K,
  L: Key.L,
  ';': Key.Semicolon, // 分号
  "'": Key.Quote, // 引号
  Enter: Key.Enter, // 回车enter

  Shift: Key.LeftShift, // 左边的shift
  Z: Key.Z,
  X: Key.X,
  C: Key.C,
  V: Key.V,
  B: Key.B,
  N: Key.N,
  M: Key.M,
  ',': Key.Comma, // 逗号
  '.': Key.Period, // 句号
  '/': Key.Slash, // 斜杠
  // Shift: Key.RightShift, // 右边的shift

  fn: 'fn',
  Control: Key.LeftControl,
  Alt: Key.LeftAlt,
  Meta: Key.LeftCmd,
  ' ': Key.Space,
  // Meta: Key.RightCmd,
  // Alt: Key.RightAlt,
  // Control: Key.RightControl,

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

  // 没用到
  // RightCmd: Key.RightCmd,
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
  turnUrl: 'turnUrl',
};
