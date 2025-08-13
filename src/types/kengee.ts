export interface CheckinParams {
  domain: string;
  cookie: string;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  desc?: string;
  data?: T;
}

export interface BaseHeaders {
  host: string;
  authority: string;
  referer: string;
  userAgent: string;
  acceptLanguage: string;
  origin: string;
  cookie: string;
  [key: string]: string;
} 