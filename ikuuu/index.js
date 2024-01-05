const sendMail = require('../sendMail');
const api = require('./api');

const [user, pass, domain, cookie, emailTo] = process.argv.slice(0,2);
process.env.user = user; // 邮箱账号
process.env.pass = pass; // 邮箱密码
process.env.domain = domain; // 主站域名
process.env.cookie = cookie; // 登录用户的 cookie

function start() {
  api.checkin({ domain, cookie, }).then((data) => {
    const html = `
    <p style="font-size: 16px; color: #333;">签到成功，${data.msg}</p>
    `
    return sendMail({
      from: domain,
      to: emailTo,
      subject: 'ikuuu自动签到',
      html
    }).catch(e => {
      console.error(e, '邮件发送失败');
    })
  }).catch(e => {
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
    }).catch(e => {
      console.error(e, '邮件发送失败');
    })
  })
}

start();
