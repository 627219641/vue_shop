<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 卡片试图区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>

      </el-row>
      <!-- 用户列表区域 -->

      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" center @close="addDialogClose">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用戶对话框" :visible.sync="editDialogVisible" width="50%" center @close="editDialogClose">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUsers(editForm.id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 校验邮箱规则
    const checkEmail = (rule, value, next) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return next()
      }
      next(new Error('请输入正确的邮箱'))
    }

    return {
      //
      userlist: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      // 控制添加對話框的顯示与隐藏
      addDialogVisible: false,
      // 添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
          { max: 10, min: 3, message: '用户名的长度在3-10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
          { max: 15, min: 6, message: '密码的长度在3-10个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
          {
            trigger: 'blur',
            validator: checkEmail
          }
        ],
        mobile: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
          { max: 15, min: 6, message: '手机号码长度不对', trigger: 'blur' }
        ]
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑用户
      editName: '',
      editForm: {
        id: '',
        email: '',
        mobile: ''
      },
      editDialogVisible: false
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 监听swich开关的改变
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('更新用户状态失败')
        userInfo.mg_state = !userInfo.mg_state
        return
      }
      this.$message.success('更新用户状态成功')
    },
    addUser() {
      this.addDialogVisible = true
    },
    // 对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUsers() {
      this.$refs.addFormRef.validate(async vali => {
        if (!vali) {
          return
        }
        // 请求
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加用戶失敗')
        }
        this.$message.success('添加用戶成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    edit(row) {
      // 首先赋值
      this.editName = row.username
      this.editDialogVisible = true
      this.editForm.id = row.id
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    editUsers(id) {
      this.$refs.editFormRef.validate(async vali => {
        if (!vali) {
          return
        }
        // 请求
        const { data: res } = await this.$http.put(`users/${id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('编辑用户失败')
          return
        }
        this.editDialogVisible = false
        this.$message.success('编辑用户成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },

    // 删除用户
    removeUserById(id) {
      console.log(id)
      this.$messagebox('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.$http.delete('users/' + id)
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // })
        })
        .then(({ data: res }) => {
          // const { data: res } = res1
          console.log(res)
          if (res.meta.status !== 200) {
            this.$message({
              type: 'error',
              message: '删除失敗!'
            })
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getUserList()
          }
        })
        .catch(e => {
          console.log(e)
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },

  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
