import http from '@/utils/request';

export const analyzeImport = (data: { content: string }) => {
  return http.post('/client/import/analyze', data);
};

export const batchImport = (data: { list: any[] }) => {
  return http.post('/client/import/batch', data);
};
