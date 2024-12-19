import fetch from "node-fetch";

const baseHeaders = {
  "content-type": "application/json; charset=utf-8",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
  "accept-encoding": "gzip, deflate, br",
  "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
  "sec-ch-ua":
    '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  referer: "https://juejin.cn/",
  accept: "*/*",
};

export async function dipLucky(headers) {
  const list = await fetch(
    "https://api.juejin.cn/growth_api/v1/lottery_history/global_big",
    {
      headers,
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ page_no: 1, page_size: 5 }),
    },
  ).then((res) => res.json());

  const res = await fetch(
    "https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky",
    {
      headers,
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        lottery_history_id: list.data.lotteries[0].history_id,
      }),
    },
  ).then((res) => res.json());

  if (res.err_no !== 0) return Promise.reject("网络异常！");

  if (res.data.has_dip)
    return `今日已经沾过喜气！喜气值：${res.data.total_value}`;

  if (res.data.dip_action === 1)
    return `沾喜气成功！喜气值：${res.data.total_value}`;
}

/**
 * 抽奖
 * @param {Object} param0 - 配置项
 * @param {Object} param0.headers - headers
 */
export function draw({ headers }) {
  const _headers = { ...baseHeaders, ...headers };
  return fetch("https://api.juejin.cn/growth_api/v1/lottery/draw", {
    headers: _headers,
    method: "POST",
    credentials: "include",
  }).then((res) => res.json());
}

/**
 * 签到
 * @param {Object} param0 - 配置项
 * @param {Object} param0.headers - headers
 */
export function checkin({ headers }) {
  const _headers = { ...baseHeaders, ...headers };
  return fetch("https://api.juejin.cn/growth_api/v1/check_in", {
    headers: _headers,
    method: "POST",
    credentials: "include",
  }).then((res) => res.json());
}

/**
 * 查询今日抽奖机会
 * @param {Object} param0 - 配置项
 * @param {Object} param0.headers - headers
 */
export function todayFreeCount({ headers }) {
  const _headers = { ...baseHeaders, ...headers };
  return fetch("https://api.juejin.cn/growth_api/v1/lottery_config/get", {
    headers: _headers,
    method: "GET",
    credentials: "include",
  }).then((res) => res.json());
}

/**
 * 查询今日签到状态
 * @param {Object} param0 - 配置项
 * @param {Object} param0.headers - headers
 */
export function todayStatus({ headers }) {
  const _headers = { ...baseHeaders, ...headers };
  return fetch("https://api.juejin.cn/growth_api/v2/get_today_status", {
    headers: _headers,
    method: "GET",
    credentials: "include",
  }).then((res) => res.json());
}

/**
 * 查询当前积分
 * @param {Object} param0 - 配置项
 * @param {Object} param0.headers - headers
 */
export function getCurPoint({ headers }) {
  const _headers = { ...baseHeaders, ...headers };
  return fetch("https://api.juejin.cn/growth_api/v1/get_cur_point", {
    headers: _headers,
    method: "GET",
    credentials: "include",
  }).then((res) => res.json());
}
