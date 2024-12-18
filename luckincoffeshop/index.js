import sendMail from '../sendMail';
import * as api from './api';

const [user, pass, emailTo, accessToken] = process.argv.slice(2);
const domain = 'mall-api.luckincoffeeshop.com' // 主站域名
process.env.user = user; // 邮箱账号
process.env.pass = pass; // 邮箱密码
process.env.accessToken = accessToken; // 用户 token

/**
 * 发送签到失败邮件
 * @param {Error} e 错误
 * @deprecated
 * @returns Promise<void>
 */
function sendFailMail(e) {
    const message = e.message;
    const html = `
  <p style="font-size: 16px; color: #f00;">签到失败：</p>
  <code>${message}</code>
  `;
    return sendMail({
        from: domain,
        to: emailTo,
        subject: '瑞幸即享自动签到',
        html
    }).then(() => {
        console.log('邮件发送成功')
    }).catch(e => {
        console.error(e, '邮件发送失败');
    })
}

/**
 * 发送签到、抽奖汇总邮件
 * @type {import('./api').IsendtotalEmail}
 */
function sendTotalEmail(data) {
    const html = data.reduce((t, item) => {
        return t + `
      <p style="font-size: 16px; color: ${item.result == 0 ? '#333' : '#f00'};">${item.type}${item.result == 0 ? '成功' : '失败'}：${item.msg}</p>
      `
    }, '')
    return sendMail({
        from: domain,
        to: emailTo,
        subject: '瑞幸即享自动签到抽奖',
        html
    }).then(() => {
        console.log('邮件发送成功')
    }).catch(e => {
        console.error(e, '邮件发送失败');
    })
}


function doCheckin() {
    return api.checkin({ domain, accessToken, }).then((data) => {
        console.log('[step 2] 签到成功', data);
        return {
            type: '每日签到',
            result: 0, // 0：成功 1：失败
            msg: data
        }
    }).catch((e) => {
        console.log('[step 2] 签到失败', e)
        return Promise.resolve({
            type: '每日签到',
            result: 1, // 0：成功 1：失败
            msg: e.message || JSON.stringify(e)
        })
    })
}

function doLottery() {
    return api.lottery({ domain, accessToken }).then((data) => {
        console.log('[step 2] 抽奖成功', data);
        return {
            type: '每日抽奖',
            result: 0, // 0：成功 1：失败
            msg: data
        }
    }).catch((e) => {
        console.log('[step 2] 抽奖失败', e)
        return Promise.resolve({
            type: '每日抽奖',
            result: 1, // 0：成功 1：失败
            msg: e.message || JSON.stringify(e)
        })
    })
}

/**
 * 开始执行
 */
function start() {
    console.log(`user=${user} pass=${pass} to=${emailTo} domain=${domain} accessToken=${accessToken}`)
    // 直接签到的逻辑
    // api.checkin({ domain, accessToken, }).then((data) => {
    //     console.log('[step 1] 签到成功');
    //     const html = `
    //   <p style="font-size: 16px; color: #333;">签到成功，${data}</p>
    //   `
    //     return sendMail({
    //         from: domain,
    //         to: emailTo,
    //         subject: '瑞幸即享自动签到',
    //         html
    //     }).then(() => {
    //         console.log('[step 2] 邮件发送成功')
    //     }).catch(e => {
    //         console.log('[step 2] 邮件发送失败', e);
    //     })
    // }).catch((e) => {
    //     console.log('[step 1] 签到失败', e);
    //     sendFailMail(e);
    // })

    api.getTaskList({ domain, accessToken, }).then((data) => {
        console.log('[step 1] 查询活动列表成功')
        const needCheckin = !!data.find(item => item.appTitle === '每日签到' && item.isOrNot === 2)
        const needDoLottery = !!data.find(item => item.appTitle === '每日抽奖' && item.isOrNot === 2)
        console.log(`[step 1] 每日签到：${needCheckin ? '需要' : '不需要'} 每日抽奖：${needDoLottery? '需要' : '不需要'}`)

        let result = []
        result.push(needCheckin ? doCheckin() : Promise.resolve({
            type: '每日签到',
            result: 0, // 0：成功 1：失败
            msg: '无需签到'
        }))
        result.push(needDoLottery ? doLottery() : Promise.resolve({
            type: '每日抽奖',
            result: 0, // 0：成功 1：失败
            msg: '无需抽奖'
        }))
        
        Promise.all(result).then(sendTotalEmail)
    })
}

start();
