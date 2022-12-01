const fetch = require('node-fetch');

const baseURL = 'http://activity.95504.net';

/**
 * 签到
 * @returns 
 */
 function checkin({ activityId, userId, phone } = {}) {
  return new Promise((resolve, reject) => {
    console.log('开始签到')
    fetch(baseURL + '/admin-api/operation/user-signin/create', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        activityId: activityId,
        type: 1,
        userId: userId,
        phone: phone
      })
    })
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
          if (typeof res === 'object') {
            if (res.code == 1002000003) {
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
            res = JSON.parse(decodeURIComponent(res))
          } catch (e) {
            reject(res || e)
            return
          }
          if (res.code !== 1002000003) {
            resolve(res)
            return
          }
          if (res.code !== 0) {
            reject(new Error(res.msg || JSON.stringify(res)))
            return
          }
          resolve(res)
        })
        .catch((e) => {
          console.log('签到报错', e)
          reject(e)
        })
  })
}

/**
 * 签到记录
 * @returns 
 */
function checkinLogs({ activityId, userId, phone } = {}) {
  return new Promise((resolve, reject) => {
    console.log('查询签到记录')
    fetch(baseURL + '/admin-api/operation/user-signin-log/getUserSigninLogList?' + 
              'activityId=' + activityId + 
              '&userId=' + userId + 
              '&phone=' + phone,
              { headers: { }, method: 'GET' })
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
          if (typeof res === 'object') {
            if (res.code !== 0) {
              reject(new Error(res.msg || JSON.stringify(res)))
              return
            }
            resolve(res)
            return
          }
          try {
            res = JSON.parse(decodeURIComponent(res))
          } catch (e) {
            reject(res || e)
            return
          }
          if (res.code !== 0) {
            reject(new Error(res.msg || JSON.stringify(res)))
            return
          }
          resolve(res)
        })
        .catch((e) => {
          console.log('查询签到记录失败', e)
          reject(e)
        })

  })
}

/**
 * 签到并查询签到记录
 * @returns
 */
function checkinAndLogs({ activityId, userId, phone } = {}) {
  return checkin({ activityId, userId, phone }).then(function () {
    return checkinLogs({ activityId, userId, phone }).then((res) => {
      console.log('签到成功')
      return res
    })
  }).catch(function (e) {
    console.log('签到并查询签到记录失败 ', e)
    return Promise.reject(e)
  })
}

module.exports = {
  checkin,
  checkinLogs,
  checkinAndLogs
}
