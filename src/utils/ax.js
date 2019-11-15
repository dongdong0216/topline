// 引入Vue
import Vue from 'vue'

// 引入axios
import axios from 'axios'

// 导入路由模块对象
import router from '@/router/index.js'

// 引入json-bigint模块
import JSONbig from 'json-bigint'

// 配置请求根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// A.请求拦截器
axios.interceptors.request.use(function (config) {
  // 给axios配置token信息
  // config=====axios.defaults相当
  // userinfo=String或 null，系统中并是是始终有userinfo信息的，需要获取判断使用
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (userinfo) {
    config.headers.Authorization = 'Bearer ' + JSON.parse(userinfo).token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// B.响应拦截器
axios.interceptors.response.use(function (response) {
  // 成功请求回来了
  return response
}, function (error) {
  // 失败请求回来(401在此)
  // console.dir(error) // 错误对象
  if (error.response.status === 401) {
    // token失效，强制用户登录
    // 路由对象.push('/login')  路由编程式导航
    // 路由对象：组件中this.$router
    //          入口文件处
    router.push('/login')
  }
  return Promise.reject(error)
})

// C.数据转换器(接收服务器端返回的第一手的"字符串"类型的响应数据)
axios.defaults.transformResponse = function (data) {
  // data就是回来的数据
  // console.log(typeof data) // string
  // 服务器端返回的数据信息是字符串，有两种格式：
  // 1. '{x:y,x:y}'  非空的字符串
  // 2. ''  空字符串
  if (data) {
    return JSONbig.parse(data)
  } else {
    return data
  }
}
// 把axios通过原型继承方式配置给Vue成员，名称为$http(自定义的)，以后其他组件
// 就可以通过  this.$http  的方法获得axios对象了
Vue.prototype.$http = axios
