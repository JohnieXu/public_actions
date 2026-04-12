export interface LoginParams {
  domain: string;
  userName: string;
  passWd: string;
}

export interface TokenAuthParams {
  domain: string;
  cookie: string;
}

export interface CheckinParams {
  domain: string;
  cookie: string;
}

export interface LoginResponse {
  ret: number;
  msg?: string;
  data?: any;
}

export interface ApiResponse {
  ret: number;
  msg?: string;
  data?: any;
}

export interface BaseHeaders {
  authority: string;
  referer: string;
  userAgent: string;
  origin: string;
  cookie?: string;
  [key: string]: string | undefined;
}

export interface LoginResult {
  body: LoginResponse;
  cookie: string;
}

export enum AuthMethod {
  USERNAME_PASSWORD = 'username_password',
  TOKEN = 'token'
} 