import Vue from 'vue'
import Router from 'vue-router'

import axios from 'axios'
import { Message } from 'element-ui'

// 图标模块
import Chart from '@/components/chart/chart.vue'

// 登录模块
// 账号密码登录
import Login from '@/components/login/login.vue'
// 电子邮箱登录
import EmailLogin from '@/components/login/email_login.vue'

// 注册模块
import Register from '@/components/register/register.vue'
// 找回密码功能
import RetrievePassword from '@/components/register/retrieve_password.vue'

// 版权页面
import Aplus from '@/components/aplus/aplus.vue'

// 主页框架
import Home from '@/components/home/home.vue'

// 管理员模块
// 成员列表
import Admin from '@/components/admin/admin.vue'
// 权限列表
import Authority from '@/components/admin/authority.vue'
// 角色列表
import Role from '@/components/admin/role.vue'

// 用户管理模块
import User from '@/components/user/user.vue'

// 食材管理模块
import Ingredient from '@/components/ingredient/ingredient.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'email_login',
      path: '/email_login',
      component: EmailLogin
    },
    {
      name: 'register',
      path: '/register',
      component: Register
    },
    {
      name: 'retrieve_password',
      path: '/retrieve_password',
      component: RetrievePassword
    },
    {
      name: 'aplus',
      path: '/aplus',
      component: Aplus
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      redirect: '/chart',
      children: [
        { name: 'chart', path: 'chart', component: Chart },
        { name: 'admin', path: 'admin', component: Admin },
        { name: 'role', path: 'role', component: Role },
        { name: 'authority', path: 'authority', component: Authority },
        { name: 'user', path: 'user', component: User },
        { name: 'ingredient', path: 'ingredient', component: Ingredient }
      ]
    }
  ]
})

// 1.判断是否登录
// 1.1已登录
// 1.2未登录
// 1.2.1判断是否记住密码
router.beforeEach((to, from, next) => {
  // 跳转登录页面
  if (to.path === '/login') {
    next()
  } else {
    // 跳转其他页面
    // 先判断是否登录
    axios({
      method: 'get',
      url: 'http://localhost:8181/admin/status_manage/login',
      withCredentials: true
    }).then(function(response) {
      if (response['data']['data']['username'] === 'None') {
        // 未登录，删除cookie，进入登录界面
        axios({
          method: 'delete',
          url: 'http://localhost:8181/admin/remember_password',
          withCredentials: true
        }).then(function(deleteCookie) {
          if (
            deleteCookie['data']['meta']['msg'] ===
            '用户的账号及密码的cookie已删除'
          ) {
            localStorage.removeItem('remember')
            if (
              to.path === '/login' ||
              to.path === '/email_login' ||
              to.path === '/register' ||
              to.path === '/retrieve_password' ||
              to.path === '/aplus'
            ) {
              next()
            } else {
              Message.warning('请登录')
              router.push({ name: 'login' })
            }
          }
        })
      } else {
        // 已登录，判断是否有权访问此页面
        for (
          var i = 0;
          i < response['data']['data']['properties'].length;
          i++
        ) {
          if (to.path === response['data']['data']['properties'][i]) {
            // 有权访问，跳转页面
            next()
            return
          }
        }
        router.push({ name: 'login' })
        Message.warning('您无权访问此页面')
      }
    })
  }
})
// this.$http.get('auth/modify_auth/' + role.role_id).then(response => {
//   // 已拥有的权限，即打勾的数组
//   this.properties = response.data.data.properties
//   // 所有权限的权限树
//   this.auth_tree = response.data.data.data_list
// })
export default router
