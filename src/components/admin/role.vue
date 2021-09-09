<template>
  <div>
    <el-card>
      <!-- 1.面包屑 -->
      <my-bread level1="管理员" level2="角色列表"></my-bread>
      <el-row class="AddRole_Btn">
        <el-col align="left">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="add_role()">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
        empty-text="服务器请求超时"
        :data="role_list"
        style="width: 100%"
        stripe
        height="550"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column type="expand" width="150">
          <template slot-scope="scope">
            <!-- 权限行 -->
            <el-row
              v-for="(value, key, index) in scope.row.auth_dict"
              :key="index"
            >
              <!-- 标签：文章管理、用户管理等 -->
              <el-col v-show="value.length !== 0" align="center" :span="9">
                <el-tag
                  @close="deleteAuth(scope.row, value, 'parent')"
                  closable
                  >{{ key }}</el-tag
                >
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!-- 文章管理子节点 -->
              <el-col :span="15">
                <el-row>
                  <el-col :span="24">
                    <el-tag
                      @close="deleteAuth(scope.row, value1, 'children')"
                      closable
                      type="warning"
                      v-for="(value1, key1, index1) in value"
                      :key="index1"
                      >{{ value1.auth_name }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <span
              v-if="
                scope.row.auth_dict.文章管理.length === 0 &&
                scope.row.auth_dict.用户管理.length === 0 &&
                scope.row.auth_dict.管理员.length === 0 &&
                scope.row.auth_dict.食材管理.length === 0
              "
              >未分配权限</span
            >
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="180"> </el-table-column>
        <el-table-column prop="role_name" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="role_desc" label="角色描述"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="270">
          <template slot-scope="scope"  v-if="scope.row.role_name !== '超级管理员'">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" circle @click="edit_role(scope.row)"></el-button>
            <!-- 删除按钮 -->
            <el-popconfirm
              title="确定删除此角色吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              @confirm="delete_role(scope.row.role_id)"
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
              @click="showDistributeAuthDialog(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialog"
      append-to-body
      :show-close="false">
      <el-form :model="role">
        <el-form-item>
          <el-input
            type="text"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入角色名"
            v-model="role.role_name"
            maxlength="10"
            show-word-limit
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="textarea"
            placeholder="角色描述"
            v-model="role.role_desc"
            maxlength="50"
            show-word-limit
            autocomplete="off"
            autosize>
            </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd()">取 消</el-button>
        <el-button type="primary" @click="confirmAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialog"
      append-to-body
      :show-close="false">
      <el-form :model="role">
        <el-form-item>
          <el-input
            type="text"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入角色名"
            v-model="role.role_name"
            maxlength="10"
            show-word-limit
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="textarea"
            placeholder="角色描述"
            v-model="role.role_desc"
            maxlength="50"
            show-word-limit
            autocomplete="off"
            autosize>
            </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit()">取 消</el-button>
        <el-button type="primary" @click="confirmEdit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改权限对话框 -->
    <el-dialog
      title="修改权限"
      :visible.sync="distributeAuthDialog"
      append-to-body
      :show-close="false">
      <el-tree
        ref="tree"
        empty-text="服务器请求失败"
        :data="auth_tree"
        show-checkbox
        node-key="auth_id"
        :default-expand-all="true"
        :default-checked-keys="properties"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDistribute()">取 消</el-button>
        <el-button type="primary" @click="confirmDistribute()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 添加角色对话框
      addRoleDialog: false,
      // 添加角色、编辑角色对话框表单用到的角色对象
      role: {
        role_name: '',
        role_desc: ''
      },
      // 编辑角色对话框
      editRoleDialog: false,
      // 角色列表
      role_list: [],
      // 当前角色的id
      current_role_id: -1,
      // 修改权限对话框
      distributeAuthDialog: false,
      // 已拥有权限的列表
      properties: [],
      // 权限树
      auth_tree: [
        // {
        //   auth_id: 1,
        //   auth_name: '管理员',
        //   auth_path: '',
        //   auth_parent: '',
        //   auth_desc: '0',
        //   children: [
        //     {
        //       auth_id: 2,
        //       auth_name: '成员列表',
        //       auth_path: 'admin',
        //       auth_parent: '管理员',
        //       auth_desc: '1'
        //     }
        //   ]
        // }
      ],
      defaultProps: {
        children: 'children',
        label: 'auth_name'
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 添加角色按钮
    add_role() {
      this.role.role_name = ''
      this.role.role_desc = ''
      this.addRoleDialog = true
    },
    // 添加角色对话框“取消”按钮
    cancelAdd() {
      this.addRoleDialog = false
    },
    // 添加角色对话框“确定”按钮
    confirmAdd() {
      if (this.role.role_name === '' || this.role.role_desc === '') {
        this.$message.error('文本框不能为空')
      } else {
        this.$http.post('role/add_role', this.role).then(response => {
          if (response.data.meta.msg === '添加成功') {
            this.$message.success(response.data.meta.msg)
            this.addRoleDialog = false
            this.getRoleList()
          } else {
            this.$message.error(response.data.meta.msg)
            this.role.role_name = ''
            this.role.role_desc = ''
          }
        })
      }
    },
    // 编辑角色按钮
    edit_role(role) {
      this.editRoleDialog = true
      this.role.role_name = role.role_name
      this.role.role_desc = role.role_desc
      this.current_role_id = role.role_id
    },
    // 编辑角色对话框“取消”按钮
    cancelEdit() {
      this.editRoleDialog = false
    },
    // 编辑角色对话框“确定”按钮
    confirmEdit() {
      if (this.role.role_name === '' || this.role.role_desc === '') {
        this.$message.error('文本框不能为空')
      } else {
        this.$http.put('role/edit_role/' + this.current_role_id, this.role).then(response => {
          if (response.data.meta.msg === '修改成功') {
            this.$message.success(response.data.meta.msg)
            this.editRoleDialog = false
            this.getRoleList()
          } else {
            this.$message.error(response.data.meta.msg)
          }
        })
      }
    },
    // 删除角色按钮
    delete_role(RoleId) {
      this.$http.delete('role/delete_role/' + RoleId).then(response => {
        if (response.data.meta.msg === '删除成功') {
          this.$message.success(response.data.meta.msg)
          this.getRoleList()
        } else {
          this.$message.error('服务器请求失败，请重新登录后再次尝试')
          this.getRoleList()
        }
      })
    },
    // "打开"修改权限的对话框
    showDistributeAuthDialog(role) {
      // 获取所有权限及已拥有的权限，并且将已拥有的权限打勾
      this.current_role_id = role.role_id
      this.$http.get('auth/modify_auth/' + role.role_id).then(response => {
        // 已拥有的权限，即打勾的数组
        this.properties = response.data.data.properties
        // 所有权限的权限树
        this.auth_tree = response.data.data.data_list
      })
      // "显现"修改权限对话框
      this.distributeAuthDialog = true
    },
    // 修改权限对话框的"确定"按钮
    confirmDistribute() {
      var CheckList = {
        check_list: this.$refs.tree.getCheckedKeys()
      }
      this.$http.put('auth/modify_auth/' + this.current_role_id, CheckList).then(response => {
        if (response.data.meta.msg === '分配权限成功') {
          this.$message.success(response.data.meta.msg)
        } else {
          this.$message.error('服务器请求失败，请重新登录后再次尝试')
        }
      })
      // "关闭"修改权限对话框
      this.distributeAuthDialog = false
    },
    // 修改权限对话框的"取消"按钮
    cancelDistribute() {
      this.distributeAuthDialog = false
    },
    // 取消权限
    deleteAuth(row, auth, object) {
      switch (object) {
        case 'parent':
          this.$http
            .delete(
              'role/delete_role_auth/' +
                row.role_id +
                '/' +
                object +
                '/' +
                auth[0].auth_parent
            )
            .then(response => {
              if (response['data']['meta']['msg'] === '取消权限成功') {
                this.role_list[this.role_list.indexOf(row)].auth_dict[auth[0].auth_parent].splice(this.role_list[this.role_list.indexOf(row)].auth_dict[auth[0].auth_parent], this.role_list[this.role_list.indexOf(row)].auth_dict[auth[0].auth_parent].length
                )
                this.$message.success(response['data']['meta']['msg'])
              } else {
                this.$message.error('请求失败,请重新登录再进行尝试')
              }
            })
          break
        case 'children':
          this.$http
            .delete(
              'role/delete_role_auth/' +
                row.role_id +
                '/' +
                object +
                '/' +
                auth.auth_id
            )
            .then(response => {
              if (response['data']['meta']['msg'] === '取消权限成功') {
                this.role_list[this.role_list.indexOf(row)].auth_dict[auth.auth_parent].splice(this.role_list[this.role_list.indexOf(row)].auth_dict[auth.auth_parent].indexOf(auth), 1)
                this.$message.success(response['data']['meta']['msg'])
              } else {
                this.$message.error('请求失败,请重新登录再进行尝试')
              }
            })
          break
      }
    },
    async getRoleList() {
      const response = await this.$http.get('role/get_role_auth')
      this.role_list = response['data']['data']
    }
  }
}
</script>

<style>
.AddRole_Btn {
  margin-top: 20px;
}
</style>
