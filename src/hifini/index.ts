import { checkin } from './api.js';
import sendMail from '../utils/sendMail.js';
import { EmailOptions } from '../types/index.js';

// 定义静态变量 测试用
// const domain = 'hifiki.com'; // hifini.com has changed to hifiki.com
// const cookie = 'bbs_sid=qf95q4qkg12072pjevoe0eherv; bbs_token=xv35IdlO8Pac_2Bq4_2FfZsOrC4fMG9ABxozb5hrM_2B0toXnf4P1QFUcIXy5YWj1uVfciM0v0ZyxX14tMNiXfoiokrbqf_2FaZrYL1m';
// const emailTo = '281910378@qq.com';

const [user, pass, emailTo, cookie, domain] = process.argv.slice(2)
process.env.user = user; // 邮箱账号
process.env.pass = pass; // 邮箱密码
process.env.cookie = cookie
process.env.emailTo = emailTo
process.env.domain = domain

/**
 * 发送签到失败邮件
 */
async function sendFailMail(e: Error): Promise<void> {
  const message = e.message;
  const html = `
  <p style="font-size: 16px; color: #f00;">签到失败：</p>
  <code>${message}</code>
  `;

  const emailOptions: EmailOptions = {
    from: domain,
    to: emailTo,
    subject: 'hifiki自动签到',
    html
  };

  try {
    await sendMail(emailOptions);
    console.log('邮件发送成功');
  } catch (e) {
    console.error(e, '邮件发送失败');
  }
}

/**
 * 发送签到成功邮件
 */
async function sendSuccessMail(message: string): Promise<void> {
  const html = `
  <p style="font-size: 16px; color: #333;">签到成功：</p>
  <code>${message}</code>
  `;

  const emailOptions: EmailOptions = {
    from: domain,
    to: emailTo,
    subject: 'hifini自动签到',
    html
  };

  try {
    await sendMail(emailOptions);
    console.log('邮件发送成功');
  } catch (e) {
    console.error(e, '邮件发送失败');
  }
}

async function main(): Promise<void> {
  try {
    const result = await checkin({ domain, cookie });
    await sendSuccessMail(result);
  } catch (e) {
    if (e instanceof Error) {
      await sendFailMail(e);
    } else {
      await sendFailMail(new Error('未知错误'));
    }
  }
}

main().catch(console.error); 