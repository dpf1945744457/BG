import request from '@/utils/request'

// 添加业主信息
export function addowner(query) {
    return request({
        url: '/owner',
        method: 'post',
        data: query
    })
}

// 修改业主信息
export function editowner(query) {
    return request({
        url: '/owner',
        method: 'put',
        data: query
    })
}

// 获取业主信息
export function getDetailowner(query) {
    return request({
        url: '/owner/id/' + query,
        method: 'get'
    })
}

// 获取业主列表
export function getOwnerList(query) {
    return request({
        url: `/owner/page-no/${query.pageNo}/page-size/${query.pageSize}`,
        method: 'get',
        params: query
    })
}
