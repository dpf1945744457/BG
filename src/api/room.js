import request from '@/utils/request'

// 添加房间信息
export function addRoom(query) {
    return request({
        url: '/building-unit-room',
        method: 'post',
        data: query
    })
}

// 修改房间信息
export function editRoom(query) {
    return request({
        url: '/building-unit-room',
        method: 'put',
        data: query
    })
}

// 获取楼栋信息
export function getDetailRoom(query) {
    return request({
        url: '/building-unit-room/id/' + query,
        method: 'get'
    })
}

// 获取房间列表
export function getRoomList(query) {
    return request({
        url: `/building-unit-room/page-no/${query.pageNo}/page-size/${query.pageSize}`,
        method: 'get',
        params: query
    })
}

// 获取楼栋列表
export function getBuilList(query) {
    return request({
        url: '/building/select/list',
        method: 'get',
        params: query
    })
}

// 获取楼栋单元列表
export function getUnitList(query) {
    return request({
        url: '/building-unit/select/list',
        method: 'get',
        params: query
    })
}

