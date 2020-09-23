import request from '@/utils/request'

// 获取通用码表列表
export function getCommonList(query) {
    return request({
        url: '/common/code/type/' + query.type,
        method: 'get'
    })
}

// 获取单位列表
export function getMeteringList(query) {
    return request({
        url: '/common/units/list',
        method: 'get',
        data: query
    })
}

