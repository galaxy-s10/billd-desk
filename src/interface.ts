export * from '@/pure-interface';
import {
  ILiveRoom,
  LiveRoomIsShowEnum,
  LiveRoomStatusEnum,
} from '@/types/ILiveRoom';
import { IUser } from '@/types/IUser';

export enum SwitchEnum {
  yes,
  no,
}

export enum GlobalMsgTypeEnum {
  user = 'user',
  system = 'system',
  activity = 'activity',
  notification = 'notification',
}

export interface IGlobalMsg {
  id?: number;
  user_id?: number;
  client_ip?: string;
  type?: GlobalMsgTypeEnum;
  show?: SwitchEnum;
  priority?: number;
  title?: string;
  content?: string;
  remark?: string;

  user?: IUser;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IFlvStatistics {
  url: string;
  hasRedirect: boolean;
  speed: number;
  loaderType: string;
  currentSegmentIndex: number;
  totalSegmentCount: number;
  playerType: string;
  decodedFrames: number;
  droppedFrames: number;
}

export enum LiveRenderEnum {
  video = 'video',
  canvas = 'canvas',
}

export enum RankTypeEnum {
  liveRoom = 'liveRoom',
  user = 'user',
  sponsors = 'sponsors',
  wallet = 'wallet',
  blog = 'blog',
  signin = 'signin',
}

export interface IWallet {
  id?: number;
  user_id?: number;
  balance?: number;

  user?: IUser;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export type IList<T> = {
  nowPage?: number;
  pageSize?: number;
  orderBy?: string;
  orderName?: string;
  keyWord?: string;
  rangTimeType?: 'created_at' | 'updated_at' | 'deleted_at';
  rangTimeStart?: string;
  rangTimeEnd?: string;
} & T;

export interface IPaging<T> {
  nowPage: number;
  pageSize: number;
  hasMore: boolean;
  total: number;
  rows: T[];
}

export enum FormTypeEnum {
  'input' = 'input',
  'password' = 'password',
  'number' = 'number',
  'select' = 'select',
  'radio' = 'radio',
  'checkbox' = 'checkbox',
  'markdown' = 'markdown',
  'switch' = 'switch',
  'upload' = 'upload',
  'treeSelect' = 'treeSelect',
  'datePicker' = 'datePicker',
}

export interface ILiveConfig {
  id?: number;
  key?: string;
  value?: string;
  desc?: string;
  type?: FormTypeEnum;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum WalletRecordEnum {
  reward,
  recharge,
  signin,
}

export enum WalletRecordAmountStatusEnum {
  add,
  del,
}

export interface IWalletRecord {
  id?: number;
  user_id?: number;
  order_id?: number;
  type?: WalletRecordEnum;
  name?: string;
  amount?: number;
  amount_status?: WalletRecordAmountStatusEnum;
  remark?: string;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

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
  remark?: string;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum PlatformEnum {
  qqLogin = 'qq_login',
  wechatLogin = 'wechat_login',
}

export interface IAuth {
  id?: number;
  auth_name?: string;
  auth_value?: string;
  type?: number;
  priority?: number | string;
  p_id?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: null;
  c_auths?: number[];
}

export interface IRole {
  id?: number;
  role_name?: string;
  role_value?: string;
  type?: number;
  priority?: number | string;
  p_id?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: null;
  role_auths?: number[];
  c_roles?: number[];
}

export interface IArea {
  id?: number;
  name?: string;
  /** 备注 */
  remark?: string;
  /** 权重 */
  weight?: number;
  area_live_rooms?: IAreaLiveRoom[];
  live_room_is_show?: LiveRoomIsShowEnum;
  live_room_status?: LiveRoomStatusEnum;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IAreaLiveRoom {
  id?: number;
  area_id?: number;
  room_id?: number;
  /** 分区信息 */
  area?: IUser;
  /** 直播间信息 */
  live_room?: ILiveRoom;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ISrsPublishStream {
  /** 客户端在获取信息时，必须检查ServerID是否改变，改变时就是服务器重启，之前所有的数据都应该作废了。 */
  srs_server_id?: string;
  srs_service_id?: string;
  srs_action?: string;
  srs_client_id?: string;
  srs_ip?: string;
  srs_vhost?: string;
  srs_app?: string;
  srs_tcUrl?: string;
  srs_stream?: string;
  srs_param?: string;
  srs_stream_url?: string;
  srs_stream_id?: string;
}

export interface ILive extends ISrsPublishStream {
  id?: number;
  /** 用户信息 */
  user?: IUser;
  /** 直播间信息 */
  live_room?: ILiveRoom;

  socket_id?: string;
  user_id?: number;
  room_id?: number;
  live_room_is_show?: LiveRoomIsShowEnum;
  live_room_status?: LiveRoomStatusEnum;
  /** 1开启;2关闭 */
  track_video?: number;
  /** 1开启;2关闭 */
  track_audio?: number;

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

export enum DanmuMsgTypeEnum {
  danmu,
  otherJoin,
  userLeaved,
  system,
  redbag,
  reward,
}

export interface ILiveUser {
  // id: string;
  // rooms?: string[];
  // userInfo?: IUser;
  created_at: string;
  value: {
    socketId: string;
    joinRoomId: number;
    userInfo?: IUser;
  };
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
