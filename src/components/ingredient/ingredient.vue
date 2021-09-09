<template>
  <div>
    <el-card class="box-card">
      <!-- 1.面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right"
        ><el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>食材管理</el-breadcrumb-item>
        <el-breadcrumb-item>食材列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 2.搜索、添加食材 -->
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
              @click="getIngredientList()"
            ></el-button>
          </el-input>
          <!-- 添加食材 -->
          <el-button type="success" @click="addIngredient()"
            >添加食材</el-button
          >
        </el-col>
      </el-row>
      <!-- 3.表格 -->
      <el-table
        empty-text="服务器请求超时"
        :data="ingredientTable"
        style="width: 100%"
        stripe
        height="500"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column fixed prop="id" type="index" label="#" width="100">
        </el-table-column>
        <el-table-column prop="name" label="食材名称" width="150">
        </el-table-column>
        <el-table-column prop="nickname" label="食材别名" width="290">
        </el-table-column>
        <el-table-column prop="suitable" label="适宜人群" width="320">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="350">
          <template slot-scope="scope">
            <!-- 查看具体信息 -->
            <el-button
              type="info"
              icon="el-icon-view"
              circle
              @click="viewIngredient(scope.row)"
              >详情</el-button
            >
            <!-- 查看菜谱 -->
            <!-- 对菜谱增删改查 -->
            <el-button
              type="warning"
              icon="el-icon-food"
              circle
              @click="checkRecipe(scope.row)"
              >食谱</el-button
            >
            <!-- 编辑食材 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="edit_ingredient(scope.row)"
            ></el-button>
            <!-- 删除食材 -->
            <el-popconfirm
              title="确定删除此成员吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              @confirm="delete_ingredient(scope.row.id)"
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
    <!-- 添加食材对话框 -->
    <el-dialog
      title="添加食材"
      :visible.sync="addIngredientDialog"
      :append-to-body="true"
      :show-close="true"
    >
      <el-form :model="ingredient" label-width="120px">
        <el-form-item label="食材名称">
          <el-input
            type="text"
            v-model="ingredient.name"
            maxlength="10"
            show-word-limit
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="食材介绍">
          <el-input
            type="textarea"
            maxlength="5000"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="ingredient.introduction"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材别名">
          <el-input
            type="textarea"
            maxlength="3000"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="ingredient.nickname"
          ></el-input>
        </el-form-item>
        <el-form-item label="卡路里">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="ingredient.calorie"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材分属类别">
          <el-input
            type="textarea"
            maxlength="3000"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="ingredient.classification"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材做法">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="ingredient.dishes"
          ></el-input>
        </el-form-item>
        <el-form-item label="营养功效">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="ingredient.benefits"
          ></el-input>
        </el-form-item>
        <el-form-item label="适宜人群">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="ingredient.suitable"
          ></el-input>
        </el-form-item>
        <el-form-item label="禁忌人群">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="ingredient.unsuitable"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材标签">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="ingredient.tag"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材的挑选方法">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="ingredient.choose"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材的存储方法">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="ingredient.storage"
          ></el-input>
        </el-form-item>
        <el-form-item label="食物相克">
          <el-input
            type="textarea"
            maxlength="5000"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="ingredient.conflict"
          ></el-input>
        </el-form-item>
        <el-form-item label="食物搭配">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="ingredient.mate"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmAdd()">添加</el-button>
        <el-button @click="addIngredientDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 食材详情对话框 -->
    <el-dialog
      top="1vh"
      :visible.sync="viewIngredientDialog"
      append-to-body
      :show-close="true"
    >
      <div slot="title">
        <i class="el-icon-food"></i>
        <span class="title-text">{{ ingredient.name }}详情：</span>
      </div>
      <el-collapse accordion>
        <el-collapse-item title="食材介绍">
          <div>
            {{ ingredient.introduction }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="食材别名">
          <div>
            {{ ingredient.nickname }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="卡路里">
          <div>{{ ingredient.calorie }}</div>
        </el-collapse-item>
        <el-collapse-item title="食材分属类别">
          <div>
            {{ ingredient.classification }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="食材做法">
          <div>
            {{ ingredient.dishes }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="营养功效">
          <div>
            {{ ingredient.benefits }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="适宜人群">
          <div>
            {{ ingredient.suitable }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="禁忌人群">
          <div>
            {{ ingredient.unsuitable }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="食材标签">
          <div>
            {{ ingredient.tag }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="食材的挑选方法">
          <div>
            {{ ingredient.choose }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="食材的存储方法">
          <div>
            {{ ingredient.storage }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="食物相克">
          <div>
            {{ ingredient.conflict }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="食物搭配">
          <div>
            {{ ingredient.mate }}
          </div>
        </el-collapse-item>
      </el-collapse></el-dialog
    >
    <!-- 查看菜谱对话框 -->
    <el-dialog
      :visible.sync="recipeDialog"
      append-to-body
      :show-close="true"
      width="55%"
    >
      <div slot="title">
        <i class="el-icon-tableware"></i>
        <span class="title-text">{{ ingredient.name }}菜谱：</span>
        <!-- <br />
        <span>
          <el-button type="success" icon="el-icon-circle-plus">添加</el-button>
        </span> -->
      </div>
      <el-row>
        <div v-if="recipes.length === 0">该食材暂未添加食谱</div>
        <el-col :span="24" v-for="(recipe, i) in recipes" :key="i">
          <el-card align="center">
            <el-image
              :src="recipe.picture_link"
              alt="服务器请求超时"
              fit="contain"
              lazy
            ></el-image>
            <!-- <img
              src="http://47.98.201.222:8080/ingredients/img/onion/Saute_shredded_pork_with_onion.jpg"
              alt="服务器请求超时"
              fit="contain" /> -->
            <div>
              <span>{{ recipe.recipe_name }}</span>
              <div>
                <el-link :href="recipe.url" target="_blank" type="primary"
                  >查看<i class="el-icon-view el-icon--right"></i
                ></el-link>
                <el-link type="danger" @click="delete_recipe(recipe.recipe_id)"
                  >删除<i class="el-icon-remove"></i
                ></el-link>
              </div></div
          ></el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col align="center">
          <el-link type="success" @click="add_recipe()"
            >添加<i class="el-icon-circle-plus"></i></el-link
        ></el-col>
      </el-row>
    </el-dialog>
    <!-- 添加菜谱对话框 -->
    <el-dialog
      :visible.sync="addRecipeDialog"
      append-to-body
      :show-close="false"
    >
      <div slot="title">
        <i class="el-icon-circle-plus-outline"></i>
        <span class="title-text">添加一个“{{ ingredient.name }}”新菜</span>
      </div>
      <el-form :model="add" label-width="75px">
        <el-form-item label="菜名：">
          <el-input v-model="add.recipe_name"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="菜谱封面:">
          <br />
          <el-upload
            ref="upload"
            :auto-upload="false"
            :action="imageUploadUrl"
            class="upload-demo"
            accept="image/jpeg,image/jpg,image/png,image/JPG"
            :on-preview="handlePreview"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            list-type="picture"
            :on-success="handleSuccess"
          >
            <el-button size="small" type="primary">选择图片</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png/jpeg文件，且不超过2M
            </div>
          </el-upload>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="做法链接:">
          <el-input v-model="add.url" type="url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmAddRecipe()">添加</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form></el-dialog
    >
    <!-- 查看图片对话框 -->
    <el-dialog :visible.sync="imageDialog" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="出错啦" />
    </el-dialog>
    <!-- 编辑食材对话框 -->
    <el-dialog
      :visible.sync="editIngredientDialog"
      :append-to-body="true"
      :show-close="true"
      fullscreen
    >
      <div slot="title">
        <i class="el-icon-edit-outline"></i>
        <span class="title-text">编辑“{{ editIngredient.name }}”</span>
      </div>
      <el-form :model="editIngredient" label-width="120px">
        <el-form-item label="食材名称">
          <el-input
            type="text"
            v-model="editIngredient.name"
            maxlength="10"
            show-word-limit
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="食材介绍">
          <el-input
            type="textarea"
            maxlength="5000"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="editIngredient.introduction"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材别名">
          <el-input
            type="textarea"
            maxlength="3000"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="editIngredient.nickname"
          ></el-input>
        </el-form-item>
        <el-form-item label="卡路里">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="editIngredient.calorie"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材分属类别">
          <el-input
            type="textarea"
            maxlength="3000"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="editIngredient.classification"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材做法">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="editIngredient.dishes"
          ></el-input>
        </el-form-item>
        <el-form-item label="营养功效">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="editIngredient.benefits"
          ></el-input>
        </el-form-item>
        <el-form-item label="适宜人群">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="editIngredient.suitable"
          ></el-input>
        </el-form-item>
        <el-form-item label="禁忌人群">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="editIngredient.unsuitable"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材标签">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="editIngredient.tag"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材的挑选方法">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="editIngredient.choose"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材的存储方法">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="editIngredient.storage"
          ></el-input>
        </el-form-item>
        <el-form-item label="食物相克">
          <el-input
            type="textarea"
            maxlength="5000"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="editIngredient.conflict"
          ></el-input>
        </el-form-item>
        <el-form-item label="食物搭配">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            autocomplete="off"
            clearable
            v-model="editIngredient.mate"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commit_edit()">提交</el-button>
        <el-button @click="cancel_edit()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 搜索框内容绑定
      query: '',
      pagesize: 6, // 每页显示6条记录
      pagenum: 1, // 当前页码
      total: 0, // 总共多少条数据
      // 食材表格
      ingredientTable: [
        // {
        //   id: 1,
        //   name: '香菇',
        //   nickname: '冬菇',
        //   suitable: '爱吃的人'
        // }
      ],
      // 添加食材对话框
      addIngredientDialog: false,
      // 食材实体
      ingredient: {
        id: null,
        name: '',
        introduction: '',
        nickname: '',
        calorie: '',
        classification: '',
        dishes: '',
        benefits: '',
        suitable: '',
        unsuitable: '',
        tag: '',
        weight: 0,
        choose: '',
        storage: '',
        conflict: '',
        mate: ''
      },
      // 食材详情对话框
      viewIngredientDialog: false,
      // 操作菜谱对话框
      recipeDialog: false,
      // 菜谱
      recipes: [],
      // 添加菜谱对话框
      addRecipeDialog: false,
      // 添加菜谱对话框里的每一道菜
      recipe: {
        recipe_id: -1,
        recipe_name: '',
        picture_link: '',
        url: ''
      },
      // 添加菜谱里用于传给后端的菜谱对象
      add: {
        recipe_name: '',
        picture_link: '',
        url: ''
      },
      // 上传文件列表
      fileList: [
        // {
        //   name: '洋葱炒肉丝.jpg',
        //   url:
        //     'http://47.98.201.222:8080/ingredients/img/onion/Saute_shredded_pork_with_onion.jpg'
        // }
      ],
      // 查看图片对话框
      imageDialog: false,
      // 查看图片对话框的图片链接
      dialogImageUrl: '',
      // 添加食谱时上传图片的接口的路径
      imageUploadUrl: 'http://localhost:8181/food/upload_img/',
      // 编辑食材对话框
      editIngredientDialog: false,
      editIngredient: {
        id: null,
        name: '',
        introduction: '',
        nickname: '',
        calorie: '',
        classification: '',
        dishes: '',
        benefits: '',
        suitable: '',
        unsuitable: '',
        tag: '',
        weight: 0,
        choose: '',
        storage: '',
        conflict: '',
        mate: ''
      }
    }
  },
  created() {
    this.getIngredientList()
  },
  methods: {
    // 检索功能
    async getIngredientList() {
      const response = await this.$http.get(
        'food/retrieve_ingredient?query=' +
          this.query +
          '&page_num=' +
          this.pagenum +
          '&page_size=' +
          this.pagesize
      )
      if (response['data']['meta']['msg'] === '获取成功') {
        this.ingredientTable = response['data']['data']['ingredient_list']
        this.total = response['data']['data']['total']
      } else {
        this.$message.warning(response['data']['meta']['msg'])
      }
    },
    // 添加食材
    addIngredient() {
      // 每次打开添加食材对话框都将所有属性的赋值为空
      for (const key in this.ingredient) {
        if (key !== 'id' && key !== 'weight') {
          this.ingredient[key] = ''
        }
        // console.log(this.ingredient.hasOwnProperty(key))
        // true
      }
      this.addIngredientDialog = true
    },
    // 确定添加食材
    async confirmAdd() {
      if (this.ingredient.name === '' || this.ingredient.name === null) {
        this.$message.error('请输入食材名称')
      } else {
        const response = await this.$http.post(
          'food/add_ingredient',
          this.ingredient
        )
        if (response['data']['meta']['msg'] === '添加成功') {
          this.$message.success(response['data']['meta']['msg'])
          this.addIngredientDialog = false
          this.getIngredientList()
        } else {
          this.$message.error(response['data']['meta']['msg'])
          this.getIngredientList()
        }
      }
    },
    // 查看食材详情
    viewIngredient(ingredient) {
      this.ingredient = ingredient
      this.viewIngredientDialog = true
    },
    // 获取所有食谱
    async refresh_recipes() {
      const response = await this.$http.get(
        'food/get_recipes/' + this.ingredient.id
      )
      if (response['data']['meta']['msg'] === '获取成功') {
        this.recipes = response['data']['data']
      }
    },
    // 操作食谱
    async checkRecipe(ingredient) {
      this.ingredient = ingredient
      this.refresh_recipes()
      this.recipeDialog = true
    },
    // 添加食谱
    add_recipe() {
      this.imageUploadUrl = 'http://localhost:8181/food/upload_img'
      // this.imageUploadUrl += this.ingredient.id
      // console.log(this.ingredient)
      this.add.recipe_name = ''
      this.add.picture_link = ''
      this.add.url = ''
      this.addRecipeDialog = true
    },
    // 文件上传成功
    async handleSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      // console.log(URL.createObjectURL(file.raw))
      if (res['meta']['msg'] === '文件上传成功') {
        this.add.picture_link = res['data']['filename']
        const response = await this.$http.post(
          'food/add_recipe/' + this.ingredient.id,
          this.add
        )
        if (response['data']['meta']['msg'] === '添加成功') {
          this.addRecipeDialog = false
          this.refresh_recipes()
          this.$message.success(response['data']['meta']['msg'])
        }
      } else {
        this.$message.error(res['data']['meta']['msg'])
      }
      // console.log(file)
    },
    // 点击已上传文件
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.imageDialog = true
      // console.log(file)
    },
    // 文件超出个数限制
    handleExceed(files, fileList) {
      // this.$message.warning(
      //   `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
      //     files.length + fileList.length
      //   } 个文件`
      // )
      this.$message.warning('只允许上传一张照片')
    },
    // 删除文件之前
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 上传文件之前
    beforeUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' || 'image/jpg' || 'image/png' || 'image/JPG'
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是jpeg、jpg、png、JPG格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 确定上传
    confirmAddRecipe() {
      if (
        this.add.recipe_name === '' ||
        this.add.recipe_name === null ||
        this.add.url === '' ||
        this.add.url === null
      ) {
        this.$message.warning('请将信息补充完整')
      } else {
        this.$refs.upload.submit()
      }
    },
    // 删除菜谱
    delete_recipe(RecipeId) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const response = await this.$http.delete(
            'food/delete_recipe/' + RecipeId
          )
          if (response['data']['meta']['msg'] === '删除成功') {
            this.$message.success(response['data']['meta']['msg'])
            this.refresh_recipes()
          }
        })
        .catch(() => {})
    },
    // 编辑食材
    async edit_ingredient(ingredient) {
      this.editIngredient = ingredient
      this.editIngredientDialog = true
    },
    // 提交修改后的食材
    async commit_edit() {
      const response = await this.$http.put(
        'food/edit_ingredient',
        this.editIngredient
      )
      if (response['data']['meta']['msg'] === '修改成功') {
        this.$message.success(response['data']['meta']['msg'])
        this.editIngredientDialog = false
        this.getIngredientList()
      } else {
        this.$message.error('修改失败，请重新登录后再试')
        this.getIngredientList()
      }
    },
    // 取消修改食材
    cancel_edit() {
      this.$confirm('您已修改过的内容将不会被保存，确定取消修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.getIngredientList()
          this.editIngredientDialog = false
        })
        .catch(() => {
        })
    },
    // 控制每页几条数据
    handleSizeChange(val) {
      this.pagesize = val
      this.getIngredientList()
      // console.log(`每页 ${val} 条`)
    },
    // 控制当前所在页
    handleCurrentChange(val) {
      this.pagenum = val
      this.getIngredientList()
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
</style>
