import http from '@/utils/request';

export interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
}

export const getBannerList = () => {
  return http.get('/banner/list');
};
