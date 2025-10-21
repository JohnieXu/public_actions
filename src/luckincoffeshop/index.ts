import sendMail from '@@utils/sendMail.js';
import * as api from './api.js';
import { EmailOptions } from '@@types/index.js';
import config from '@@utils/config.js';

const domain = 'mall-api.luckincoffeeshop.com'; // 主站域名

const emailConfig = config.email();
const accessToken = config.get('accessToken');

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
    user: emailConfig.user,
    pass: emailConfig.pass,
    from: domain,
    to: emailConfig.to,
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
