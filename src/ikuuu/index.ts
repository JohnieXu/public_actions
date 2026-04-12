import { makeMailSender } from '@@utils/sendMail.js';
import { runMachine } from '@@utils/machine.js';
import { machine } from './machine.js';
import { tokenMachine } from './tokenMachine.js';
import config from '@@utils/config.js';

const emailConfig = config.email();
const domain = config.get('domain');
const authMethod = config.get('ikuuuAuthMethod') || 'username_password'; // 默认使用用户名密码方式

// 优先级：Token方式 > 用户名密码方式
// 当使用Token方式时，只需要配置domain和cookie
// 当使用用户名密码方式时，需要配置domain、username和password

async function main(): Promise<void> {
  try {
    const mailSender = makeMailSender(
      emailConfig.user,
      emailConfig.pass,
      domain,
      emailConfig.to,
      `ikuuu自动签到(${authMethod === 'token' ? 'Token' : '用户名密码'})方式`
    );

    let actor;

    if (authMethod === 'token') {
      // Token 认证方式
      const cookie = process.env.PUBA_IKUUU_COOKIE || config.get('cookie');
      if (!cookie) {
        throw new Error('Token 方式需要配置 cookie，请通过 PUBA_IKUUU_COOKIE 环境变量或配置文件设置');
      }

      actor = await runMachine(tokenMachine, {
        domain,
        cookie,
        emailTo: emailConfig.to,
      });
    } else {
      // 用户名密码认证方式（默认）
      const userName = config.get('username');
      const passWord = config.get('password');

      if (!userName || !passWord) {
        throw new Error('用户名密码方式需要配置 username 和 password');
      }

      actor = await runMachine(machine, {
        domain,
        userName,
        passWd: passWord,
        emailTo: emailConfig.to,
      });
    }

    console.log('runMachine Done\n', actor.getSnapshot())
  } catch (e) {
    if (e instanceof Error) {
      // 创建邮件发送器用于失败通知
      const mailSender = makeMailSender(
        emailConfig.user,
        emailConfig.pass,
        domain,
        emailConfig.to,
        `ikuuu自动签到(${authMethod === 'token' ? 'Token' : '用户名密码'})方式`
      );
      await mailSender.sendFail(e.message);
    } else {
      const mailSender = makeMailSender(
        emailConfig.user,
        emailConfig.pass,
        domain,
        emailConfig.to,
        `ikuuu自动签到(${authMethod === 'token' ? 'Token' : '用户名密码'})方式`
      );
      await mailSender.sendFail('未知错误');
    }
  }
}

await main().catch(console.error);