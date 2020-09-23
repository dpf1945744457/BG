import request from '@/utils/request'

export function payfeeconfiglist(query) {
  return request({
    url: `/pay-fee-config/page-no/${query.pageNum}/page-size/${query.pageSize}`,
    method: 'get',
    params: query
  })
}

export function addpayfeeconfig(query) {
    return request({
      url: `/pay-fee-config`,
      method: query.method,
      data: query
    })
  }


  export function payfeeconfigid(query) {
    return request({
      url: `/pay-fee-config/id/${query.id}`,
      method: query.method,
      
    })
  } 


  