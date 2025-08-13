import fetch from 'node-fetch';
import { CheckinParams, CheckinResponse } from '../types/95504.js';

const baseURL = 'http://activity.95504.net';

/**
 * 签到
 */
export function checkin(params: CheckinParams): Promise<CheckinResponse> {
  return new Promise((resolve, reject) => {
    console.log('开始签到')
    fetch(baseURL + '/admin-api/operation/user-signin/create', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        activityId: params.activityId,
        type: 1,
        userId: params.userId,
        phone: params.phone
      })
    })
    .then(res => res.json() as Promise<CheckinResponse>)
    .then((res: CheckinResponse) => {
      console.log(res)
      if (typeof res === 'object') {
        if (res.code === 1002000003) {
          resolve(res)
          return
        }
        if (res.code !== 0) {
          reject(new Error(res.msg || JSON.stringify(res)))
          return
        }
        resolve(res)
        return
      }
      try {
        const parsedRes = JSON.parse(decodeURIComponent(res as unknown as string))
        if (parsedRes.code === 1002000003) {
          resolve(parsedRes)
          return
        }
        if (parsedRes.code !== 0) {
          reject(new Error(parsedRes.msg || JSON.stringify(parsedRes)))
          return
        }
        resolve(parsedRes)
      } catch (e) {
        reject(res || e)
      }
    })
    .catch((e) => {
      console.log('签到报错', e)
      reject(e)
    })
  })
} 