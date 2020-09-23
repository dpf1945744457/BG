import request from '@/utils/request'

// 获取业主绑定房间信息
export function getOwnerRoom(query) {
    // debugger
    return request({
        url: '/owner-room',
        method: 'get',
        params: query
    })
}

// 业主房间绑定
export function getOwnerBinding(query) {
    return request({
        url: '/owner-room/binding',
        method: 'post',
        data: query
    })
}

// 业主房间解绑
export function unbunding(query) {
    return request({
        url: '/owner-room/unbundling',
        method: 'post',
        data: query
    })
}

// 获取楼栋分页列表
export function getPageList(data) {
    return request({
        url: `/building/page-no/${data.pageNo}/page-size/${data.pageSize}`,
        method: 'get',
        params: data
    })
}

// 获取楼栋信息
export function getDetailList(query) {
    return request({
        url: '/building/id/' + query,
        method: 'get'
    })
}
