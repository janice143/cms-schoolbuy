//将四个模块请求的接口函数统一暴露

import * as product from './product/product';
//引入权限相关的接口文件
import * as adminUser from './admin/user';

//对外暴露
export default {
     product,
     adminUser
}