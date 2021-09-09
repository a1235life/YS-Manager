<template>
  <div class="whole-page">
    <div class="login-box">
      <el-form ref="admin" :model="admin" :rules="adminRules">
        <div class="title-style"><h2>益食空间</h2></div>
        <el-form-item prop="username">
          <el-input
            type="text"
            prefix-icon="el-icon-user"
            placeholder="管理员账号"
            v-model="admin.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="管理员密码"
            v-model="admin.password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="17" align="left">
            <el-form-item>
              <el-checkbox v-model="checked"
                >记住我(不是自己的电脑上不要勾选此项)</el-checkbox
              >
            </el-form-item>
          </el-col>
          <el-col :span="7" align="right">
            <el-form-item>
              <el-link @click="forget()" :underline="false" type="primary"
                >忘记密码?</el-link
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button class="btn" type="primary" @click="login('admin')"
            >登录</el-button
          >
        </el-form-item>
        <el-row>
          <el-col :span="17" align="left">
            <el-form-item>
              <el-link @click="register()" :underline="false" type="primary"
                >还没有账号？点击注册</el-link
              >
            </el-form-item>
          </el-col>
          <el-col :span="7" align="right">
            <el-form-item>
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  其它方式登录<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="email"
                    >邮箱验证登录</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div id="footer">
      <el-link @click="aplus()" :underline="false" type="info"
        >关于我们@微信公众号Aplus实验室<i
          class="el-icon-view el-icon--right"
        ></i
      ></el-link>
      <!-- <a @click="aplus">关于我们@微信公众号Aplus实验室</a> -->
    </div>
    <vue-particles
      color="#ffffff"
      :particleOpacity="0.7"
      linesColor="#ffffff"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="5"
      :linesWidth="2"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <el-dialog
      top="330px"
      width="20%"
      title="安全验证"
      :visible.sync="verificationDialog"
      :append-to-body="true"
    >
      <el-form>
        <el-row>
          <el-col :span="12" align="center">
            <el-form-item>
              <el-image
                style="width: 100px; height: 40px"
                :src="url"
                :fit="fit"
              ></el-image>
            </el-form-item>
          </el-col>
          <el-col :span="12" align="center">
            <el-form-item>
              <el-link
                @click="getVerificationCode()"
                :underline="false"
                type="primary"
                >换一个</el-link
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item>
              <el-input
                type="text"
                placeholder="验证码"
                v-model="input_verification_code"
                ref="input_verification_code_focus"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" align="center">
            <el-button type="primary" plain @click="confirmLogin()"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  async created() {
    if (localStorage.getItem('remember') === 'true') {
      this.checked = true
      // 记住我，自动登录，不进入登录界面
      const getCookie = await this.$http({
        method: 'get',
        url: 'admin/remember_password',
        withCredentials: true
      })
      if (getCookie['data']['meta']['msg'] === '账号和密码的cookie不存在') {
        this.$message.error('自动登录失败')
        localStorage.removeItem('remember')
        window.location.reload()
        return
      }
      var autoLoginParam = {
        id: getCookie['data']['data']['id'],
        username: getCookie['data']['data']['username'],
        password: getCookie['data']['data']['password']
      }
      const autoLogin = await this.$http({
        method: 'post',
        data: autoLoginParam,
        url: 'admin/auto_login'
      })
      if (autoLogin['data']['meta']['msg'] === '登录成功') {
        const loginResponse = await this.$http({
          method: 'post',
          url: 'admin/status_manage/' + autoLogin['data']['data']['username'],
          withCredentials: true
        })
        if (loginResponse['data']['data']['status'] === 'login') {
          this.$message.success('登录成功')
          this.$router.push({ name: 'home' })
        } else {
          this.$message.error('登录失败，请重试')
        }
      }
    } else {
      this.checked = false
    }
  },
  data() {
    return {
      admin: {
        id: null,
        username: '',
        password: ''
      },
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      adminRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 18, message: '请输入有效的账号', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      // 当checked为true时，自动登录
      checked: false,
      verificationDialog: false,
      input_verification_code: '',
      right_verification_code: '',
      fit: 'contain',
      url: ''
    }
  },
  methods: {
    register() {
      this.$router.replace('/register')
    },
    aplus() {
      this.$router.push({
        path: '/aplus',
        query: {
          back_position: '/login'
        }
      })
    },
    login(admin) {
      this.$refs[admin].validate(async valid => {
        if (valid) {
          const response = await this.$http.post(
            'admin/username_login',
            this.admin
          )
          if (response['data']['meta']['msg'] === '登录成功') {
            this.admin.id = response['data']['data']['id']
            this.verificationDialog = true
            this.getVerificationCode()
          } else {
            this.$message.error(response['data']['meta']['msg'])
            this.admin.id = null
            this.admin.username = ''
            this.admin.password = ''
          }
        } else {
          alert('请输入正确的账号密码')
        }
      })
    },
    forget() {
      this.$router.push({ name: 'retrieve_password' })
    },
    // 其它方式登录
    handleCommand(command) {
      if (command === 'email') {
        this.$router.replace('/email_login')
      }
    },
    async getVerificationCode() {
      const response = await this.$http.get('verification/get_one')
      this.input_verification_code = ''
      this.right_verification_code = response['data']['code'].toLowerCase()
      this.url = response['data']['location']
      this.$refs['input_verification_code_focus'].focus()
    },
    async confirmLogin() {
      if (
        this.input_verification_code.toLowerCase() ===
        this.right_verification_code
      ) {
        if (this.checked === true) {
          // 记住密码
          localStorage.setItem('remember', 'true')
          var remember = {
            id: this.admin.id,
            username: this.admin.username,
            password: this.admin.password
          }
          const rememberResponse = await this.$http({
            method: 'post',
            data: remember,
            url: 'admin/remember_password',
            withCredentials: true
          })
          if (
            rememberResponse['data']['meta']['msg'] ===
            '用户的账号及密码已加密并存入cookie，一周后过期'
          ) {
            this.$message.success('不是自己的电脑请不要选择“记住我”哟')
          }
        } else {
          const deleteRemember = await this.$http({
            method: 'delete',
            url: 'admin/remember_password',
            withCredentials: true
          })
          if (
            deleteRemember['data']['meta']['msg'] ===
            '用户的账号及密码的cookie已删除'
          ) {
            localStorage.removeItem('remember')
          }
        }
        const loginResponse = await this.$http({
          method: 'post',
          url: 'admin/status_manage/' + this.admin.username,
          withCredentials: true
        })
        if (loginResponse['data']['data']['status'] === 'login') {
          this.$message.success('登录成功')
          this.$router.push({ name: 'home' })
        } else {
          this.$message.error('登录失败，请重试')
        }
      } else {
        if (this.input_verification_code === '') {
          this.$message.error('请输入验证码')
        } else {
          this.$message.error('验证码错误')
        }
        this.getVerificationCode()
      }
    }
  }
}
</script>
<style>
.whole-page {
  background-image: url('../../assets/sky.jpg');
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
}
.title-style {
  color: #fff;
  z-index: 999;
  font-size: 1.8rem;
  font-family: 'Teko', sans-serif;
  text-shadow: 4.5px 4.5px #000000;
  text-transform: uppercase;
  margin-top: -30px;
  @media (max-width: 767px) {
    font-size: 1rem;
  }
  /* 如果文档宽度小于 767 像素则修改页面字体大小 */
}
.login-box {
  width: 480px;
  height: 380px;
  /* background-color: #fff; */
  background-color: #909399;
  border-radius: 80px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 40px 40px 40px;
}
.login-box .btn {
  width: 100%;
}
#footer {
  text-align: center;
  bottom: 15px;
  position: absolute;
  width: 100%;
  color: white;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
