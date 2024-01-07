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
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        if (res.ret == 1) {
          resolve(res.msg || JSON.stringify(res))
        } else {
          reject(new Error(res ? res.msg || JSON.stringify(res) : '未知错误'))
        }
      }).catch(reject);
  })
}

function login({ domain, userName, passWd }) {
  return new Promise((resolve, reject) => {
    // https://github.com/node-fetch/node-fetch?tab=readme-ov-file#post-with-form-parameters
    const body = new URLSearchParams();
    body.append('email', userName)
    body.append('passwd', passWd)
    body.append('code', '')
    body.append('remember_me', 'on')

    fetch(`https://${domain}/auth/login`, {
      headers: {
        authority: domain,
        referer: `https://${domain}/auth/login`,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        origin: `https://${domain}`,
        // ContentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body,
      method: 'POST',
    }).then(res => {
      /**
       * @type {import('node-fetch').Headers}
       */
      // const headers = res.headers;
      // console.log(headers.get('set-cookie'))
      // console.log('login set-cookie raw')
      // console.log(res.headers.raw()['set-cookie'])
      // console.log('login set-cookie raw')

      // console.log('login set-cookie get')
      // console.log(res.headers.get('set-cookie'))
      // console.log('login set-cookie get')
      return res.json().then((body) => {
        let cookies = res.headers.raw()['set-cookie']
        .map(item => item.replaceAll(' path=/,', ''))
        .map(item => item.replaceAll(' path=/', ''))

        return {
          body,
          cookie: cookies.join(' ')
        }
      })
    })
      .then(({ body: res, cookie }) => {
        console.log(res, cookie);
        if (res.ret == 1) {
          if (cookie) {
            resolve(cookie)
          } else {
            reject(new Error('接口返回成功，但获取 cookie 失败'))
          }
        } else {
          reject(new Error(res ? res.msg || JSON.stringify(res) : '未知错误'))
        }
      })
      .catch(reject);
  })
}

module.exports = {
  login,
  checkin
}