import request from '@/utils/request'

// 新增楼栋详情
export function addBuilding(data) {
    return request({
        url: '/building',
        method: 'post',
        data: data
    })
}

// 更细楼栋详情
export function editBuilding(data) {
    return request({
        url: '/building',
        method: 'put',
        data
    })
}

// 获取楼栋详情
export function getDetailBuilding(id) {
    return request({
        url: `/building/id/${id}`,
        method: 'get'
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

// 获取楼栋列表
export function getBuildingList(query) {
    return request({
        url: '/building/select/list',
        method: 'get',
        params: query
    })
}
