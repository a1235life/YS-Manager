<template>
  <div>
    <el-card class="box-card">
      <!-- 1.面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 2.搜索、添加用户 -->
      <el-row class="searchRow">
        <el-col align="left">
          <el-input
            type="search"
            placeholder="请输入内容"
            v-model="query"
            class="inputSearch"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button>
          </el-input>
          <!-- 添加用户 -->
          <el-button type="success" @click="openAddUserDialog()"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 3.表格 -->
      <el-table
        empty-text="服务器请求超时"
        :data="userTable"
        style="width: 100%"
        stripe
        height="500"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column fixed prop="id" label="#" width="150">
        </el-table-column>
        <el-table-column prop="username" label="昵称" width="200">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="200">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="320">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="350">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-star-off"
              circle
              @click="get_favorites(scope.row)"
              >查看收藏</el-button
            >
            <el-button
              type="info"
              icon="el-icon-message"
              circle
              @click="send_email(scope.row)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="edit_user(scope.row)"
            ></el-button>
            <el-popconfirm
              title="确定删除此成员吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              @confirm="delete_user(scope.row.id)"
            >
              <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 4.分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6, 8, 10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog"
      :append-to-body="true"
      :show-close="false"
    >
      <el-form :model="addUser" ref="addUser" :rules="userRules">
        <el-form-item prop="username">
          <el-input
            type="text"
            prefix-icon="el-icon-user"
            placeholder="昵称"
            auto-complete="off"
            v-model="addUser.username"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            @blur="validate_phone()"
            type="tel"
            prefix-icon="el-icon-mobile-phone"
            placeholder="手机号"
            auto-complete="off"
            v-model="addUser.phone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="密码"
            auto-complete="off"
            show-password
            v-model="addUser.password"
            @blur="validate_password()"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            type="email"
            prefix-icon="el-icon-message"
            placeholder="邮箱"
            v-model="addUser.email"
            @blur="validate_email()"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd()">取 消</el-button>
        <el-button type="primary" @click="submitUser('addUser')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 查看用户收藏对话框 -->
    <el-dialog
      :visible.sync="getFavoritesDialog"
      :append-to-body="true"
      width="55%"
    >
      <div slot="title">
        <i class="el-icon-view"></i>
        <span class="title-text">{{ current_user.username }}的收藏</span>
      </div>
      <el-row>
        <div v-if="favorites.length === 0">此用户尚未收藏任何文章</div>
        <el-col :span="24" v-for="(article, i) in favorites" :key="i">
          <el-card align="center">
            <el-image
              :src="article.cover_pic"
              alt="服务器请求超时"
              fit="contain"
              lazy
            ></el-image>
            <!-- <img :src="article.cover_pic" alt="服务器请求超时" fit="cover" /> -->
            <div>
              <span>{{ article.article_name }}</span>
              <div>
                <el-link :href="article.location" target="_blank" type="primary"
                  >查看<i class="el-icon-view el-icon--right"></i
                ></el-link>
              </div></div
          ></el-card>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 发送邮件对话框 -->
    <el-dialog
      :visible.sync="sendEmailDialog"
      append-to-body
      :show-close="false"
    >
      <div slot="title">
        <i class="el-icon-message"></i>
        <span class="title-text">收信人：{{ current_user.username }}</span>
      </div>
      <el-form :model="current_user">
        <el-form-item>
          <el-input
            type="email"
            prefix-icon="el-icon-user-solid"
            placeholder="用户邮箱"
            v-model="current_user.email"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="textarea"
            placeholder="邮件内容"
            v-model="email_content"
            maxlength="50"
            show-word-limit
            autocomplete="off"
            autosize
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSendEmail()">取 消</el-button>
        <el-button type="primary" @click="confirmSendEmail()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editUserDialog"
      :append-to-body="true"
      :show-close="false"
    >
      <el-form :model="addUser" ref="editUser" :rules="userRules">
        <el-form-item prop="username">
          <el-input
            type="text"
            prefix-icon="el-icon-user"
            placeholder="昵称"
            auto-complete="off"
            v-model="addUser.username"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            @blur="validate_phone()"
            type="tel"
            prefix-icon="el-icon-mobile-phone"
            placeholder="手机号"
            auto-complete="off"
            v-model="addUser.phone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            type="email"
            prefix-icon="el-icon-message"
            placeholder="邮箱"
            v-model="addUser.email"
            @blur="validate_email()"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit()">取 消</el-button>
        <el-button type="primary" @click="confirmEdit('editUser')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      query: '', // 搜索框内容绑定
      pagesize: 6, // 每页显示6条记录
      pagenum: 1, // 当前页码
      total: 0, // 总共多少条数据
      userTable: [], // 用户表格数据
      addUserDialog: false, // 添加用户对话框
      addUser: {
        id: -1,
        username: '',
        phone: '',
        password: '',
        email: ''
      }, // 添加用户按钮要用到的对象
      userRules: {
        username: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 18, message: '昵称位数应为2~18位', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入有效的手机号', trigger: 'blur' }
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
      }, // 添加用户的表单验证
      current_user: {
        id: -1,
        username: '',
        email: '',
        phone: ''
      }, // 当前用户信息
      getFavoritesDialog: false, // 查看用户收藏对话框
      favorites: [], // 用户的收藏
      sendEmailDialog: false, // 发送邮件的对话框
      email_content: '', // 邮件内容
      editUserDialog: false
    }
  },
  // 创建页面时数据渲染
  created() {
    this.getUserList()
  },
  methods: {
    // 检索功能
    async getUserList() {
      const response = await this.$http.get(
        'user/retrieve_user?query=' +
          this.query +
          '&page_num=' +
          this.pagenum +
          '&page_size=' +
          this.pagesize
      )
      if (response['data']['meta']['msg'] === '获取成功') {
        // 1.用数据渲染表格
        this.userTable = response['data']['data']['user_list']
        // 2.将数据的总记录数赋值给total
        this.total = response['data']['data']['total']
      } else {
        // 数据获取失败
        this.$message.warning(response['data']['meta']['msg'])
      }
    },
    // 打开添加用户对话框
    openAddUserDialog() {
      // 1.打开对话框
      // for (const key in this.addUser) {
      //   if (this.addUser.hasOwnProperty(key)) {
      //     this.addUser[key] = ''
      //   }
      // }
      this.addUser.id = -1
      this.addUser.username = ''
      this.addUser.phone = ''
      this.addUser.password = ''
      this.addUser.email = ''
      this.addUserDialog = true
    },
    // 添加用户-验证手机号
    validate_phone() {
      // var PhoneCheck = /^1[3456789]d{9}$/
      var PhoneCheck = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/
      if (this.addUser.phone === '' || !PhoneCheck.test(this.addUser.phone)) {
        this.$message.error('请输入有效的手机号')
        this.addUser.phone = ''
      }
    },
    // 添加用户-验证密码
    validate_password() {
      var PasswordCheck = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      if (
        this.addUser.password === '' ||
        !PasswordCheck.test(this.addUser.password)
      ) {
        this.$message({
          message: '密码位数应为6~16位，必须带有字母和数字',
          type: 'error'
        })
        this.addUser.password = ''
      }
    },
    // 添加用户-验证邮箱
    validate_email() {
      var EmailCheck = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (this.addUser.email === '' || !EmailCheck.test(this.addUser.email)) {
        this.$message({
          message: '请输入有效的邮箱',
          type: 'error'
        })
        this.addUser.email = ''
      }
    },
    // 取消添加用户
    cancelAdd() {
      this.$confirm('您确定取消添加用户吗？已输入的数据将不会被保存', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 取消添加用户，隐藏对话框
          this.addUserDialog = false
        })
        // 继续添加对话框
        .catch(() => {})
    },
    // 确定添加用户
    submitUser(addUser) {
      // 0.判断数据合理性
      this.$refs[addUser].validate(valid => {
        if (valid) {
          // 1.发送添加用户请求
          this.$http.post('user/add_user', this.addUser).then(response => {
            // 2.操作返回数据
            if (response['data']['meta']['msg'] === '添加成功') {
              // 3.提示结果（添加成功）
              this.$message.success(response['data']['meta']['msg'])
              // 4.关闭对话框
              this.addUserDialog = false
              // 5.重新渲染页面数据
              this.getUserList()
            } else {
              // 提示结果（添加失败原因）
              this.$message.error(response['data']['meta']['msg'])
              this.addUser.username = ''
              this.addUser.phone = ''
              this.addUser.password = ''
              this.addUser.email = ''
            }
          })
        } else {
          alert('请输入正确的信息')
        }
      })
    },
    // 查看用户收藏
    async get_favorites(user) {
      this.current_user.username = user.username
      this.getFavoritesDialog = true
      const response = await this.$http.get('user/get_favorites/' + user.id)
      this.favorites = response['data']['favorite_list']
    },
    // 打开发送电子邮件对话框
    send_email(user) {
      this.current_user = user
      this.email_content = ''
      this.sendEmailDialog = true
    },
    // 取消发送邮件
    cancelSendEmail() {
      this.$confirm('您确定取消发送邮件吗？已输入的内容将不会被保存', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 取消发送邮件，隐藏对话框
          this.sendEmailDialog = false
        })
        // 继续添加对话框
        .catch(() => {})
    },
    // 发送电子邮件
    async confirmSendEmail() {
      if (this.current_user.email === '' || this.current_user.email === null) {
        this.$message.error('邮箱为空')
      } else {
        if (this.email_content === '' || this.email_content === null) {
          this.$message.error('邮件正文内容为空')
        } else {
          var input = {
            receiver: this.current_user.email,
            email_content: this.email_content
          }
          this.sendEmailDialog = false
          this.$message.info('等待服务器响应，请稍后')
          const response = await this.$http.post(
            'verification/send_email',
            input
          )
          if (response['data']['meta']['msg'] === '邮件发送成功') {
            this.$message.success(response['data']['meta']['msg'])
          } else {
            this.$message.error(response['data']['meta']['msg'])
          }
        }
      }
    },
    // 编辑用户对话框
    edit_user(user) {
      this.addUser = user
      this.current_user.id = user.id
      this.current_user.username = user.username
      this.current_user.phone = user.phone
      this.current_user.email = user.email
      this.editUserDialog = true
    },
    // 取消编辑用户
    cancelEdit() {
      this.$confirm('您确定取消编辑用户吗？已修改的数据将不会被保存', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 取消编辑用户，隐藏对话框
          this.editUserDialog = false
        })
        // 继续添加对话框
        .catch(() => {})
    },
    // 确定修改用户
    confirmEdit(editUser) {
      if (
        this.addUser.username === this.current_user.username &&
        this.addUser.phone === this.current_user.phone &&
        this.addUser.email === this.current_user.email
      ) {
        this.$message.error('请您修改后再提交')
      } else {
        this.$refs[editUser].validate(valid => {
          if (valid) {
            this.$http
              .put('user/modify_user/' + this.addUser.id, this.addUser)
              .then(response => {
                if (response['data']['meta']['msg'] === '修改成功') {
                  this.$message.success(response['data']['meta']['msg'])
                  this.editUserDialog = false
                  this.getUserList()
                } else {
                  this.$message.error(response['data']['meta']['msg'])
                  this.getUserList()
                }
              })
          } else {
            alert('请输入正确的信息')
            this.getUserList()
          }
        })
      }
    },
    // 删除用户
    async delete_user(id) {
      const response = await this.$http.delete('user/delete_user/' + id)
      if (response['data']['meta']['msg'] === '删除成功') {
        this.$message.success(response['data']['meta']['msg'])
        this.getUserList()
      } else {
        this.$message.error('出错了，请重新登录后再试')
        this.getUserList()
      }
    },
    // 控制每页几条数据
    handleSizeChange(val) {
      this.pagesize = val
      this.getUserList()
      // console.log(`每页 ${val} 条`)
    },
    // 控制当前所在页
    handleCurrentChange(val) {
      this.pagenum = val
      this.getUserList()
      // console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style>
.box-card {
  height: 100%;
}
.inputSearch {
  width: 300px;
}
.searchRow {
  margin-top: 20px;
}
</style>>
