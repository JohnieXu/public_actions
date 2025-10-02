import sendMail from '../utils/sendMail.js';
import { EmailOptions } from '../types/index.js';
import { runMachine } from '../utils/machine.js';
import { machine } from './machine.js';

const [user, pass, emailTo, domain, userName, passWord] = process.argv.slice(2);
process.env.user = user; // 邮箱账号
process.env.pass = pass; // 邮箱密码
process.env.domain = domain; // 主站域名
process.env.userName = userName; // 登录账号
process.env.passWord = passWord; // 登录密码

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
    subject: 'ikuuu自动签到',
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
    subject: 'ikuuu自动签到',
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
    await runMachine(machine, {
      domain,
      userName,
      passWd: passWord,
      emailTo,
    })
  } catch (e) {
    if (e instanceof Error) {
      await sendFailMail(e);
    } else {
      await sendFailMail(new Error('未知错误'));
    }
  }
}

await main().catch(console.error);
