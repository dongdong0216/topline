import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入公共样式
import '@/assets/css/global.css'
// 引入第三方组件库
import ElementUI from 'element-ui'
// 引入axios
import axios from 'axios'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 注册组件库
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
