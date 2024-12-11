const sendMail = require('../sendMail');
const api = require('./api');

const [user, pass, emailTo, accessToken] = process.argv.slice(2);
const domain = 'mall-api.luckincoffeeshop.com' // 主站域名
process.env.user = user; // 邮箱账号
process.env.pass = pass; // 邮箱密码
process.env.accessToken = accessToken; // 用户 token

/**
 * 发送签到失败邮件
 * @param {Error} e 错误
 * @returns Promise<void>
 */
function sendFailMail(e) {
    const message = e.message;
    const html = `
  <p style="font-size: 16px; color: #f00;">签到失败：</p>
  <code>${message}</code>
  `;
    return sendMail({
        from: domain,
        to: emailTo,
        subject: '瑞幸即享自动签到',
        html
    }).then(() => {
        console.log('邮件发送成功')
    }).catch(e => {
        console.error(e, '邮件发送失败');
    })
}

/**
 * 开始执行
 */
function start() {
    console.log(`user=${user} pass=${pass} to=${emailTo} domain=${domain} accessToken=${accessToken}`)
    api.checkin({ domain, accessToken, }).then((data) => {
        console.log('[step 1] 签到成功');
        const html = `
      <p style="font-size: 16px; color: #333;">签到成功，${data}</p>
      `
        return sendMail({
            from: domain,
            to: emailTo,
            subject: '瑞幸即享自动签到',
            html
        }).then(() => {
            console.log('[step 2] 邮件发送成功')
        }).catch(e => {
            console.log('[step 2] 邮件发送失败', e);
        })
    }).catch((e) => {
        console.log('[step 1] 签到失败', e);
        sendFailMail(e);
    })
}

start();
