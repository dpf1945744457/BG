import request from '@/utils/request'

// 获取业主信息
export function grtOwnerMember(query) {
    return request({
        url: '/owner-member',
        method: 'get',
        data: query
    })
}

// 添加业主成员
export function addOwnerMember(query) {
    return request({
        url: '/owner-member',
        method: 'post',
        data: query
    })
}

// 修改业主成员
export function editOwnerMember(query) {
    return request({
        url: '/owner-member',
        method: 'put',
        data: query
    })
}

// 删除业主成员
export function deleteOwnerMember(query) {
    return request({
        rul: 'owner-member/id/' + query,
        method: 'delete'
    })
}
