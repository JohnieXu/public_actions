import sendMail from '@@utils/sendMail.js';
import * as api from './api.js';
import { CheckinResult } from '@@types/index.js';

const [user, pass, to, ...cookies] = process.argv.slice(2);
process.env.user = user;
process.env.pass = pass;

const scoreMap = new Map<string, number>();
const resultMap = new Map<string, any>();
const dipMap = new Map<string, string>();

// ... 其他辅助函数保持不变，只需添加类型

async function draw(cookie: string): Promise<void> {
  if (!cookie) return;
  
  const headers = { cookie };
  try {
    const todayStatus = await api.todayStatus({ headers });
    if (todayStatus.err_no !== 0) throw new Error('签到失败！');
    if (todayStatus.data) return;

    const checkIn = await api.checkin({ headers });
    if (checkIn.err_no !== 0) throw new Error('签到异常！');
    
    scoreMap.set(cookie, checkIn.data.sum_point);

    const curPoint = await api.getCurPoint({ headers });
    scoreMap.set(cookie, curPoint.data);

    const drawResult = await api.draw({ headers });
    const msg = `签到成功！${drawResult.data.lottery_name}`;
    
    saveSuccessResult(cookie, { 
      msg,
      score: scoreMap.get(cookie) || 0 
    });
  } catch (err) {
    saveFailReuslt(cookie, { 
      msg: err instanceof Error ? err.message : '未知错误',
      score: scoreMap.get(cookie) || 0
    });
  }
}

// ... 其他逻辑保持不变 

function saveSuccessResult(cookie: string, detail: { msg: string; score: number }): void {
  if (cookie && detail) {
    resultMap.set(cookie, detail);
    const s = resultMap.get('_s') || [];
    s.push(cookie);
    resultMap.set('_s', s);
  }
}

function saveFailReuslt(cookie: string, detail: { msg: string; score: number }): void {
  if (cookie && detail) {
    resultMap.set(cookie, detail);
    const f = resultMap.get('_f') || [];
    f.push(cookie);
    resultMap.set('_f', f);
  }
} 