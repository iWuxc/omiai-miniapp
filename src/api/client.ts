import http from '@/utils/request';

// Client Model
export interface Client {
  id?: number;
  name: string;
  gender: number; // 1: Male, 2: Female
  phone: string;
  birthday: string;
  zodiac?: string;
  height?: number;
  weight?: number;
  education?: number;
  marital_status?: number;
  address?: string;
  family_description?: string;
  income?: number;
  profession?: string;
  house_status?: number;
  car_status?: number;
  partner_requirements?: string;
  remark?: string;
  photos?: string; // JSON string
  tags?: string;
  status?: number;
  house_address?: string;
  created_at?: string;
  updated_at?: string;
  // Display helper
  age?: number;
  avatar?: string;
}

// Client List Params
export interface ClientListParams {
  page?: number;
  page_size?: number;
  name?: string;
  phone?: string;
  gender?: number;
  min_age?: number;
  max_age?: number;
  min_height?: number;
  max_height?: number;
  education?: number;
  income?: number;
  // Phase 1 Params
  scope?: string;
  status?: number;
  tags?: string;
}

export const getClientList = (params: ClientListParams) => {
  return http.get('/client/list', { params });
};

export const createClient = (data: Client) => {
  return http.post('/client/create', data);
};

export const claimClient = (data: { client_id: number }) => {
  return http.post('/client/claim', data);
};

export const releaseClient = (data: { client_id: number }) => {
  return http.post('/client/release', data);
};

export const getClientDetail = (id: number) => {
  return http.get(`/client/detail/${id}`);
};

export const matchClient = (id: number) => {
  return http.get(`/client/match/${id}`);
};

export const getClientStats = () => {
  return http.get('/client/stats');
};
