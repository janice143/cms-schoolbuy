import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
//路由模块当中重置路由的方法
import { anyRoutes, resetRouter,asyncRoutes,constantRoutes,constant2Routes} from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    isAdmin: false,
    resultAsyncRoutes:[]

  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.username = name
  },
  SET_ISADMIN: (state, isAdmin) => {
    state.isAdmin = isAdmin
  },
  //最终计算出的异步路由
  SET_RESULTASYNCROUTES:(state,asyncRoutes)=>{
    //vuex保存当前用户的异步路由，注意，一个用户需要展示完成路由：常量、异步、任意路由
    state.resultAsyncRoutes = asyncRoutes;
    // console.log(asyncRoutes,constantRoutes)
    //计算出当前用户需要展示所有路由
    state.resultAllRputes = constantRoutes.concat(state.resultAsyncRoutes,constant2Routes,anyRoutes);
    console.log(state.resultAllRputes)
    //给路由器添加新的路由
     router.addRoutes(state.resultAllRputes)
 }
}

//定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes,routes)=>{
  // console.log(routes,asyncRoutes)
  //过滤出当前用户【超级管理|普通员工】需要展示的异步路由
 return asyncRoutes.filter(item=>{
      //数组当中没有这个元素返回索引值-1，如果有这个元素返回的索引值一定不是-1 

     if(routes.includes(item.name)){
       //递归:别忘记还有2、3、4、5、6级路由
       if(item.children && item.children.length){
           item.children = computedAsyncRoutes(item.children,routes);
       }
       return true;
     }
  })
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password,codeNumber } = userInfo
    const res = await login({ username: username.trim(), password: password, codeNumber: codeNumber })
    
    if (res.code === 200){
      commit('SET_TOKEN', res.data.token)
      setToken(res.data.token)
      return 'OK'
    } else{
      return Promise.reject(new Error('failed'))
    }
  },

  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        // data包含的信息:username, routes(路由名字的数组),role(角色，是user还是admin)
        const { username,admin } = data
        // console.log(data)
        commit('SET_NAME', username)
        commit('SET_ISADMIN', admin)
        
        // console.log(computedAsyncRoutes(cloneDeep(asyncRoutes),data.routes))
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(cloneDeep(asyncRoutes),data.routes));

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

