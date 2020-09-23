import request from '@/utils/request'

export function getcommontype(type) {
  return request({
    url: `/common/code/type/${type.type}`,
    method: 'get'
  
  })
}

