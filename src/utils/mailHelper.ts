import { EmailOptions } from '../types/index.js';
import sendMail from './sendMail.js';

export class MailHelper {
  private domain: string;
  private to: string;
  private subject: string;

  constructor(domain: string, to: string, subject: string) {
    this.domain = domain;
    this.to = to;
    this.subject = subject;
  }

  async sendSuccessMail(message: string): Promise<void> {
    const html = `
    <p style="font-size: 16px; color: #333;">签到成功：</p>
    <code>${message}</code>
    `;

    await this.send(html);
  }

  async sendFailMail(error: Error): Promise<void> {
    const html = `
    <p style="font-size: 16px; color: #f00;">签到失败：</p>
    <code>${error.message}</code>
    `;

    await this.send(html);
  }

  private async send(html: string): Promise<void> {
    const emailOptions: EmailOptions = {
      from: this.domain,
      to: this.to,
      subject: this.subject,
      html
    };

    try {
      await sendMail(emailOptions);
      console.log('邮件发送成功');
    } catch (e) {
      console.error(e, '邮件发送失败');
    }
  }
} 