import http from '@/utils/request';

export interface MatchRecord {
  id?: number;
  male_client_id: number;
  female_client_id: number;
  match_date: string;
  match_score: number;
  status: number;
  remark?: string;
  male_client?: any;
  female_client?: any;
}

export interface FollowUpRecord {
  id?: number;
  match_record_id: number;
  follow_up_date: string;
  method: string;
  content: string;
  feedback: string;
  satisfaction: number;
  attachments?: string;
  next_follow_up_at?: string;
}

export interface MatchStatusHistory {
  id: number;
  match_record_id: number;
  old_status: number;
  new_status: number;
  change_time: string;
  operator: string;
  reason: string;
}

export const getMatchList = (params: any) => {
  return http.get('/couples/list', { params });
};

export const createMatch = (data: MatchRecord) => {
  return http.post('/couples/create', data);
};

export const updateMatchStatus = (data: { id: number; status: number; remark?: string; reason?: string; operator?: string }) => {
  return http.post('/couples/update_status', data);
};

export const getFollowUps = (matchRecordId: number) => {
  return http.get('/couples/followup/list', { params: { match_record_id: matchRecordId } });
};

export const createFollowUp = (data: FollowUpRecord) => {
  return http.post('/couples/followup/create', data);
};

export const getReminders = () => {
  return http.get('/couples/reminders');
};

export const getStatusHistory = (matchRecordId: number) => {
  return http.get('/couples/status/history', { params: { match_record_id: matchRecordId } });
};

export const getCandidates = (clientId: number) => {
  return http.get(`/clients/${clientId}/candidates`);
};

export const getCompareResult = (clientId: number, candidateId: number) => {
  return http.get(`/clients/${clientId}/compare/${candidateId}`);
};

export const confirmCouple = (data: { client_id: number; candidate_id: number }) => {
  return http.post('/couples/confirm', data);
};

export const dissolveMatch = (data: { client_id: number; reason: string }) => {
  return http.post('/couples/dissolve', data);
};

export const getMatchStats = () => {
  return http.get('/couples/stats');
}
