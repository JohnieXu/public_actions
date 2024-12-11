const fetch = require('node-fetch');

/**
 * 签到
 * @type {import('./api').Icheckin}
 */
function checkin({ domain, accessToken }) {
    return new Promise((resolve, reject) => {
        fetch(`https://${domain}/p/signIn/userSignIn`, {
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
            method: 'POST'
        }).then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.code == '00000' && res.data && res.data[0]) {
                    const { score, prizeName} = res.data[0]
                    resolve(`签到获得：${score}个${prizeName}`)
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
