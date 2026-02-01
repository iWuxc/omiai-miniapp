import http from '@/utils/request';

export const uploadFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${http.config.baseURL}/common/upload`,
      filePath: filePath,
      name: 'file',
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 0) {
          resolve(data.data);
        } else {
          reject(data);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
