import request from '@/utils/request'



export function addEquipment(data) {
	return request({
		url: '/commMac/add',
		method: 'post',
		data
	})
}

export function getEquipmentList(data) {
	return request({
		url: `/commMac/getList/${data.pageNum}/${data.pageSize}`,
		method: 'get',
		params: data
	})
}

export function editEquipment(data) {
	return request({
		url: "/commMac/edit",
		method: 'put',
		data
	})
}


export function getEquipmentDetail(id) {
  return request({
    url: `/commMac/detail/${id}`,
    method: 'get'
  })
}
