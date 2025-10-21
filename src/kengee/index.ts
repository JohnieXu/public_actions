import { checkin } from './api.js';
import sendMail from '@@utils/sendMail.js';
import { EmailOptions } from '@@types/index.js';
import config from '@@utils/config.js';

const domain = '67766.activity-12.m.duiba.com.cn';
const emailConfig = config.email();
const cookie = config.get('cookie');
const token = config.get('token');

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
    user: emailConfig.user,
    pass: emailConfig.pass,
    from: domain,
    to: emailConfig.to,
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
    user: emailConfig.user,
    pass: emailConfig.pass,
    from: domain,
    to: emailConfig.to,
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