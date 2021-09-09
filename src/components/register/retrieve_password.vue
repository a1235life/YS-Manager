<template>
  <div class="whole-page">
    <div class="retrieve-pwd-form">
      <el-form ref="admin" :model="admin">
        <div class="title-style"><h2>忘记密码</h2></div>
        <el-form-item style="text-align: left">
          <el-steps :active="active" finish-status="success" align-center>
            <el-step title="身份验证"></el-step>
            <el-step title="密码重置"></el-step>
            <el-step title="重置完成"></el-step>
          </el-steps>
        </el-form-item>
        <el-form-item>
          <div v-show="active == 0">
            <el-input
              prefix-icon="el-icon-user"
              placeholder="账号"
              style="width: 390px"
              type="text"
              v-model="admin.username"
              :disabled="username_input_disabled"
            >
            </el-input>
          </div>
          <div v-show="active == 1">
            <el-input
              prefix-icon="el-icon-lock"
              placeholder="请输入密码"
              style="width: 390px"
              type="password"
              v-model="admin.modify_password"
              autocomplete="off"
              show-password
            >
            </el-input>
          </div>
          <div v-show="active == 2">^0^密码重置成功，您可以登录啦</div>
        </el-form-item>
        <el-row>
          <div v-show="active == 1">
            <el-input
              prefix-icon="el-icon-lock"
              placeholder="请再次输入密码"
              style="width: 390px"
              type="password"
              v-model="admin.confirm_password"
              autocomplete="off"
            >
            </el-input>
          </div>
          <el-col :span="15" align="right">
            <el-form-item>
              <div v-show="active == 0">
                <el-input
                  prefix-icon="el-icon-warning-outline"
                  placeholder="验证码"
                  type="text"
                  style="width: 255px"
                  v-model="input_verification_code"
                >
                </el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="7" align="center">
            <el-form-item>
              <div v-show="active == 0">
                <el-button
                  :disabled="whether_disabled"
                  @click="send_verification()"
                  type="info"
                  style="width: 130px"
                  plain
                  >{{ btn_content }}</el-button
                >
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          style="margin-top: 5px"
          v-show="active == 0 || active == 1"
        >
          <el-button type="primary" @click="next">下一步</el-button>
          <el-button @click="reset()">重置</el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-form-item>
        <el-form-item v-show="active == 2">
          <el-button type="primary" @click="next">去登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="footer">
      <el-link @click="aplus()" :underline="false" type="info"
        >关于我们@微信公众号Aplus实验室<i
          class="el-icon-view el-icon--right"
        ></i
      ></el-link>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      admin: {
        id: null,
        username: '',
        modify_password: '',
        confirm_password: '',
        email: '',
        role_id: null
      },
      input_verification_code: '',
      correct_verification_code: '正确的验证码为用户收到的邮件中的验证码',
      // 步骤的index
      active: 0,
      btn_content: '发送验证码',
      count_down: 120,
      username_input_disabled: false,
      whether_disabled: false // false代表按钮可用，true代表禁用
    }
  },
  methods: {
    cancel() {
      this.$router.replace('/login')
    },
    reset() {
      switch (this.active) {
        case 0:
          this.admin.username = ''
          this.input_verification_code = ''
          break
        case 1:
          this.admin.modify_password = ''
          this.admin.confirm_password = ''
          break
      }
    },
    async next() {
      switch (this.active) {
        case 0:
          // 验证码正确，跳入下一步
          if (this.input_verification_code === this.correct_verification_code) {
            if (
              this.input_verification_code ===
              '正确的验证码为用户收到的邮件中的验证码'
            ) {
              this.$message.error('验证失败，请重试')
              this.input_verification_code = ''
            } else this.active++
            // 验证码错误，将验证码输入框置空
          } else {
            if (this.admin.username === '') {
              this.input_verification_code = ''
              this.$message.error('请输入账号')
            } else {
              this.$message.error('验证失败，请重试')
              this.input_verification_code = ''
            }
          }
          break
        case 1:
          if (this.validate_password() === true) {
            if (this.admin.confirm_password === this.admin.modify_password) {
              var AdminUpdate = {
                id: this.admin.id,
                username: this.admin.username,
                password: this.admin.confirm_password,
                email: this.admin.email,
                role_id: this.admin.role_id
              }
              const response = await this.$http.put(
                'admin/modify_password',
                AdminUpdate
              )
              if (response['data']['meta']['msg'] === '修改成功') {
                this.active++
              } else {
                this.$message({
                  showClose: true,
                  message: '修改失败，请重试',
                  type: 'error',
                  duration: 5000
                })
              }
            } else {
              this.$message({
                showClose: true,
                message: '两次密码不一致',
                type: 'error',
                duration: 5000
              })
            }
          }
          break
        case 2:
          this.active = 0
          this.$router.replace('/login')
          break
      }
    },
    aplus() {
      this.$router.push({
        path: '/aplus',
        query: {
          back_position: '/retrieve_password'
        }
      })
    },
    async send_verification() {
      var UsernameValidate = {
        validate: this.admin.username
      }
      if (this.admin.username !== '') {
        const UsernameValidateResult = await this.$http.post(
          'admin/validate/username',
          UsernameValidate
        )
        if (UsernameValidateResult['data']['meta']['msg'] === '该账号已存在') {
          this.username_input_disabled = true
          this.whether_disabled = true
          this.btn_content = this.count_down + 's后重新发送'
          let clock = window.setInterval(() => {
            this.count_down--
            this.btn_content = this.count_down + 's后重新发送'
            if (this.count_down < 0) {
              window.clearInterval(clock)
              this.btn_content = '重新发送验证码'
              this.count_down = 120
              this.whether_disabled = false
            }
          }, 1000)
          var email = {
            validate: UsernameValidateResult['data']['data']['email']
          }
          const response = await this.$http.post('admin/validate_email', email)
          if (response['data']['meta']['msg'] === '验证码已发送到该邮箱中') {
            this.$message.success('验证码已发送，请耐心等待，不要刷新页面')
            this.correct_verification_code =
              response['data']['data']['verification_code']
            this.admin.id = UsernameValidateResult['data']['data']['id']
            this.admin.username =
              UsernameValidateResult['data']['data']['username']
            this.admin.email = UsernameValidateResult['data']['data']['email']
            this.admin.role_id =
              UsernameValidateResult['data']['data']['role_id']
          } else {
            this.$message.error('验证码发送失败，请重试')
          }
        } else {
          this.$message({
            showClose: true,
            message: '您输入的账号不对哦0.0',
            type: 'error',
            duration: 5000
          })
          this.admin.username = ''
        }
      } else {
        this.$message({
          showClose: true,
          message: '请输入账号',
          type: 'error',
          duration: 5000
        })
      }
    },
    validate_password() {
      var PasswordCheck = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      if (
        this.admin.modify_password === '' ||
        !PasswordCheck.test(this.admin.modify_password)
      ) {
        this.$message({
          showClose: true,
          message: '密码位数应为6~16位，必须带有字母和数字',
          type: 'error',
          duration: 5000
        })
        this.admin.modify_password = ''
        return false
      }
      return true
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
.retrieve-pwd-form {
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
#footer {
  text-align: center;
  bottom: 15px;
  position: absolute;
  width: 100%;
  color: white;
}
</style>
