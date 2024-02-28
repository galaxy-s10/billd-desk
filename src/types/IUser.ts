import { IAuth, IRole, IWallet } from '@/interface';

import { ILiveRoom } from './ILiveRoom';

export interface IQqUser {
  id?: number;
  client_id?: number;
  openid?: string;
  unionid?: string;
  nickname?: string;
  figureurl?: string;
  figureurl_1?: string;
  figureurl_2?: string;
  figureurl_qq_1?: string;
  figureurl_qq_2?: string;
  constellation?: string;
  gender?: string;
  city?: string;
  province?: string;
  year?: string;
  ret?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IWechatUser {
  id?: number;
  appid?: string;
  openid?: string;
  nickname?: string;
  sex?: number;
  province?: string;
  city?: string;
  country?: string;
  headimgurl?: string;
  privilege?: string;
  unionid?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IEmailUser {
  id?: number;
  email?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: any;
}

export interface IGithubUser {
  id?: number;
  client_id?: string;
  login?: string;
  github_id?: number;
  node_id?: string;
  avatar_url?: string;
  gravatar_id?: string;
  url?: string;
  html_url?: string;
  type?: string;
  site_admin?: string;
  name?: string;
  company?: string;
  blog?: string;
  location?: string;
  email?: any;
  hireable?: any;
  bio?: string;
  twitter_username?: any;
  public_repos?: number;
  public_gists?: number;
  followers?: number;
  following?: number;
  github_created_at?: string;
  github_updated_at?: string;
  private_gists?: number;
  total_private_repos?: number;
  owned_private_repos?: number;
  disk_usage?: number;
  collaborators?: number;
  two_factor_authentication?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: any;
}

export interface IThirdUser {
  id?: number;
  user_id?: number;
  third_user_id?: number;
  third_platform?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

/** 用户状态 */
export enum UserStatusEnum {
  /** 正常 */
  normal,
  /** 禁用 */
  disable,
}

export enum UserIsTouristEnum {
  yes,
  no,
}

export enum UserIsRobotEnum {
  yes,
  no,
}

export enum UserCanMsgEnum {
  yes,
  no,
}

export enum UserCanWatchLiveEnum {
  yes,
  no,
}

export enum UserIsKickEnum {
  yes,
  no,
}

export interface IUser {
  id?: number;
  username?: string;
  password?: string;
  status?: UserStatusEnum;
  avatar?: string;
  desc?: string;
  token?: string;
  is_tourist?: UserIsTouristEnum;
  is_robot?: UserIsRobotEnum;
  can_msg?: UserCanMsgEnum;
  can_watch_live?: UserCanWatchLiveEnum;
  is_kick?: UserIsKickEnum;
  remark?: string;
  batch_create_user?: IUser[];

  qq_users?: IQqUser[];
  wechat_users?: IWechatUser[];
  github_users?: IGithubUser[];
  email_users?: IEmailUser[];
  parent_user_id?: number;
  parent_user_username?: string;

  roles?: IRole[];
  auths?: IAuth[];

  user_roles?: number[];
  wallet?: IWallet;

  live_room?: ILiveRoom;
  live_rooms?: ILiveRoom[];

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
