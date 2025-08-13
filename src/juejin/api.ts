import fetch from 'node-fetch';
import { ApiResponse } from '../types/index.js';

interface BaseHeaders {
  cookie: string;
  [key: string]: string;
}

const baseHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
  'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  referer: 'https://juejin.cn/',
  accept: '*/*',
};

export async function dipLucky(headers: BaseHeaders): Promise<string> {
  const list = await fetch(
    'https://api.juejin.cn/growth_api/v1/lottery_history/global_big',
    {
      headers: { ...baseHeaders, ...headers },
      method: 'POST',
      body: JSON.stringify({ page_no: 1, page_size: 5 }),
    }
  ).then(res => res.json() as Promise<ApiResponse>)
  .then((list: ApiResponse) => {
    if (list.err_no !== 0) throw new Error('网络异常！');

    if (list.data.lotteries.length > 0) {
      return fetch(
        'https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky',
        {
          headers: { ...baseHeaders, ...headers },
          method: 'POST',
          body: JSON.stringify({
            lottery_history_id: list.data.lotteries[0].history_id,
          }),
        }
      ).then(res => res.json() as Promise<ApiResponse>)
      .then((res: ApiResponse) => {
        if (res.err_no !== 0) throw new Error('网络异常！');

        if (res.data.has_dip)
          return `今日已经沾过喜气！喜气值：${res.data.total_value}`;

        if (res.data.dip_action === 1)
          return `沾喜气成功！喜气值：${res.data.total_value}`;

        throw new Error('未知错误');
      });
    }

    throw new Error('未知错误');
  });

  return list;
}

export async function todayStatus({ headers }: { headers: BaseHeaders }): Promise<ApiResponse> {
  const res = await fetch('https://api.juejin.cn/growth_api/v1/get_today_status', {
    headers: { ...baseHeaders, ...headers },
    method: 'GET'
  }).then(res => res.json() as Promise<ApiResponse>);
  return res;
}

export async function checkin({ headers }: { headers: BaseHeaders }): Promise<ApiResponse> {
  const res = await fetch('https://api.juejin.cn/growth_api/v1/check_in', {
    headers: { ...baseHeaders, ...headers },
    method: 'POST'
  }).then(res => res.json() as Promise<ApiResponse>);
  return res;
}

export async function getCurPoint({ headers }: { headers: BaseHeaders }): Promise<ApiResponse> {
  const res = await fetch('https://api.juejin.cn/growth_api/v1/get_cur_point', {
    headers: { ...baseHeaders, ...headers },
    method: 'GET'
  }).then(res => res.json() as Promise<ApiResponse>);
  return res;
}

export async function draw({ headers }: { headers: BaseHeaders }): Promise<ApiResponse> {
  const res = await fetch('https://api.juejin.cn/growth_api/v1/lottery/draw', {
    headers: { ...baseHeaders, ...headers },
    method: 'POST'
  }).then(res => res.json() as Promise<ApiResponse>);
  return res;
}

// ... 其他 API 函数类似重构 