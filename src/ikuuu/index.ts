import { makeMailSender } from '../utils/sendMail.js';
import { runMachine } from '../utils/machine.js';
import { machine } from './machine.js';

const [user, pass, emailTo, domain, userName, passWord] = process.argv.slice(2);
process.env.user = user; // 邮箱账号
process.env.pass = pass; // 邮箱密码
process.env.domain = domain; // 主站域名
process.env.userName = userName; // 登录账号
process.env.passWord = passWord; // 登录密码

const mailSender = makeMailSender(domain, emailTo, 'ikuuu自动签到');

async function main(): Promise<void> {
  try {
    const actor = await runMachine(machine, {
      domain,
      userName,
      passWd: passWord,
      emailTo,
    })
    console.log('runMachine Done\n', actor.getSnapshot())
  } catch (e) {
    if (e instanceof Error) {
      await mailSender.sendFail(e.message);
    } else {
      await mailSender.sendFail('未知错误');
    }
  }
}

await main().catch(console.error);
