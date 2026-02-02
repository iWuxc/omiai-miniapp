import { config as appConfig } from '@/config';

export const uploadFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');
    const header: any = {};
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }

    uni.uploadFile({
      url: `${appConfig.baseUrl}/common/upload`,
      filePath: filePath,
      name: 'file',
      header: header,
      success: (res) => {
        if (res.statusCode !== 200) {
          console.error('Upload failed with status:', res.statusCode);
          reject({ message: `HTTP Error: ${res.statusCode}` });
          return;
        }
        
        try {
          const data = JSON.parse(res.data);
          if (data.code === 0) {
            resolve(data.data);
          } else {
            console.error('Upload API error:', data);
            reject(data);
          }
        } catch (e) {
          console.error('JSON parse error:', e);
          reject({ message: 'Invalid JSON response' });
        }
      },
      fail: (err) => {
        console.error('Upload network error:', err);
        reject(err);
      }
    });
  });
};
