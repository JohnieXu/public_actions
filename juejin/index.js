import sendMail from "../utils/sendMail.js";
import * as api from "./api.js";

const [user, pass, to, ...cookies] = process.argv.slice(2);
process.env.user = user;
process.env.pass = pass;

let scoreMap = new Map();
let resultMap = new Map();
let dipMap = new Map();

const saveScore = (key, score) => {
  if (key && typeof score !== "undefined") {
    scoreMap.set(key, score);
  }
};

const getScore = (key, df) => {
  const v = scoreMap.get(key);
  if (df !== undefined) {
    return v !== undefined ? v : df;
  }
  return v;
};

const saveDip = (key, msg) => {
  if (key && typeof msg !== "undefined") {
    dipMap.set(key, msg);
  }
};

const getDip = (key, df) => {
  const v = dipMap.get(key);
  if (df !== undefined) {
    return v !== undefined ? v : df;
  }
  return v;
};

const saveSuccessResult = (key, detail) => {
  if ((key, detail)) {
    resultMap.set(key, detail);
    const s = resultMap.get("_s") || [];
    s.push(key);
    resultMap.set("_s", s);
  }
};

const saveFailReuslt = (key, detail) => {
  if ((key, detail)) {
    resultMap.set(key, detail);
    const f = resultMap.get("_f") || [];
    f.push(key);
    resultMap.set("_f", f);
  }
};

const updateResultScore = (key, score) => {
  if (resultMap.has(key)) {
    const result = resultMap.get(key);
    result.score = score;
    resultMap.set(key, result);
  }
};

const sendMails = () => {
  const failLen = (resultMap.get("_f") || []).length;
  const successList = [...resultMap].filter(
    (i) => i && !["_f", "_s"].includes(i[0]),
  );
  const toalMsg = failLen ? "部分签到成功！" : "全部签到成功！";

  const detail = !successList.length
    ? `
    <tr>暂无数据</tr>
  `
    : successList.reduce((str, item, index) => {
        const cookie = item[0];
        const { msg, score } = item[1];

        const getName = () => {
          if (cookie.length > 10) {
            return `${cookie.slice(0, 5)}*****${cookie.slice(-5)}`;
          }
          return `账号${index + 1}`;
        };

        const td = `
      <tr>
        <td>${getName()}</td>
        <td>${msg || "未知"}</td>
        <td>${score || 0}</td>
      </tr>
    `;

        return (str += td);
      }, "<tr>\n") + "\n</tr>";

  const style = `
    div, span, p, h1, h2, h3, h4, h5, h6, h7, h8, h9 {
      font-family: 'Ubuntu', 'Source Sans Pro', sans-serif !important;
      color: #34495e;
    }
    table {
      padding: 0;
      word-break: initial;
      border-collapse: collapse;
      border-spacing: 0px;
      width: 100%;
      overflow: auto;
      break-inside: auto;
      text-align: left;
    }
    table tr:nth-child(2n), thead {
      background-color: #fafafa;
    }
    thead {
      display: table-header-group;
    }
    table tr {
      border-top: 1px solid #dfe2e5;
      margin: 0;
      padding: 0;
    }
    table tr:nth-child(2n), thead {
      background-color: #fafafa;
    }
    tr {
      break-inside: avoid;
      break-after: auto;
    }
    table tr th:first-child, table tr td:first-child {
      margin-top: 0;
    }
    table tr th:last-child, table tr td:last-child {
      margin-bottom: 0;
    }
    table tr td {
      border: 1px solid #dfe2e5;
      text-align: left;
      margin: 0;
      padding: 6px 13px;
    }
    table thead th {
      background-color: #f2f2f2;
    }
    table tr th {
      font-weight: bold;
      border: 1px solid #dfe2e5;
      border-bottom: 0;
      text-align: left;
      margin: 0;
      padding: 6px 13px;
    }
  `;

  const html = `
    <style type="text/css">${style}</style>
    <h1 style="text-align: center">自动签到通知</h1>
    <p style="text-indent: 2em">签到结果：${toalMsg}</p>
    <p style="text-indent: 2em">详细记录：</p>
    <div style="width: 100%; padding: 0 2em; box-sizing: border-box;">
      <table>
        <thead>
          <tr>
            <th>账号</th>
            <th>执行结果</th>
            <th>当前积分</th>
          </tr>
        </thead>
        <tbody>
        
        </tbody>
        ${detail}
      </table>
    </div>
  `;

  return sendMail({
    from: "掘金",
    to,
    subject: "定时任务",
    html,
  });
};

// 抽奖
const drawFn = async (headers) => {
  // 查询今日是否有免费抽奖机会
  const today = await api.todayFreeCount({ headers });

  if (today.err_no !== 0) return Promise.reject("已经签到！免费抽奖失败！");
  if (today.data.free_count === 0)
    return Promise.resolve("签到成功！今日已经免费抽奖！");

  // 免费抽奖
  const draw = await api.draw({ headers });

  if (draw.err_no !== 0) return Promise.reject("已经签到！免费抽奖异常！");
  console.log(JSON.stringify(draw, null, 2));
  if (draw.data.lottery_type === 1) {
    const score = getScore(headers.cookie, 0) + 66;
    saveScore(headers.cookie, score);
    // updateResultScore(headers.cookie, score)
  }
  return Promise.resolve(`签到成功！恭喜抽到：${draw.data.lottery_name}`);
};

// 对某一账号进行签到
function draw(cookie) {
  if (!cookie) {
    return Promise.resolve();
  }
  const headers = { cookie };
  // 签到
  return (
    (async () => {
      // 查询今日是否已经签到
      const today_status = await api.todayStatus({ headers });
      console.log("\n今日签到状态查询结果", today_status);

      if (today_status.err_no !== 0) return Promise.reject("签到失败！");
      if (today_status.data) return Promise.resolve("今日已经签到！");

      // 签到
      const check_in = await api.checkin({ headers });
      console.log("签到结果", api.checkin);

      if (check_in.err_no !== 0) return Promise.reject("签到异常！");
      saveScore(cookie, check_in.data.sum_point);
      return Promise.resolve("签到成功！");
    })()
      // .then((msg) => {
      //   console.log(msg);
      //   console.log("开始沾喜气...");
      //   return api.dipLucky(headers).then((msg) => {
      //     saveDip(cookie, msg); // 保存沾喜气结果
      //     return msg;
      //   });
      // })
      .then((msg) => {
        console.log(msg);
        return api.getCurPoint({ headers });
      })
      .then((res) => {
        console.log(res);
        saveScore(cookie, res.data);
        return drawFn(headers);
      })
      .then((msg) => {
        console.log(msg);
        const dipMsg = getDip(cookie, "");
        msg += dipMsg;
        saveSuccessResult(cookie, { msg, score: getScore(cookie, 0) });
      })
      .catch((err) => {
        saveFailReuslt(cookie, { msg: err, score: getScore(cookie, 0) });
      })
  );
}

Promise.all(cookies.map(draw))
  .then(sendMails)
  .then(() => {
    console.log("邮件发送成功！");
  })
  .catch((e) => {
    console.error("邮件发送失败！\n", e);
  });
