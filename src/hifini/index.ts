import { runMachine } from '../utils/machine.js';
import { makeMailSender } from '../utils/sendMail.js';
import { machine } from './machine.js';

// 定义静态变量 测试用
// const domain = 'hifiki.com'; // hifini.com has changed to hifiki.com
// const cookie = 'bbs_sid=qf95q4qkg12072pjevoe0eherv; bbs_token=xv35IdlO8Pac_2Bq4_2FfZsOrC4fMG9ABxozb5hrM_2B0toXnf4P1QFUcIXy5YWj1uVfciM0v0ZyxX14tMNiXfoiokrbqf_2FaZrYL1m';
// const emailTo = '281910378@qq.com';

const [user, pass, emailTo, cookie, domain] = process.argv.slice(2)
process.env.user = user; // 邮箱账号
process.env.pass = pass; // 邮箱密码
process.env.cookie = cookie
process.env.emailTo = emailTo
process.env.domain = domain

const mailSender = makeMailSender(domain, emailTo, 'hifiki自动签到');

async function main(): Promise<void> {
  try {
    const actor = await runMachine(machine, {
      domain,
      cookie,
      emailTo,
    })
    console.log('runMachine Done\n', actor.getSnapshot())
  } catch (e) {
    if (e instanceof Error) {
      await mailSender.sendFail(e.message);
    } else {
      await mailSender.sendFail("未知错误");
    }
  }
}

await main().catch(console.error); 
