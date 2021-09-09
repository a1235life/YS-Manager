// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// MyBread其实是组件选项所在的对象
import MyBread from '@/components/custom/breadcrumb.vue'
import MyServerHttp from '@/plugins/http.js'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import VueParticles from 'vue-particles'
import moment from 'moment'

Vue.use(VueParticles)
Vue.use(ElementUI)
Vue.use(MyServerHttp)
Vue.config.productionTip = false

// 全局过滤器 - 处理日期
Vue.filter('fmtdate', v => {
  return moment(v).format('YYYY-MM-DD')
})

// 全局自定义组件
Vue.component(MyBread.name, MyBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
