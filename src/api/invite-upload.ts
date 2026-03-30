import { config as appConfig } from '@/config';

const getUploadUrl = () => {
  if (import.meta.env.PROD) {
    return `${appConfig.baseUrl}/invite/common/upload`;
  }
  return `http://localhost:10131/api/invite/common/upload`;
};

export const inviteUploadFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: getUploadUrl(),
      filePath: filePath,
      name: 'file',
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