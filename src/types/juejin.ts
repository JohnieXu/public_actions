export interface BaseHeaders {
  cookie: string;
  [key: string]: string;
}

export interface LotteryData {
  lottery_name: string;
}

export interface CheckinData {
  sum_point: number;
}

export interface ApiResponse<T = any> {
  err_no: number;
  err_msg?: string;
  data: T;
} 