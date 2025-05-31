export interface BilldHtmlWebpackPluginLog {
  pkgName: string;
  pkgVersion: string;
  pkgRepository: string;
  commitSubject: string;
  commitBranch: string;
  committerDate: string;
  commitHash: string;
  committerName: string;
  committerEmail: string;
  lastBuildDate: string;
}

export interface IDeskVersion {
  id?: number;
  type?: string;
  /** 1:强制更新; 2:不强制更新 */
  force?: number;
  /** 版本 */
  version?: string;
  /** 显示版本 */
  show_version?: string;
  /** 更新内容 */
  update_content?: string;
  /** 更新日期 */
  update_date?: string;
  /** 是否禁用，1:禁用; 2:不禁用 */
  disable?: number;
  /** 禁用消息 */
  disable_msg?: number;
  /** macos 32位ARM */
  download_macos_arm_dmg?: string;
  /** macos 64位ARM */
  download_macos_arm64_dmg?: string;
  /** macos 64位X86，X86是x86_64 或 amd64的别名  */
  download_macos_x64_dmg?: string;
  /** windows 32位ARM */
  download_windows_arm_exe?: string;
  /** windows 64位ARM */
  download_windows_arm64_exe?: string;
  /** windows 64位X86，X86是x86_64 或 amd64的别名 */
  download_windows_x64_exe?: string;
  /** linux 32位ARM */
  download_linux_arm_appimage?: string;
  /** linux 64位ARM */
  download_linux_arm64_appimage?: string;
  /** linux 64位X86，X86是x86_64 或 amd64的别名 */
  download_linux_x64_appimage?: string;
  /** linux deb 32位ARM */
  download_linux_arm_deb?: string;
  /** linux deb 64位ARM */
  download_linux_arm64_deb?: string;
  /** linux deb 64位X86，X86是x86_64 或 amd64的别名 */
  download_linux_x64_deb?: string;
  download_android_apk?: string;
  download_ios_ipa?: string;
  download_ios_deb?: string;
  download_ios_pxl?: string;
  remark?: string;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum MediaTypeEnum {
  camera,
  screen,
  microphone,
  txt,
  img,
  media,
  time,
  stopwatch,
  webAudio,
  pk,
  metting,
}

export enum ClientEnvEnum {
  android = 'android',
  ios = 'ios',
  ipad = 'ipad',
  web = 'web',
  web_mobile = 'web_mobile',
  web_pc = 'web_pc',
  windows = 'windows',
  macos = 'macos',
  linux = 'linux',
}

export enum ClientAppEnum {
  billd_live = 'billd_live',
  billd_live_admin = 'billd_live_admin',
  billd_desk = 'billd_desk',
  billd_desk_admin = 'billd_desk_admin',
}

export interface IDeskUser {
  id?: number;
  uuid?: string;
  password?: string;
  new_password?: string;
  /** status: 1正常；2非法 */
  status?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IScreenWall {
  id?: number;
  uuid?: string;
  group_name?: string;
  c_uuid?: string;
  c_password?: string;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum DeskConfigTypeEnum {
  electronVersionConfig = 'electronVersionConfig',
  flutterVersionConfig = 'flutterVersionConfig',
}

export type IListBase = {
  nowPage?: number | string;
  pageSize?: number | string;
  orderBy?: string;
  orderName?: string;
  keyWord?: string;
  childNowPage?: number | string;
  childPageSize?: number | string;
  childOrderBy?: string;
  childOrderName?: string;
  childKeyWord?: string;
  rangTimeType?: 'created_at' | 'updated_at' | 'deleted_at';
  rangTimeStart?: number | string;
  rangTimeEnd?: number | string;
};

export type IList<T> = IListBase & T;

export interface IPaging<T> {
  nowPage: number;
  pageSize: number;
  hasMore: boolean;
  total: number;
  rows: T[];
}

export enum GlobalMsgTypeEnum {
  user = 'user',
  system = 'system',
  activity = 'activity',
  notification = 'notification',
  alwaysRedMsg = 'alwaysRedMsg',
}

export enum SwitchEnum {
  yes,
  no,
}

export interface IGlobalMsg {
  id?: number;
  user_id?: number;
  client_ip?: string;
  type?: GlobalMsgTypeEnum;
  show?: SwitchEnum;
  show_date?: string;
  priority?: number;
  title?: string;
  content?: string;
  remark?: string;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ILoginRecord {
  id?: number;
  uuid?: string;
  user_agent?: string;
  system?: string;
  brand?: string;
  model?: string;
  client_ip?: string;
  client_env?: ClientEnvEnum;
  client_app?: ClientAppEnum;
  client_app_version?: string;
  remark?: string;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export type closeMainWindowType = 'mini' | 'exit';
