import { checkin } from './api.js';
import sendMail from '@@utils/sendMail.js';
import { EmailOptions } from '@@types/index.js';

const [user, pass, emailTo, cookie, token] = process.argv.slice(2);
const domain = '67766.activity-12.m.duiba.com.cn';

process.env.user = user;
process.env.pass = pass;

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
    subject: '仟吉每日签到',
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
    subject: '仟吉每日签到',
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
    const result = await checkin({ domain, cookie, token });
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