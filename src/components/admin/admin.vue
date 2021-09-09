<template>
  <div>
    <el-card class="box-card">
      <!-- 1.面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>管理员</el-breadcrumb-item>
        <el-breadcrumb-item>成员列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 2.搜索 -->
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
              @click="getAdminList()"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 3.表格 -->
      <el-table
        empty-text="服务器请求超时"
        :data="adminTable"
        style="width: 100%"
        stripe
        height="500"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column fixed prop="id" label="#" width="150">
        </el-table-column>
        <el-table-column prop="username" label="账号" width="120">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="330">
        </el-table-column>
        <el-table-column label="创建日期" width="150">
          <template slot-scope="scope">
            {{ scope.row.create_time | fmtdate }}
          </template>
        </el-table-column>
        <!-- 成员状态开关 -->
        <el-table-column label="用户状态" width="180">
          <template slot-scope="scope"  v-if="scope.row.id !== 1">
            <el-switch
              @change="changeStatus(scope.row)"
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="270">
          <template slot-scope="scope" v-if="scope.row.id !== 1">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="openEditAdminDialog(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-popconfirm
              title="确定删除此成员吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              @confirm="deleteAdmin(scope.row.id)"
            >
              <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
            </el-popconfirm>
            <!-- 分配角色按钮 -->
            <el-button
              type="success"
              icon="el-icon-setting"
              circle
              @click="openSetRoleDialog(scope.row)"
            ></el-button>
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
    <!-- 编辑成员对话框 -->
    <el-dialog
      title="编辑成员"
      :visible.sync="editAdminDialog"
      :append-to-body="true"
      :show-close="false"
    >
      <el-form :model="editAdmin">
        <el-form-item>
          <el-input
            type="number"
            prefix-icon="el-icon-place"
            placeholder="id"
            v-model="editAdmin.id"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="text"
            prefix-icon="el-icon-user"
            placeholder="账号"
            v-model="editAdmin.username"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="email"
            prefix-icon="el-icon-message"
            placeholder="邮箱"
            v-model="editAdmin.email"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="editAdmin.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit()">取 消</el-button>
        <el-button type="primary" @click="submitEdit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialog"
      :append-to-body="true"
      :show-close="false"
    >
      <el-form :model="editAdmin">
        <el-form-item label="账号" :label-width="formLabelWidth">
          {{ this.editAdmin.username }}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="role_value" placeholder="请选择角色">
            <el-option
              v-for="item in roles"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSetRole()">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      query: '',
      pagesize: 6, // 每页显示10条记录
      pagenum: 1, // 当前页码
      total: 0, // 总共多少条数据
      adminTable: [
        // 假数据
        // {
        //   id: '1',
        //   username: 'a1235life',
        //   email: 'a1235life@gmail.com',
        //   create_time: '2021-03-14',
        //   status: true
        // }
      ],
      editAdminDialog: false, // 编辑成员对话框
      setRoleDialog: false, // 分配角色对话框
      formLabelWidth: '45px', // 分配角色对话框标签长度
      editAdmin: {
        id: 0,
        username: '',
        email: '',
        status: false,
        role_id: -1
      },
      roles: [
        // {
        //   role_id: 1,
        //   role_name: '超级管理员'
        // },
        // {
        //   role_id: 2,
        //   role_name: '普通管理员'
        // }
      ],
      role_value: '' // 角色码，0->超级管理员；1->普通管理员
    }
  },
  // 创建页面时数据渲染
  created() {
    this.getAdminList()
  },
  methods: {
    // 分配角色窗口
    async openSetRoleDialog(admin) {
      this.setRoleDialog = true
      this.editAdmin.id = admin.id
      this.editAdmin.username = admin.username
      const response = await this.$http.get('role/role_list')
      this.roles = response['data']['data']
      for (var i = 0; i < this.roles.length; i++) {
        if (admin.role_id === this.roles[i].role_id) {
          this.role_value = this.roles[i].role_id
          break
        }
      }
      // P53
    },
    // 分配角色->确定按钮
    async setRole() {
      const response = await this.$http.put(
        'admin/set_role/' + this.editAdmin.id + '/' + this.role_value
      )
      if (response['data']['meta']['msg'] === '角色修改成功') {
        this.setRoleDialog = false
        this.$message.success(response['data']['meta']['msg'])
        this.getAdminList()
      } else {
        this.$message.error('修改失败，请重新登录再进行尝试')
        this.getAdminList()
      }
    },
    cancelSetRole() {
      this.$confirm('您确定取消分配角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 取消分配角色，隐藏对话框
          this.setRoleDialog = false
          this.getAdminList()
        })
        // 继续
        .catch(() => {})
    },
    // 改变成员状态开关
    async changeStatus(admin) {
      const response = await this.$http.put('admin/change_status/' + admin.id)
      if (response['data']['meta']['status'] === 202) {
        this.$message.success('修改成功')
        this.getAdminList()
      } else {
        this.$message.error('修改失败，请重新登录再进行尝试')
        this.getAdminList()
      }
    },
    // 打开编辑成员窗口
    openEditAdminDialog(admin) {
      this.editAdminDialog = true
      this.editAdmin['id'] = admin.id
      this.editAdmin['username'] = admin.username
      this.editAdmin['email'] = admin.email
      this.editAdmin['status'] = admin.status
    },
    // 编辑成员窗口，取消按钮
    cancelEdit() {
      this.$confirm('您确定取消修改吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 取消添加用户，隐藏对话框
          this.editAdminDialog = false
        })
        // 继续添加对话框
        .catch(() => {})
    },
    // 编辑成员窗口，确定修改按钮
    async submitEdit() {
      // 0.正则表达式验证邮箱
      var EmailCheck = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (
        this.editAdmin.email === '' ||
        !EmailCheck.test(this.editAdmin.email)
      ) {
        this.$message.error('请输入有效的邮箱')
        this.editAdmin.email = ''
      } else {
        // 1.发送修改用户请求
        const response = await this.$http.put(
          'admin/edit_admin',
          this.editAdmin
        )
        // 2.操作返回数据
        if (response['data']['meta']['msg'] === '修改成功') {
          // 3.提示结果（添加成功或失败）
          this.$message.success('修改成功')
          // 4.关闭对话框
          this.editAdminDialog = false
          // 5.刷新页面
          this.getAdminList()
        } else {
          this.$message.error('修改失败，请重新登录再进行尝试')
          this.editAdminDialog = false
        }
        // P46 00:19
      }
    },
    // 删除成员按钮
    async deleteAdmin(adminId) {
      const response = await this.$http.delete('admin/delete_admin/' + adminId)
      if (response['data']['meta']['msg'] === '删除成功') {
        this.$message.success('删除成功!')
        this.getAdminList()
      } else {
        this.$message.error('删除失败，请重新登录再进行尝试')
      }
    },
    // 获取用于渲染页面的数据
    async getAdminList() {
      // query 查询参数 可以为空
      // pagenum 当前页码 不能为空
      // pagesize 每页显示条数 不能为空
      // http://localhost:8181/admin/retrieve_admin?query=gmail&page_num=1&page_size=10
      const response = await this.$http.get(
        'admin/retrieve_admin?query=' +
          this.query +
          '&page_num=' +
          this.pagenum +
          '&page_size=' +
          this.pagesize
      )
      // console.log(response)
      if (response['data']['meta']['msg'] === '获取成功') {
        // 1.用数据渲染表格
        this.adminTable = response['data']['data']['admin_list']
        // 2.将数据的总记录数赋值给total
        this.total = response['data']['data']['total']
      } else {
        // 数据获取失败
        this.$message.warning(response['data']['meta']['msg'])
      }
    },
    // 控制每页几条数据
    handleSizeChange(val) {
      this.pagesize = val
      this.getAdminList()
      // console.log(`每页 ${val} 条`)
    },
    // 控制当前所在页
    handleCurrentChange(val) {
      this.pagenum = val
      this.getAdminList()
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
