<template>
  <div>
    <el-card>
      <!-- 1.面包屑 -->
      <my-bread level1="管理员" level2="权限列表"></my-bread>
      <!-- 2.表格  -->
      <div class="table-style">
        <el-table
          border
          empty-text="服务器请求超时"
          :data="auth_list"
          stripe
          style="width: 100%"
          height="580"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="auth_name" label="权限名称"> </el-table-column>
          <el-table-column prop="auth_parent" label="属于"> </el-table-column>
          <el-table-column prop="auth_path" label="路径"> </el-table-column>
          <el-table-column label="层级">
            <template slot-scope="scope">
              <span v-if="scope.row.auth_desc === '0'">一级</span>
              <span v-if="scope.row.auth_desc === '1'">二级</span>
              <span v-if="scope.row.auth_desc === '2'">三级</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      auth_list: []
    }
  },
  created() {
    this.getAuthList()
  },
  methods: {
    async getAuthList() {
      const response = await this.$http.get('auth/auth_list')
      this.auth_list = response['data']['data']['auth_list']
    }
  }
}
</script>
<style>
.table-style {
  margin-top: 20px;
}
</style>
