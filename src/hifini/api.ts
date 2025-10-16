import fetch from 'node-fetch';
import { CheckinParams, BaseHeaders } from '@@types/hifini.js';

/**
 * 签到
 */
export function checkin({ domain, cookie }: CheckinParams): Promise<string> {
  return new Promise((resolve, reject) => {
    const headers = {
      accept: 'text/plain, */*; q=0.01',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      cookie,
      origin: `https://${domain}`,
      priority: 'u=1, i',
      referer: `https://${domain}/`,
      'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest'
    } as const;

    fetch(`https://${domain}/sg_sign.htm`, {
      headers,
      method: 'POST',
      /**
       * 不能直接传入URLSearchParams实例，
       * 否则application/x-www-form-urlencoded会被自动添加到 header 的 content-type 中
       */
      body: new URLSearchParams({
        sign: '51c021f9eefa63c88b17ebc704179c72be7d6c3e75929b70508aca773c5ded0d'
      }).toString()
    })
    .then(res => res.text())
    .then(res => {
      // console.log(res);
      if (res.includes('成功签到')) {
        resolve(res);
      } else {
        reject(new Error(res?.slice(0, 200) || '未知错误'));
      }
    })
    .catch(reject);
  });
} 