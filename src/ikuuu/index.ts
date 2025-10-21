import { makeMailSender } from '@@utils/sendMail.js';
import { runMachine } from '@@utils/machine.js';
import { machine } from './machine.js';
import config from '@@utils/config.js';

const emailConfig = config.email();
const domain = config.get('domain');
const userName = config.get('username');
const passWord = config.get('password');

const mailSender = makeMailSender(emailConfig.user, emailConfig.pass, domain, emailConfig.to, 'ikuuu自动签到');

async function main(): Promise<void> {
  try {
    const actor = await runMachine(machine, {
      domain,
      userName,
      passWd: passWord,
      emailTo: emailConfig.to,
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