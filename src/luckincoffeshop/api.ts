import fetch from 'node-fetch';
import { TaskListResponse } from '@@types/luckincoffeshop.js';

interface GetTaskListParams {
  domain: string;
  accessToken: string;
}

/**
 * 查询活动列表
 */
export function getTaskList({ domain, accessToken }: GetTaskListParams): Promise<TaskListResponse> {
  return new Promise((resolve, reject) => {
    fetch(`https://${domain}/p/center/getTaskList`, {
      headers: {
        host: domain,
        xweb_xhr: '1',
        locale: 'zh_CN',
        authority: domain,
        referer: 'https://servicewechat.com/wxcabfbc76cf058d0b/66/page-frame.html',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF MacWechat/3.8.9(0x13080911) XWEB/1227',
        acceptLanguage: 'zh-CN,zh;q=0.9',
        origin: `https://${domain}`,
        authorization: accessToken
      },
      method: 'GET'
    })
    .then(res => res.json() as Promise<TaskListResponse>)
    .then((res: TaskListResponse) => {
      console.log(res)
      if (res.code !== '00000') {
        reject(new Error(res.msg || JSON.stringify(res)))
      } else {
        resolve(res)
      }
    })
    .catch(reject)
  })
} 