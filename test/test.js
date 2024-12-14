/**
 * 后端返回版本信息，前端判断更新逻辑
 * 可以这样设计：前端本地存有一个版本号，localVersion
 * 1.前端先判断checkUpdate，checkUpdate等于1才提示更新，否则直接不提示更新
 * 2.判断forceUpdateList，如果localVersion在forceUpdateList里面，就强制更新到最新版本
 * 3.判断newVersion，
 *    3.1如果localVersion小于newVersion，则判断localVersion是否小于minVersion，如果localVersion小于minVersion，则代表有版本更新，且是强制更新。
 *    3.2如果localVersion不小于newVersion，则代表当前是最新版本，不用更新
 * 4.判断noiceVersion，localVersion小于这个版本的就提示更新
 */
const versionInfo = {
  // 是否检查更新，1就代表检查更新
  checkUpdate: 1,
  // 最低版本
  minVersion: '0.0.100',
  // 最新版本
  newVersion: '0.0.100',
  // 显示的版本
  showNewVersion: 'v0.0.100',
  // 强更版本列表
  forceUpdateList: ['0.0.100', '0.0.101'],
  // 更新内容
  updateContent: '更新内容更新内容',
  // 更新日期
  updateDate: '2024年10月22日11:08:51',
  // 下载地址
  download: {
    macos_dmg: '',
    window_64_exe: '',
    window_32_exe: '',
    window_arm_exe: '',
    linux_64_deb: '',
    linux_64_tar: '',
    linux_arm_deb: '',
    linux_arm_tar: '',
  },
  // 禁用版本
  disableList: [
    {
      version: '0.0.100',
      msg: '当前版本过久，请前往官网更新最新版本',
    },
  ],
  // 备注
  remark: '',
};

/**
 * 后端返回版本信息
 * 前端判断status，status=1的话，则判断isUpdate、forceUpdate，download，下载对应的包
 * 前端判断status，status=2的话，则代表这个版本禁用，提示statusDesc
 */
const front = {
  // 是否提示更新，1:提示; 2:不提示
  isUpdate: 1,
  // 是否强制更新，1:强制; 2:不强制
  forceUpdate: 2,
  // 更新内容
  updateContent: '更新内容更新内容',
  // 更新日期
  updateDate: '2024年10月22日11:08:51',
  // 下载地址
  download: {
    macos_dmg: '',
    window_64_exe: '',
    window_32_exe: '',
    window_arm_exe: '',
    linux_64_deb: '',
    linux_64_tar: '',
    linux_arm_deb: '',
    linux_arm_tar: '',
  },
  // 禁用版本
  disableList: [
    {
      version: '0.0.100',
      msg: '当前版本过久，请前往官网更新最新版本',
    },
  ],
  // 备注
  remark: '',
};
