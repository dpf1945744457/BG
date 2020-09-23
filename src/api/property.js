import request from '@/utils/request'

// 获取物业公司列表
export function getCompanyList(data) {
  return request({
    url: `/company/getCompanyList/${data.pageNum}/${data.pageSize}`,
    method: 'get',
    params: data
  })
}

// 添加物业公司
export function addPropertyCompany(data) {
  return request({
    url: '/company/addCompany',
    method: 'post',
    data
  })
}

// 获取物业公司信息
export function getPropertyDetail(id) {
  return request({
    url: `/company/getDetail/${id}`,
    method: 'get'
  })
}

// 编辑物业公司信息
export function editPropertyCompany(data) {
  return request({
    url: '/company/editCompany',
    method: 'put',
    data
  })
}

// 获取物业公司列表筛选条件
export function getAllPropertyCompany() {
  return request({
    url: '/company/getAllList',
    method: 'get'
  })
}

// 通过物业公司ID获取小区列表下拉框
export function getCommunityListByCompanyId(id) {
  return request({
    url: `/comm/getListByCompanyId/${id}`,
    method: 'get'
  })
}
