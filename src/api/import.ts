import http from '@/utils/request';

export const analyzeImport = (data: { content: string }) => {
  return http.post('/clients/import/analyze', data, { timeout: 60000 });
};

export const batchImport = (data: { list: any[] }) => {
  return http.post('/clients/import/batch', data, { timeout: 60000 });
};
