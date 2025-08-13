import fetch from 'node-fetch';
import { 
  LoginParams, 
  CheckinParams, 
  LoginResponse, 
  LoginResult,
  ApiResponse,
  BaseHeaders 
} from '../types/ikuuu.js';

/**
 * 登录
 */
export function login({ domain, userName, passWd }: LoginParams): Promise<LoginResult> {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams();
    body.append('email', userName);
    body.append('passwd', passWd);
    body.append('code', '');
    body.append('remember_me', 'on');

    const baseHeaders: BaseHeaders = {
      authority: domain,
      referer: `https://${domain}/auth/login`,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      origin: `https://${domain}`
    };

    // 转换为 HeadersInit 类型
    const headers = {
      'authority': baseHeaders.authority,
      'referer': baseHeaders.referer,
      'user-agent': baseHeaders.userAgent,
      'origin': baseHeaders.origin
    };

    fetch(`https://${domain}/auth/login`, {
      headers,
      body,
      method: 'POST',
    })
    .then(async (res) => {
      const cookieHeader = res.headers.get('set-cookie');
      const cookies = cookieHeader ? 
        cookieHeader.split(',')
          .map((cookie: string) => cookie.trim())
          .filter((cookie: string) => cookie.length > 0)
          .map((cookie: string) => cookie.split(';')[0])
        : [];

      const body = await res.json() as LoginResponse;
      return { body, cookies };
    })
    .then(({ body, cookies }) => {
      console.log(body, cookies);
      if (body.ret === 1) {
        if (cookies && cookies.length > 0) {
          resolve({ 
            body, 
            cookie: cookies.join('; ') 
          });
        } else {
          reject(new Error('接口返回成功，但获取 cookie 失败'));
        }
      } else {
        reject(new Error(body ? body.msg || JSON.stringify(body) : '未知错误'));
      }
    })
    .catch(reject);
  });
}

/**
 * 签到
 */
export function checkin({ domain, cookie }: CheckinParams): Promise<string> {
  return new Promise((resolve, reject) => {
    const baseHeaders: BaseHeaders = {
      authority: domain,
      referer: `https://${domain}/user`,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      origin: `https://${domain}`,
      cookie
    };

    // 转换为 HeadersInit 类型
    const headers = {
      'authority': baseHeaders.authority,
      'referer': baseHeaders.referer,
      'user-agent': baseHeaders.userAgent,
      'origin': baseHeaders.origin,
      'cookie': baseHeaders.cookie
    };

    fetch(`https://${domain}/user/checkin`, {
      headers: headers as HeadersInit,
      method: 'POST'
    })
    .then(async (res) => {
      const body = await res.json() as ApiResponse;
      return body;
    })
    .then((res: ApiResponse) => {
      console.log(res);
      if (res.ret === 1) {
        resolve(res.msg || '签到成功');
      } else {
        reject(new Error(res.msg || JSON.stringify(res)));
      }
    })
    .catch(reject);
  });
} 