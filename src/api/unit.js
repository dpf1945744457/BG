import request from '@/utils/request'

// 保存楼栋单元信息
export function addUnit(query) {
    return request({
        url: '/building-unit',
        method: 'post',
        data: query
    })
}

// 修改楼栋信息
export function editUnit(query) {
    return request({
        url: '/building-unit',
        method: 'put',
        data: query
    })
}

// 获取楼栋详情
export function getDetailUnit(query) {
    return request({
        url: '/building-unit/id/' + query,
        method: 'get'
    })
}

// 楼栋列表
export function getbuilding(query) {
    return request({
        url: `/building-unit/page-no/${query.pageNo}/page-size/${query.pageSize}`,
        method: 'get',
        params: query
    })
}

// 获取楼栋单元列表
export function getBuilUnitList(query) {
    return request({
        url: '/building/select/list',
        method: 'get',
        params: query
    })
}
