const sendMail = require('../sendMail');
const api = require('./api');

const [user, pass, emailTo, domain, userName, passWord] = process.argv.slice(2);
process.env.user = user; // 邮箱账号
process.env.pass = pass; // 邮箱密码
process.env.domain = domain; // 主站域名
process.env.userName = userName; // 登录账号
process.env.passWord = passWord; // 登录密码


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
    subject: 'ikuuu自动签到',
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
  // console.log(`user=${user} pass=${pass} to=${emailTo} domain=${domain} cookie=${cookie}`)
  api.login({ domain, userName, passWd: passWord, }).then((cookie) => {
    api.checkin({ domain, cookie, }).then((data) => {
      const html = `
      <p style="font-size: 16px; color: #333;">签到成功，${data.msg}</p>
      `
      return sendMail({
        from: domain,
        to: emailTo,
        subject: 'ikuuu自动签到',
        html
      }).then(() => {
        console.log('邮件发送成功')
      }).catch(e => {
        console.error(e, '邮件发送失败');
      })
    }).catch(sendFailMail)
  }).catch(sendFailMail);
}

start();
