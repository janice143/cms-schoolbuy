import request from '@/utils/request'

// 获取用户分布的饼图数据
export const reqgetUserPlace = () => request.get(`admin/user/place`);


