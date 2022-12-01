const { checkinAndLogs } = require('./api');
const sendMail = require('../sendMail');

const activityOptions = {
  activityId: 48,
  userId: '1254064361',
  phone: '15827367591'
};

const emailOptions = {
  to: '281910378@qq.com'
}

const [user, pass] = process.argv.slice(2);
process.env.user = user;
process.env.pass = pass;

function main() {
  checkinAndLogs(activityOptions).then((res) => {
    sendMails(res, true).then(() => {
      console.log('签到成功邮件发送成功')
    })
  }).catch((e) => {
    sendMails({ message: e.message }, false).then(() => {
      console.log('签到失败邮件发送成功')
    })
  })
}

function sendMails(res, success) {
  const html = success ? `
    <div>
      <p style="color: #42b983;">95504活动签到成功</p>
      <code><pre>${JSON.stringify(res, null, 2)}</pre></code>
      <p><a href="http://activity.95504.net/cnpc-sports/" target="_blank">活动链接</a></p>
    </div>
  ` : `
    <div>
      <p style="color: #f66;">95504活动签到失败</p>
      <code><pre>${JSON.stringify(res, null, 2)}</pre></code>
      <p><a href="http://activity.95504.net/cnpc-sports/" target="_blank">活动链接</a></p>
    </div>
  `
  return sendMail({
    from: 'public_actions',
    to: emailOptions.to,
    subject: '95504签到活动',
    html
  });
}

main();
