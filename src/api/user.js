import request from '@/utils/request'
import request1 from '@/utils/request1'
export function loginByUsername(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {

  return request({
		url: '/user-role/userMenuList',
		method: 'get',
	})
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
