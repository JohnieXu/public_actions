export interface CheckinParams {
  domain: string;
  cookie: string;
}

export interface CheckinResponse {
  success: boolean;
  message: string;
}

export interface BaseHeaders extends Record<string, string> {
  host: string;
  authority: string;
  referer: string;
  userAgent: string;
  acceptLanguage: string;
  origin: string;
  cookie: string;
} 