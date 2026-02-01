/**
 * 环境检测工具类
 */

export enum Platform {
  H5 = 'H5',
  MP_WEXIN = 'MP-WEIXIN',
  MP_ALIPAY = 'MP-ALIPAY',
  MP_BAIDU = 'MP-BAIDU',
  OTHER = 'OTHER'
}

export const getPlatform = (): Platform => {
  // #ifdef H5
  return Platform.H5;
  // #endif
  
  // #ifdef MP-WEIXIN
  return Platform.MP_WEXIN;
  // #endif
  
  // #ifdef MP-ALIPAY
  return Platform.MP_ALIPAY;
  // #endif
  
  // #ifdef MP-BAIDU
  return Platform.MP_BAIDU;
  // #endif
  
  return Platform.OTHER;
};

export const isH5 = () => getPlatform() === Platform.H5;
export const isMpWeixin = () => getPlatform() === Platform.MP_WEXIN;
