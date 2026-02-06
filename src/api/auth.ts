import http from '@/utils/request';

export const sendSms = (phone: string) => {
  return http.post('/auth/send_sms', { phone });
};

export const h5Login = (phone: string, password: string) => {
  return http.post('/auth/login/h5', { phone, password });
};

export const wxLogin = (code: string) => {
  return http.post('/auth/login/wx', { code });
};

export const getUserInfo = () => {
  return http.get('/user/info');
};
