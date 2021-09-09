<template>
  <div class="whole-page">
    <div class="register-box">
      <el-form ref="admin" :model="admin" :rules="adminRules">
        <div class="title-style">
          <h2>注册</h2>
        </div>
        <el-form-item prop="username">
          <el-input
            type="text"
            prefix-icon="el-icon-user"
            placeholder="账号"
            v-model="admin.username"
            @blur="validate_username()"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="密码"
            v-model="admin.password"
            @blur="validate_password()"
            auto-complete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            type="email"
            prefix-icon="el-icon-message"
            placeholder="邮箱"
            v-model="admin.email"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="17" align="left">
            <el-form-item>
              <el-input
                type="text"
                prefix-icon="el-icon-warning-outline"
                placeholder="验证码"
                v-model="input_verification"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" align="right">
            <el-form-item>
              <el-button
                :disabled="whether_disabled"
                @click="send_verification()"
                type="info"
                plain
                >{{ btn_content }}</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button class="btn" type="primary" @click="register('admin')"
            >注册</el-button
          >
          <el-button class="btn" plain @click="back()">返回</el-button>
        </el-form-item>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      admin: {
        username: '',
        password: '',
        email: ''
      },
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      adminRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 18, message: '账号位数应为5~18位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '密码位数应为6~16位，必须带有字母和数字',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入正确的邮箱', trigger: 'blur' }
        ]
      },
      //   用户输入的验证码
      input_verification: '',
      //   正确的验证码
      correct_verification: '正确的验证码为用户收到的邮件中的验证码',
      btn_content: '发送验证码',
      //   代表发送验证码按钮是否禁用，若值为true，说明用户尚未输入正确的邮箱，此按钮禁用
      whether_disabled: false, // false代表按钮可用，true代表禁用
      count_down: 60
    }
  },
  methods: {
    validate_username() {
      var UsernameValidate = {
        validate: this.admin.username
      }
      if (this.admin.username !== '') {
        this.$http
          .post('admin/validate/username', UsernameValidate)
          .then(response => {
            if (response['data']['meta']['msg'] === '该账号已存在') {
              this.$message({
                message: response['data']['meta']['msg'],
                type: 'error'
              })
              this.admin.username = ''
            }
          })
      } else {
        this.$message({
          message: '请输入账号',
          type: 'error'
        })
      }
    },
    validate_password() {
      var PasswordCheck = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      if (
        this.admin.password === '' ||
        !PasswordCheck.test(this.admin.password)
      ) {
        this.$message({
          message: '密码位数应为6~16位，必须带有字母和数字',
          type: 'error'
        })
        this.admin.password = ''
      }
    },
    send_verification() {
      var EmailCheck = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (this.admin.email === '' || !EmailCheck.test(this.admin.email)) {
        this.$message({
          message: '请输入有效的邮箱',
          type: 'error'
        })
        this.admin.email = ''
        this.whether_disabled = false
      } else {
        var EmailValidate = {
          validate: this.admin.email
        }
        this.$http
          .post('admin/validate/email', EmailValidate)
          .then(response => {
            if (response['data']['meta']['msg'] === '此邮箱已被注册') {
              // 若邮箱已被注册，将邮箱输入框置空
              this.$message({
                message: response['data']['meta']['msg'],
                type: 'error'
              })
              this.admin.email = ''
            } else {
              // 若邮箱未被注册，向用户发送邮件
              this.whether_disabled = true
              this.$http
                .post('admin/validate_email', EmailValidate)
                .then(response => {
                  switch (response['data']['meta']['msg']) {
                    case '验证码已发送到该邮箱中':
                      this.$message({
                        message: '验证码已发送，请耐心等待，不要刷新页面',
                        type: 'success'
                      })
                      this.correct_verification =
                        response['data']['data']['verification_code']
                      break
                    case '验证码邮件发送失败':
                      this.$message({
                        message: '验证码发送失败，请重试',
                        type: 'error'
                      })
                      break
                  }
                })
              this.btn_content = this.count_down + 's后重新发送'
              let clock = window.setInterval(() => {
                this.count_down--
                this.btn_content = this.count_down + 's后重新发送'
                if (this.count_down < 0) {
                  window.clearInterval(clock)
                  this.btn_content = '重新发送验证码'
                  this.count_down = 60
                  this.whether_disabled = false
                }
              }, 1000)
            }
          })
      }
    },
    register(admin) {
      this.$refs[admin].validate(valid => {
        if (valid) {
          if (this.input_verification === this.correct_verification) {
            var input = {
              username: this.admin.username,
              password: this.admin.password,
              email: this.admin.email,
              role_id: 2
            }
            this.$http.post('admin/register', input).then(response => {
              if (response['data']['meta']['status'] === 201) {
                this.$message({
                  message: response['data']['meta']['msg'],
                  type: 'success'
                })
                this.$router.replace('/login')
              }
            })
          } else {
            this.$message({
              message: '验证码错误',
              type: 'error'
            })
          }
        } else {
          alert('请输入正确的信息')
        }
      })
    },
    back() {
      this.$router.replace('/login')
    },
    aplus() {
      this.$router.push({
        path: '/aplus',
        query: {
          back_position: '/register'
        }
      })
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
.register-box {
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
.register-box .btn {
  width: 48.5%;
}
.title-style {
  color: #fff;
  z-index: 999;
  font-size: 1.8rem;
  font-family: 'Teko', sans-serif;
  text-shadow: 4.5px 4.5px #000000;
  text-transform: uppercase;
  margin-top: -45px;
  @media (max-width: 767px) {
    font-size: 1rem;
  }
  /* 如果文档宽度小于 767 像素则修改页面字体大小 */
}
#footer {
  text-align: center;
  bottom: 15px;
  position: absolute;
  width: 100%;
  color: white;
}
</style>
