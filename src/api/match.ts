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

export const getMatchList = (params: any) => {
  return http.get('/match/list', { params });
};

export const createMatch = (data: MatchRecord) => {
  return http.post('/match/create', data);
};

export const updateMatchStatus = (data: { id: number; status: number; remark?: string }) => {
  return http.post('/match/update_status', data);
};

export const getFollowUps = (matchRecordId: number) => {
  return http.get('/match/followup/list', { params: { match_record_id: matchRecordId } });
};

export const createFollowUp = (data: FollowUpRecord) => {
  return http.post('/match/followup/create', data);
};

export const getReminders = () => {
  return http.get('/match/reminders');
};
