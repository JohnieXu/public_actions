import sendMail from '../utils/sendMail.js';
import * as api from './api.js';
import { EmailOptions } from '../types/index.js';

const [user, pass, emailTo, accessToken] = process.argv.slice(2);
const domain = 'mall-api.luckincoffeeshop.com'; // 主站域名

process.env.user = user; // 邮箱账号
process.env.pass = pass; // 邮箱密码
process.env.accessToken = accessToken; // 用户 token

/**
 * 发送签到失败邮件
 * @deprecated
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
    subject: '瑞幸即享自动签到',
    html
  };

  try {
    await sendMail(emailOptions);
    console.log('邮件发送成功');
  } catch (e) {
    console.error(e, '邮件发送失败');
  }
}

// 其他业务逻辑... 