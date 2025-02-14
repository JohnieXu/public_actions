import { checkin } from './api.js';
import sendMail from '../utils/sendMail.js';

// 定义静态变量
const domain = 'hifini.com';
const cookie = 'bbs_sid=qf95q4qkg12072pjevoe0eherv; bbs_token=xv35IdlO8Pac_2Bq4_2FfZsOrC4fMG9ABxozb5hrM_2B0toXnf4P1QFUcIXy5YWj1uVfciM0v0ZyxX14tMNiXfoiokrbqf_2FaZrYL1m';
const emailTo = '281910378@qq.com';


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
    subject: 'hifini自动签到',
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
  console.log(`domain=${domain} cookie=${cookie}`);
  checkin({ domain, cookie }).then((data) => {
    console.log('[step 1] 签到成功');
    const html = `
      <p style="font-size: 16px; color: #333;">签到成功\n\n${data}</p>
    `;
    return sendMail({
      from: domain,
      to: emailTo,
      subject: 'hifini自动签到',
      html
    }).then(() => {
      console.log('[step 2] 邮件发送成功');
    }).catch(e => {
      console.log('[step 2] 邮件发送失败', e);
    });
  }).catch((e) => {
    console.log('[step 1] 签到失败', e);
    sendFailMail(e);
  });
}

// 调用 start 函数
start();
