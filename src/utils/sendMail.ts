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

export default sendMail; 