<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple" align="left">
            <img src="../../assets/logo.png" alt="无法显示图片" />
          </div>
        </el-col>
        <el-col :span="18" class="title">
          <h1>益食空间</h1>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a class="logout" href="#" @click="deleteSession()">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <el-aside class="aside" width="230px" align="left">
        <el-menu :router="true">
          <!-- 首页 -->
          <el-menu-item index="chart">
            <i class="el-icon-data-line"></i>
            <span>数据统计</span>
          </el-menu-item>
          <!-- 0 -->
          <el-submenu index="0">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span>管理员</span>
            </template>
            <el-menu-item index="admin">
              <i class="el-icon-menu"></i>
              <span>成员列表</span>
            </el-menu-item>
            <el-menu-item index="role">
              <i class="el-icon-tickets"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="authority">
              <i class="el-icon-s-order"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 1 -->
          <el-menu-item index="user">
            <i class="el-icon-user"></i>
            <span>用户管理</span>
          </el-menu-item>
          <!-- 2 -->
          <el-menu-item index="ingredient">
            <i class="el-icon-dish-1"></i>
            <span>食材管理</span>
          </el-menu-item>
          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-chicken"></i>
              <span>食材管理</span>
            </template>
            <el-menu-item index="ingredient">
              <i class="el-icon-menu"></i>
              <span>食材列表</span>
            </el-menu-item>
            <el-menu-item index="classify">
              <i class="el-icon-dish-1"></i>
              <span>食材分类</span>
            </el-menu-item>
          </el-submenu> -->
          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-notebook-2"></i>
              <span>文章管理</span>
            </template>
            <el-menu-item index="write">
              <i class="el-icon-edit-outline"></i>
              <span>创建文章</span>
            </el-menu-item>
            <el-menu-item index="article">
              <i class="el-icon-document"></i>
              <span>文章列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main"><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  // 在router文件夹下的index.js中设置了路由全局守卫router.beforeEach后不再需要这段代码
  // async beforeCreate() {
  //   const response = await this.$http({
  //     method: 'get',
  //     url: 'admin/status_manage/login',
  //     withCredentials: true
  //   })
  //   if (response['data']['data']['username'] === 'None') {
  //     const deleteCookie = await this.$http({
  //       method: 'delete',
  //       url: 'admin/remember_password',
  //       withCredentials: true
  //     })
  //     if (
  //       deleteCookie['data']['meta']['msg'] === '用户的账号及密码的cookie已删除'
  //     ) {
  //       localStorage.removeItem('remember')
  //       this.$router.push({ name: 'login' })
  //     }
  //   }
  // },
  data() {
    return {
      // P82 1:30
      // P85
      sessionStorageUsage: 'https://www.cnblogs.com/aknife/p/12029378.html',
      JS_Cookie: 'https://www.runoob.com/js/js-cookies.html'
    }
  },
  methods: {
    async deleteSession() {
      // 删除session
      const response = await this.$http({
        method: 'delete',
        url: 'admin/status_manage/logout',
        withCredentials: true
      })
      if (response['data']['data']['status'] === 'logout') {
        this.$message.success('退出成功')
        this.$router.push({ name: 'login' })
        // window.location.reload()
      }
    }
  }
}
</script>
<style>
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}
.header {
  padding: 0px;
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
}
.title {
  text-align: center;
}
.logout {
  line-height: 60px;
  text-decoration: none;
}
</style>
