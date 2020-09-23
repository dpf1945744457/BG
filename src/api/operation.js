import request from '@/utils/request'



export function addOperateUser(data) {
	return request({
		url: '/operateUser/add',
		method: 'post',
		data
	})
}

export function getOperationList(data) {
	return request({
		url: `/operateUser/getList/${data.pageSize}/${data.pageNum}`,
		method: 'get',
		params: data
	})
}

export function editOperateUser(data) {
	return request({
		url: "/operateUser/edit",
		method: 'put',
		data
	})
}


export function getOperateUserDetail(id) {
  return request({
    url: `/operateUser/detail/${id}`,
    method: 'get'
  })
}