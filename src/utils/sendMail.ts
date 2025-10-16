import nodemailer from 'nodemailer';
import template from 'art-template';
import fs from 'node:fs';
import { EmailOptions } from '@@types/index.js';
import path from 'node:path';
import { cwd } from 'node:process';

export type JsonString = string

export interface MailTplData {
  _status: 'success' | 'fail'
  title: string
  status: string
  description: string
  jsonData: JsonString
  createdAt: string
}

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
    return this.send(this.genTplRenderer()(this.genRenderData(message, true)))
  }
  async sendFail(message: string): Promise<void> {
    return this.send(this.genTplRenderer()(this.genRenderData(message, false)))
  }
  private genTplRenderer() {
    return template.compile(fs.readFileSync(path.join(cwd(), 'config/mail.tpl'), { encoding: 'utf-8' }))
  }
  private genRenderData(message: string, success: boolean): MailTplData {
    return {
      title: this.subject + '执行结果',
      _status: success ? 'success' : 'fail',
      status: success ? '执行成功' : '执行失败',
      description: this.subject,
      jsonData: message,
      createdAt: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    }
  }
}

export function makeMailSender(domain: string, to: string, subject: string) {
  return new MailSender(domain, to, subject);
}

/**
 * the old email content wrapper for success
 * @deprecated
 * @param message 
 * @returns 
 */
export function successWrapper(message: string) {
  return `
  <p style="font-size: 16px; color: #333;">签到成功：</p>
  <code>${message}</code>
  `;
}

/**
 * the old email content wrapper for fail
 * @deprecated
 * @param message 
 * @returns 
 */
export function failWrapper(message: string) {
  return `
  <p style="font-size: 16px; color: #f00;">签到失败：</p>
  <code>${message}</code>
  `;
}

export default sendMail; 