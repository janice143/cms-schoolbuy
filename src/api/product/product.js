import request from '@/utils/request'

// 获取一级分类数据接口
export const reqgetCategory = () => request.get(`/category`);

// 获取全部的商品列表
export const reqgetProductList = (conditions)=> request.post('/productlist',conditions)

// 修改SPU||添加SPU：对于修改或者添加，携带给服务器参数大致一样的，唯一的区别就是携带的参数是否带id
export const reqAddOrUpdateSpu = (spuInfo) => {
  return request({ url: '/product/saveProduct', method: 'post', data: spuInfo });
}

// 获取商品的已有数据
export const reqSpu = (spuId) => request({ url: `/productdetail/${spuId}`, method: 'get' });

// 根据id删除商品
export const reqDeleteSpu = (spuObj)=>request({url:`/product/deleteProduct`,method:'delete', data: spuObj});

// 获取今日新增商品和全部商品数
export const reqpostProductCount = (dateToday)=>request.post('/product/count',dateToday)



// ///admin/product/deleteSpu/{spuId}

// //获取图片的数据
// ///admin/product/spuImageList/{spuId}  get
// export const reqSpuImageLIst = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'});


// //获取销售属性的数据
// ///admin/product/spuSaleAttrList/{spuId}  get
// export const reqSpuSaleAttrList = (spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'});


// //获取平台属性的数据
// //GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} 
// export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'});


// //添加SKU
// ///admin/product/saveSkuInfo  post
// export const reqAddSku = (skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo});


// //获取SKU列表数据的接口
// //GET /admin/product/findBySpuId/{spuId}  
// export const reqSkuList = (spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'});

