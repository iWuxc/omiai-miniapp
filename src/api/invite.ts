import Request from 'luch-request';

const http = new Request();

const baseUrl = import.meta.env.PROD
  ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:10131/api')
  : '/api';

http.setConfig((config) => {
  config.baseURL = baseUrl;
  config.timeout = 15000;
  config.header = {
    ...config.header,
    'Content-Type': 'application/json'
  };
  return config;
});

http.interceptors.response.use((response) => {
  const { data } = response;
  if (data.code === 0) {
    return data.data;
  } else {
    return Promise.reject(data);
  }
}, (response) => {
  return Promise.reject(response);
});

export const createInviteClient = (data: any) => {
  return http.post('/invite/clients/create', data);
};

export default http;