/**
 * 根据 html 模板发送邮件
 * QQ邮箱授权码说明：https://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256
 */
import fs from 'fs'
import path from 'path'
import { render as tpl } from 'art-template'
import sendMail from '../utils/sendMail.js';

const [user, pass, to] = process.argv.slice(2);
process.env.user = user;
process.env.pass = pass;

const statisticsImg = 'data:image/png;base64,' + fs.readFileSync(path.resolve(__dirname, '../assets/statistics.jpg'), 'base64');

const template = fs.readFileSync(path.resolve(__dirname, '../assets/email_template.html'), 'utf-8');
const data = {
  addPerson: 100,
  totalPerson: 5000,
  createOrderPerson: 80,
  createOrderNum: 80,
  createOrderAmount: 80,
  createOrderMoney: 4000,

  refundOrderMoney: 50,
  payPerson: 80,
  payOrderNum: 80,
  payOrderAmount: 80,
  payOrderMoney: 4000,
  perCustomerTransaction: 50,

  c2bOrder: 2000,
  icbcOrder: 100,
  bjIcbcOrder: 90,
  sxIcbcOrder: 80,
  szIcbcOrder: 70,
  totalOrder: 2000 + 100 + 90 + 80 + 70,

  statisticsImg
}

const html = tpl(template, data);

sendMail({
  from: 'C2B',
  to,
  subject: '定时任务',
  html
}).then(() => {
  console.log('邮件发送成功');
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
