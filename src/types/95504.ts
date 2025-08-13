export interface CheckinParams {
  activityId: number;
  userId: string;
  phone: string;
}

export interface CheckinResponse {
  code: number;
  msg?: string;
  data?: any;
} 