import nodemailer from 'nodemailer';
import { EmailOptions } from '../types/index.js';

export async function sendMail(data: EmailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.user,
      pass: process.env.pass
    }
  });

  data.from = `"${data.from}" ${process.env.user}`;
  await transporter.sendMail(data);
}

export class MailSender {
  domain: string;
  to: string;
  subject: string;
  constructor(domain: string, to: string, subject: string) {
    this.domain = domain;
    this.to = to;
    this.subject = subject;
  }
  async send(content: string): Promise<void> {
    return sendMail({
      from: this.domain,
      to: this.to,
      subject: this.subject,
      html: content
    });
  }
  async sendSuccess(message: string): Promise<void> {
    return this.send(successWrapper(message));
  }
  async sendFail(message: string): Promise<void> {
    return this.send(failWrapper(message));
  }
}

export function makeMailSender(domain: string, to: string, subject: string) {
  return new MailSender(domain, to, subject);
}

export function successWrapper(message: string) {
  return `
  <p style="font-size: 16px; color: #333;">签到成功：</p>
  <code>${message}</code>
  `;
}

export function failWrapper(message: string) {
  return `
  <p style="font-size: 16px; color: #f00;">签到失败：</p>
  <code>${message}</code>
  `;
}

export default sendMail; 