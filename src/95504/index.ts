import { checkin } from './api.js';
import sendMail from '../utils/sendMail.js';
import { EmailOptions } from '../types/index.js';

const activityOptions = {
  activityId: 48,
  userId: '1254064361',
  phone: '15827367591'
};

const emailOptions: EmailOptions = {
  to: '281910378@qq.com',
  from: '95504',
  subject: '',
  html: ''
};

const [user, pass] = process.argv.slice(2);
process.env.user = user;
process.env.pass = pass;

async function sendMails(res: any, isSuccess: boolean): Promise<void> {
  const html = isSuccess 
    ? `<p style="font-size: 16px; color: #333;">签到成功：${JSON.stringify(res)}</p>`
    : `<p style="font-size: 16px; color: #f00;">签到失败：${res.message}</p>`;

  await sendMail({
    ...emailOptions,
    subject: '95504自动签到',
    html
  });
}

async function main(): Promise<void> {
  try {
    const res = await checkin(activityOptions);
    await sendMails(res, true);
    console.log('签到成功邮件发送成功');
  } catch (e) {
    await sendMails({ message: e instanceof Error ? e.message : '未知错误' }, false);
    console.log('签到失败邮件发送成功');
  }
}

main().catch(console.error); 