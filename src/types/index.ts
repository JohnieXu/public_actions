export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface ApiResponse<T = any> {
  code: string | number;
  data: T;
  msg?: string;
  err_no?: number;
}

export interface CheckinResult {
  type: string;
  result: number; // 0: success, 1: fail
  msg: string;
} 