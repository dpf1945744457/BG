import request from '@/utils/request'
//export function getAuthCode(data) {
//return request({
//  url: '/auth/getCaptcha',
//  method: 'get',
//  params: data
//})
//}

export function userLogin(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: data
  })
}
