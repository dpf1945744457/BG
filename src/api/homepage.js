import request from '@/utils/request'

export function getList(query) {
  return request({
    url: `/launchPage/getList/${query.pageNum}/${query.pageSize}`,
    method: 'get'
   
  })
}
export function launchPageadd(query) {
    return request({
      url: `/launchPage/add`,
      method: 'POST',
      data:query
    })
  }

  export function launchPageedit(query) {
    return request({
      url: `/launchPage/edit`,
      method: 'put',
      data:query
    })
  }

  export function launchPagedel(id) {
    return request({
      url: `/launchPage/del/${id}`,
      method: 'delete'
    })
  }
  
