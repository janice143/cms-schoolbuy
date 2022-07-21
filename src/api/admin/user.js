import request from '@/utils/request'

const api_name = '/admin/user/list'


/* 
获取后台用户分页列表(带搜索)
*/
export function getPageList(pageNo, pageSize, searchObj) {
  return request({
    url: `${api_name}/${pageNo}/${pageSize}`,
    method: 'get',
    params: searchObj
  })
}
// export const getPageList = (pageNo,pageSize) => request({ url: `${api_name}/${pageNo}/${pageSize}`, method: 'get' });


/* 
保存一个新的后台用户
*/
export function add(user) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: user
    })
  }
  
/* 
更新一个后台用户
*/
export function update(user) {
  return request({
    url: `${api_name}/update`,
    method: 'put',
    data: user
  })
}

// 删除一个用户
export function removeById(id){
  return request({
    url: `${api_name}/remove/${id}`,
    method: 'delete'
  })
}

// 批量删除多个用户.ids的结构: ids是包含n个id的数组
export function removeUsers(ids) {
return request({
  url: `${api_name}/batchRemove`,
  method: 'delete',
  data: ids
})
}

// 获取今日新增用户和全部用户数
export const reqpostUserCount = (dateToday)=>request.post('/user/count',dateToday)
