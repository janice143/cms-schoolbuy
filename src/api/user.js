import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'cms/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: 'cms/user/getInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: 'cms/user/logout',
    method: 'get'
  })
}
// 获取验证码
export function reqpostCaptchas() {
  return request({
    url: 'v1/captchas',
    method: 'post'
  })
}
