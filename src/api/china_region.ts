import http from '@/utils/request';

// 获取省份列表
export const getProvinces = () => {
  return http.get('/china_region/provinces');
};

// 获取城市列表
export const getCities = (provinceCode: string) => {
  return http.get('/china_region/cities', { params: { province_code: provinceCode } });
};

// 获取区县列表
export const getDistricts = (cityCode: string) => {
  return http.get('/china_region/districts', { params: { city_code: cityCode } });
};

// 地区搜索
export const searchRegions = (keyword: string) => {
  return http.get('/china_region/search', { params: { keyword } });
};
