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
  officialGroup: 'https://desk.hsslive.cn/#/officialGroup',
  payCoursesArticle: `https://www.hsslive.cn/article/151`,
  qqGroup: 957845615,
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

export const pricePageData = {
  currentTab: 'priceTwo',
  tab: [
    {
      id: 'priceOne',
      txt: '个人订阅',
    },
    {
      id: 'priceTwo',
      txt: '个人套餐',
    },
    {
      id: 'priceThree',
      txt: '企业订阅',
    },
    {
      id: 'priceFour',
      txt: '企业套餐',
    },
  ],
  detail: {
    priceOne: {
      slogan: ['一次性源码，适合个人用户', '欢迎订阅🚀'],
      list: [
        {
          color: '#38c0ff',
          name: '远程控制桌面端',
          desc: '基于Vue3 + WebRTC + Electron',
          price: {
            left: '￥',
            center: '599',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-pro',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
        {
          color: '#597ef7',
          name: '远程控制后台',
          desc: '基于Vue3 + NaiveUI + Vite6',
          price: {
            left: '￥',
            center: '599',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'todo',
              txt: 'billd-desk-admin-pro',
            },
          ],
          btn: {
            type: 'todo',
            link: '',
            txt: '敬请期待',
          },
        },
        {
          color: '#30d1aa',
          name: '远程控制后端',
          desc: '基于Nodejs + Koa2 + TypeScript',
          price: {
            left: '￥',
            center: '599',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
        {
          color: '#ffa940',
          name: '远程控制App端',
          desc: '基于Flutter3 + WebRTC',
          price: {
            left: '￥',
            center: '599',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-flutter-pro',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
      ],
    },
    priceTwo: {
      slogan: ['一次性源码，适合个人用户', '套餐订阅更优惠！🚀'],
      list: [
        {
          color: '#1677ff',
          name: '远程控制',
          desc: '网页/客户端远程控制',
          price: {
            left: '￥',
            center: '899',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
        {
          color: '#EE826C',
          name: 'App远程控制',
          desc: '手机App远程控制',
          price: {
            left: '￥',
            center: '899',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-flutter-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
        {
          color: '#bae637',
          name: '远程控制+后台',
          desc: '网页/客户端远程控制；<br />远程控制后台',
          price: {
            left: '￥',
            center: '1099',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-pro',
            },
            {
              status: 'todo',
              txt: 'billd-desk-admin-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'todo',
            link: '',
            txt: '敬请期待',
          },
        },
        {
          color: '#eb2f96',
          name: 'App远程控制+后台',
          desc: '手机App远程控制；<br />远程控制后台',
          price: {
            left: '￥',
            center: '1099',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-flutter-pro',
            },
            {
              status: 'todo',
              txt: 'billd-desk-admin-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'todo',
            link: '',
            txt: '敬请期待',
          },
        },
        {
          color: '#13c2c2',
          name: '全平台远程控制',
          desc: '网页/客户端远程控制；<br />手机App远程控制；<br />远程控制后台',
          price: {
            left: '￥',
            center: '1299',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-flutter-pro',
            },
            {
              status: 'todo',
              txt: 'billd-desk-admin-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'todo',
            link: '',
            txt: '敬请期待',
          },
        },
      ],
    },
    priceThree: {
      slogan: ['源码永久更新，适合企业用户', '欢迎订阅🚀'],
      list: [
        {
          color: '#38c0ff',
          name: '远程控制桌面端',
          desc: '基于Vue3 + WebRTC + Electron',
          price: {
            left: '￥',
            center: '999',
            right: '元/永久',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-pro',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
        {
          color: '#597ef7',
          name: '远程控制后台',
          desc: '基于Vue3 + NaiveUI + Vite6',
          price: {
            left: '￥',
            center: '999',
            right: '元/永久',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'todo',
              txt: 'billd-desk-admin-pro',
            },
          ],
          btn: {
            type: 'todo',
            link: '',
            txt: '敬请期待',
          },
        },
        {
          color: '#30d1aa',
          name: '远程控制后端',
          desc: '基于Nodejs + Koa2 + TypeScript',
          price: {
            left: '￥',
            center: '999',
            right: '元/永久',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
        {
          color: '#ffa940',
          name: '远程控制App端',
          desc: '基于Flutter3 + WebRTC',
          price: {
            left: '￥',
            center: '999',
            right: '元/永久',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-flutter-pro',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
      ],
    },
    priceFour: {
      slogan: ['源码永久更新，适合企业用户', '套餐订阅更优惠！🚀'],
      list: [
        {
          color: '#1677ff',
          name: '远程控制',
          desc: '网页/客户端远程控制',
          price: {
            left: '￥',
            center: '1399',
            right: '元/永久',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
        {
          color: '#EE826C',
          name: 'App远程控制',
          desc: '手机App远程控制',
          price: {
            left: '￥',
            center: '1399',
            right: '元/永久',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-flutter-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
        {
          color: '#bae637',
          name: '远程控制+后台',
          desc: '网页/客户端远程控制；<br />远程控制后台',
          price: {
            left: '￥',
            center: '1599',
            right: '元/永久',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-pro',
            },
            {
              status: 'todo',
              txt: 'billd-desk-admin-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'todo',
            link: '',
            txt: '敬请期待',
          },
        },
        {
          color: '#eb2f96',
          name: 'App远程控制+后台',
          desc: '手机App远程控制；<br />远程控制后台',
          price: {
            left: '￥',
            center: '1599',
            right: '元/永久',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-flutter-pro',
            },
            {
              status: 'todo',
              txt: 'billd-desk-admin-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'todo',
            link: '',
            txt: '敬请期待',
          },
        },
        {
          color: '#13c2c2',
          name: '全平台远程控制',
          desc: '网页/客户端远程控制；<br />手机App远程控制；<br />远程控制后台',
          price: {
            left: '￥',
            center: '1799',
            right: '元/永久',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-flutter-pro',
            },
            {
              status: 'todo',
              txt: 'billd-desk-admin-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'todo',
            link: '',
            txt: '敬请期待',
          },
        },
      ],
    },
  },
};

export const privatizationDeploymentData = {
  currentTab: 'single',
  tab: [
    {
      id: 'single',
      txt: '开源版',
    },
    {
      id: 'multi',
      txt: '高级版',
    },
    {
      id: 'forever',
      txt: '定制版',
    },
  ],
  detail: {
    single: {
      slogan: ['BilldDesk开源版允许商用！', '欢迎部署🚀'],
      list: [
        {
          color: '#1677ff',
          name: '远程控制',
          desc: '网页/客户端远程控制',
          price: {
            left: '￥',
            center: '0',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk',
            },
            {
              status: 'done',
              txt: 'billd-desk-server',
            },
          ],
          btn: {
            type: 'link',
            link: 'https://github.com/galaxy-s10/billd-desk',
            txt: '立即部署',
          },
        },
        {
          color: '#EE826C',
          name: 'App远程控制',
          desc: '手机App远程控制',
          price: {
            left: '￥',
            center: '0',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-flutter',
            },
            {
              status: 'done',
              txt: 'billd-desk-server',
            },
          ],
          btn: {
            type: 'link',
            link: 'https://github.com/galaxy-s10/billd-desk',
            txt: '立即部署',
          },
        },
        {
          color: '#bae637',
          name: '远程控制+后台',
          desc: '网页/客户端远程控制；<br />远程控制后台',
          price: {
            left: '￥',
            center: '0',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk',
            },
            {
              status: 'todo',
              txt: 'billd-desk-admin',
            },
            {
              status: 'done',
              txt: 'billd-desk-server',
            },
          ],
          btn: {
            type: 'link',
            link: 'https://github.com/galaxy-s10/billd-desk',
            txt: '立即部署',
          },
        },
        {
          color: '#eb2f96',
          name: 'App远程控制+后台',
          desc: '手机App远程控制；<br />远程控制后台',
          price: {
            left: '￥',
            center: '0',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-flutter',
            },
            {
              status: 'todo',
              txt: 'billd-desk-admin',
            },
            {
              status: 'done',
              txt: 'billd-desk-server',
            },
          ],
          btn: {
            type: 'link',
            link: 'https://github.com/galaxy-s10/billd-desk',
            txt: '立即部署',
          },
        },
        {
          color: '#13c2c2',
          name: '全平台远程控制',
          desc: '网页/客户端远程控制；<br />手机App远程控制；<br />远程控制后台',
          price: {
            left: '￥',
            center: '0',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk',
            },
            {
              status: 'done',
              txt: 'billd-desk-flutter',
            },
            {
              status: 'todo',
              txt: 'billd-desk-admin',
            },
            {
              status: 'done',
              txt: 'billd-desk-server',
            },
          ],
          btn: {
            type: 'link',
            link: 'https://github.com/galaxy-s10/billd-desk',
            txt: '立即部署',
          },
        },
      ],
    },
    multi: {
      slogan: ['一次部署，永久使用！', '无需懂技术，全程专人部署🚀'],
      list: [
        {
          color: '#1677ff',
          name: '远程控制',
          desc: '网页/客户端远程控制',
          price: {
            left: '￥',
            center: '4999',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
        {
          color: '#EE826C',
          name: 'App远程控制',
          desc: '手机App远程控制',
          price: {
            left: '￥',
            center: '4999',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-flutter-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
        {
          color: '#bae637',
          name: '远程控制+后台',
          desc: '网页/客户端远程控制；<br />远程控制后台',
          price: {
            left: '￥',
            center: '5999',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-pro',
            },
            {
              status: 'todo',
              txt: 'billd-desk-admin-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'todo',
            link: '',
            txt: '敬请期待',
          },
        },
        {
          color: '#eb2f96',
          name: 'App远程控制+后台',
          desc: '手机App远程控制；<br />远程控制后台',
          price: {
            left: '￥',
            center: '5999',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-flutter-pro',
            },
            {
              status: 'todo',
              txt: 'billd-desk-admin-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'todo',
            link: '',
            txt: '敬请期待',
          },
        },
        {
          color: '#13c2c2',
          name: '全平台远程控制',
          desc: '网页/客户端远程控制；<br />手机App远程控制；<br />远程控制后台',
          price: {
            left: '￥',
            center: '6999',
            right: '元',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-flutter-pro',
            },
            {
              status: 'todo',
              txt: 'billd-desk-admin-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'todo',
            link: '',
            txt: '敬请期待',
          },
        },
      ],
    },
    forever: {
      slogan: ['BilldDesk支持定制化！', '适合二开，定制个性化功能~'],
      list: [
        {
          color: '#38c0ff',
          name: '在线咨询',
          desc: '咨询任何问题服务',
          price: {
            left: '￥',
            center: '100',
            right: '元/小时',
          },
          tip: '',
          feat: [
            {
              status: 'done',
              txt: '一对一解答',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
        {
          color: '#eb2f96',
          name: '技术支持',
          desc: '处理技术相关问题服务',
          price: {
            left: '￥',
            center: '200',
            right: '元/小时',
          },
          tip: '',
          feat: [
            {
              status: 'done',
              txt: '远程协助处理问题',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
        {
          color: '#30d1aa',
          name: '定制私有化部署',
          desc: '适用于个人/企业自建远程桌面',
          price: {
            left: '￥',
            center: '6999',
            right: '元/起',
          },
          tip: '包含以下代码仓库：',
          feat: [
            {
              status: 'done',
              txt: 'billd-desk-pro',
            },
            {
              status: 'done',
              txt: 'billd-desk-server-pro',
            },
          ],
          btn: {
            type: 'showContact',
            link: '',
            txt: '立即咨询',
          },
        },
      ],
    },
  },
};
