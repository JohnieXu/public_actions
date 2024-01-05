const fetch = require('node-fetch');

/**
 * 签到
 * @type {import('./api').Icheckin}
 */
function checkin({ domain, cookie }) {
  return new Promise((resolve, reject) => {
    fetch(`https://${domain}/user/checkin`, {
      headers: {
        authority: domain,
        referer: `https://${domain}/user`,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        origin: `https://${domain}`,
        cookie
      },
      method: 'POST'
    }).then(res => res.json)
      .then(res => {
        console.log(res)
        if (res.ret === '1') {
          resolve(res.msg || JSON.stringify(res))
        } else {
          reject(new Error(res ? res.msg || JSON.stringify(res) : '未知错误'))
        }
      }).catch(reject);
  })
}

module.exports = {
  checkin
}