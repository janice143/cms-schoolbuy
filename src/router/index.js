import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/product',
    component: Layout,
    name: 'Product',
    
    children: [  
      {
        path: 'spu',
        component: () => import('@/views/product/spu/index'),
        name: 'Spu',
        meta: {
          title: '商品管理',
          icon: 'el-icon-goods'
        },
      }     
    ]
  }
 
]

export const constant2Routes = [
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'http://101.34.27.188:8080/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  }
]

//异步理由:不同的用户（角色），需要过滤筛选出的路由，称之为异步路由
//有的用户可以看见测试管理、有的看不见
export const asyncRoutes = [
  
  // 超级管理员有用户管理的权限
  {
    path: '/user',
    component: Layout,
    // redirect: '/product/trademark',
    name: 'User',
    children: [  
      {
        path: 'list',
        component: () => import('@/views/admin/user/index'),
        name: 'List',
        meta: {
          title: '用户管理',
          icon: 'el-icon-s-custom'
        },
      }     
    ]
  },
  {
    path: '/charts',
    component: Layout,
    meta: {
      title: '图表',
      icon: 'el-icon-s-grid'
    },
    name: 'Charts',
    children: [  
      {
        path: '/place',
        component: () => import('@/views/charts/place'),
        name: 'Place',
        meta: {
          title: '用户分布',
          icon: 'el-icon-star-on'
        },
      },
      {
        path: '/number',
        name: 'Number',
        component: () => import('@/views/charts/number'),
        // component: () => import('@/views/dashboard/index'),
        meta: { title: '数据统计', icon: 'el-icon-finished' }
      }
         
    ]
  }

]
//任意路由：当路径出现错误的时候重定向404
export const anyRoutes ={ path: '*', redirect: '/404', hidden: true };


const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
