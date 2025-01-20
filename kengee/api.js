import fetch from "node-fetch";

/**
 * 签到
 * @type {import('./api').Icheckin}
 */
export function checkin({ domain, cookie, token }) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams();
    body.append("signOperatingId", "270123528871532");
    body.append("token", token);
    fetch(`https://${domain}/sign/component/doSign`, {
      headers: {
        host: domain,
        authority: domain,
        referer:
          "https://67766.activity-12.m.duiba.com.cn/sign/component/page?signOperatingId=270123528871532",
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF MacWechat/3.8.9(0x13080911) XWEB/1227",
        acceptLanguage: "zh-CN,zh;q=0.9",
        origin: `https://${domain}`,
        cookie,
      },
      method: "POST",
      body,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          resolve("签到成功");
        } else {
          reject(
            new Error(res.desc ? res.desc || JSON.stringify(res) : "未知错误"),
          );
        }
      })
      .catch(reject);
  });
}
