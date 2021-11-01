const fetch = require('node-fetch');
const sendMail = require('./sendMail');

const [user, pass, to, ...cookies] = process.argv.slice(2);
process.env.user = user;
process.env.pass = pass;
let score = 0;

let scoreMap = new Map();
let resultMap = new Map();

const saveScore = (key, score) => {
  if (key && typeof score !== 'undefined') {
    scoreMap.set(key, score)
  }
}

const getScore = (key, df) => {
  const v = scoreMap.get(key)
  if (df !== undefined) {
    return v !== undefined ? v : df
  }
  return v
}

const saveSuccessResult = (key, detail) => {
  if (key, detail) {
    resultMap.set(key, detail)
    const s = resultMap.get('_s') || []
    s.push(key)
    resultMap.set('_s', s)
  }
}

const saveFailReuslt = (key, detail) => {
  if (key, detail) {
    resultMap.set(key, detail)
    const f = resultMap.get('_f') || []
    f.push(key)
    resultMap.set('_f', f)
  }
}

const updateResultScore = (key, score) => {
  if (resultMap.has(key)) {
    const result = resultMap.get(key)
    result.score = score
    resultMap.set(key, result)
  }
}

const sendMails = () => {
  const failLen = (resultMap.get('_f') || []).length
  const successList = [...resultMap].filter(i => i && !['_f', '_s'].includes(i[0]))
  const toalMsg = failLen ? '部分签到成功！' : '全部签到成功！'

  const detail = !successList.length ?
  `
    <tr>暂无数据</tr>
  `
  :
  successList.reduce((str, item, index) => {
    const cookie = item[0];
    const { msg, score } = item[1];

    const getName = () => {
      if (cookie.length > 10) {
        return `${cookie.slice(0, 5)}*****${cookie.slice(-5)}`
      }
      return `账号${index + 1}`
    }

    const td = `
      <td>${getName()}</td>
      <td>${msg || '未知'}</td>
      <td>${score || 0}</td>
    `

    return str += td
  }, '<tr>\n') + '\n</tr>'

  const html = `
    <style>
      th {
        font-weight: 500;
      }
      td {
        border: 1px solid #ccc;
        min-width: 200px;
      }
    </style>
    <h1 style="text-align: center">自动签到通知</h1>
    <p style="text-indent: 2em">签到结果：${toalMsg}</p>
    <p style="text-indent: 2em">详细记录：</p>
    <table>
      <tr>
        <td>账号</td>
        <td>执行结果</td>
        <td>当前积分</td>
      </tr>
      ${detail}
    </table>
  `

  return sendMail({
    from: '掘金',
    to,
    subject: '定时任务',
    html
  });
}

const baseHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
  'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  referer: 'https://juejin.cn/',
  accept: '*/*'
};

// 抽奖
const drawFn = async (headers) => {
  // 查询今日是否有免费抽奖机会
  const today = await fetch('https://api.juejin.cn/growth_api/v1/lottery_config/get', {
    headers,
    method: 'GET',
    credentials: 'include'
  }).then((res) => res.json());

  if (today.err_no !== 0) return Promise.reject('已经签到！免费抽奖失败！');
  if (today.data.free_count === 0) return Promise.resolve('签到成功！今日已经免费抽奖！');

  // 免费抽奖
  const draw = await fetch('https://api.juejin.cn/growth_api/v1/lottery/draw', {
    headers,
    method: 'POST',
    credentials: 'include'
  }).then((res) => res.json());

  if (draw.err_no !== 0) return Promise.reject('已经签到！免费抽奖异常！');
  console.log(JSON.stringify(draw, null, 2));
  if (draw.data.lottery_type === 1) {
    const score = getScore(headers.cookie, 0) + 66
    saveScore(headers.cookie, score)
    // updateResultScore(headers.cookie, score)
  };
  return Promise.resolve(`签到成功！恭喜抽到：${draw.data.lottery_name}`);
};

// 对某一账号进行签到
function draw(cookie) {
  if (!cookie) { return Promise.resolve(); }
  const headers = { ...baseHeaders, cookie };
  // 签到
  return (async () => {
    // 查询今日是否已经签到
    const today_status = await fetch('https://api.juejin.cn/growth_api/v1/get_today_status', {
      headers,
      method: 'GET',
      credentials: 'include'
    }).then((res) => res.json());
  
    if (today_status.err_no !== 0) return Promise.reject('签到失败！');
    if (today_status.data) return Promise.resolve('今日已经签到！');
  
    // 签到
    const check_in = await fetch('https://api.juejin.cn/growth_api/v1/check_in', {
      headers,
      method: 'POST',
      credentials: 'include'
    }).then((res) => res.json());
  
    if (check_in.err_no !== 0) return Promise.reject('签到异常！');
    saveScore(cookie, check_in.data.sum_point);
    return Promise.resolve('签到成功！');
  })()
    .then((msg) => {
      console.log(msg);
      return fetch('https://api.juejin.cn/growth_api/v1/get_cur_point', {
        headers,
        method: 'GET',
        credentials: 'include'
      }).then((res) => res.json());
    })
    .then((res) => {
      console.log(res);
      saveScore(cookie, res.data);
      return drawFn(headers);
    })
    .then((msg) => {
      console.log(msg);
      saveSuccessResult(cookie, { msg, score: getScore(cookie, 0) })
    })
    .catch((err) => {
      saveFailReuslt(cookie, { msg: err, score: getScore(cookie, 0) })
    });

}

Promise.all(cookies.map(draw))
        .then(sendMails)
        .then(() => {
          console.log('邮件发送成功！');
        })
        .catch(console.error)
