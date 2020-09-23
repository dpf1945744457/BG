import request from '@/utils/request'

//export function getList(query) {
//return request({
//  url: '/comm/getList',
//  method: 'post',
//  data: query
//})
//}
export function getList(data) {
  return request({
    url: `/comm/getList/${data.pageNum}/${data.pageSize}`,
    method: 'get',
    params: data
  })
}

export function addComm(query) {
  return request({
    url: '/comm/addComm',
    method: 'post',
    data: query
  })
}
export function getAllList(query) {
  return request({
    url: '/company/getAllList',
    method: 'get'
  })
}
export function getDetail(query) {
  return request({
    url: '/comm/getDetail/' + query,
    method: 'get'
  })
}
export function editComm(query) {
  return request({
    url: '/comm/editComm',
    method: 'put',
    data: query
  })
}

