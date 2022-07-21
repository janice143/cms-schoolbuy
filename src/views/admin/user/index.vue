<template>
  <div class="app-container">
    <el-form inline>
      <!-- 表单元素 -->
      <el-form-item>
         <el-input v-model="tempSearchObj.username" placeholder="用户名" />
      </el-form-item>
      <!-- 查询与情况的按钮 -->
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button type="default" @click="resetSearch">清空</el-button>
    </el-form>

    <div style="margin-bottom: 20px">
      <!-- 添加与批量添加按钮 -->
      <el-button type="primary" @click="showAddUser">添 加</el-button>
      <el-button type="danger" :disabled="selectedIds.length===0" @click="revomveUsers"
        >批量删除</el-button>
    </div>

    <!-- table表格：展示用户信息的地方 -->
    <el-table
      border
      stripe
      v-loading="listLoading"
      :data="users"
      @selection-change="handleSelectionChange"
      >
      <el-table-column
        type="selection"
        width="55" />

      <el-table-column
        type="index"
        label="序号"
        width="55"
        align="center"
      />

      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="studentnumber" label="学号" width="180"/>
      <el-table-column prop="phone" label="手机号" width="180"/>
      <el-table-column prop="place" label="宿舍" width="180"/>
      <el-table-column prop="userGoods.length" label="用户商品量" width="180"/>

      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="{row}">
         
          <HintButton type="primary" size="mini" icon="el-icon-edit" title="修改用户" @click="showUpdateUser(row)" :disabled="row.username==='admin'"
            />
          <el-popconfirm :title="`确定删除 ${row.username} 吗?`" @onConfirm="removeUser(row._id)">
            <HintButton style="margin-left:10px" slot="reference" type="danger" size="mini" icon="el-icon-delete" title="删除用户" :disabled="row.username==='admin'"/>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page="pageNo"
      :total="totalCount"
      :page-size="pageSize"
      :page-sizes="[3, 10, 20, 30, 40, 50, 100]"
      style="padding: 20px 0;"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getUsers"
      @size-change="handleSizeChange"
    /> 

    <!-- 对话框的结构 -->
    <el-dialog :title="user._id ? '修改用户' : '添加用户'" :visible.sync="dialogUserVisible">
      <el-form ref="userForm" :model="user" :rules="userRules" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username"/>
        </el-form-item> 
        <!-- 手机号，寝室，学号可以不填，如果要用后台系统，一定要填 -->
        <el-form-item label="手机号" >
          <el-input v-model="user.phone"/>
        </el-form-item> 
        <el-form-item label="学号" >
          <el-input v-model="user.studentnumber"/>
        </el-form-item> 
        <el-form-item label="寝室" >
          <!--  -->
          <!-- <el-input v-model="user.place"/> -->
          <el-select
          placeholder="请选择"
          v-model="user.place"
        >
          <el-option
            :label="c1"
            :value="c1"
            v-for="(c1,idx) in places"
            :key="idx"
          ></el-option>
        </el-select>
        </el-form-item> 
        
        <el-form-item v-if="!user._id" label="用户密码" prop="password">
          <el-input v-model="user.password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog> 


  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'UserList',
  data () {
    return {
      places:["桃源公寓","杏园公寓","初阳公寓","桂苑公寓","启明公寓","留学生公寓"],
      listLoading: false, // 是否显示列表加载的提示
      searchObj: { // 包含请求搜索条件数据的对象
        username: ''
      },
      tempSearchObj: { // 收集搜索条件输入的对象
        username: ''
      },
      selectedIds: [], // 所有选择的user的id的数组
      users: [], // 当前页的用户列表

      pageNo: 1, // 当前页码
      pageSize: 3, // 每页数量
      totalCount: 0, // 总数量

      user: {}, // 当前要操作的user
      dialogUserVisible: false, // 是否显示用户添加/修改的dialog
      
      userRules: { // 用户添加/修改表单的校验规则
        username: [
          { required: true, message: '用户名必须输入' },
          { min: 3, message: '用户名不能小于3位' }
        ],
        password: [
          { required: true, validator: this.validatePassword }
        ]
      },
      loading: false, // 是否正在提交请求中
      dialogRoleVisible: false, // 是否显示角色Dialog
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      isIndeterminate: false, // 是否是不确定的
      checkAll: false, // 是否全选

      
    }
  },

  //发请求一般情况下，我们都是在mounted去发，但是也可以在created内部去发
  created () {
    this.getUsers()
  },


  methods: {
    /* 获取分页列表*/
    async getUsers (pageNo = 1) {
      this.pageNo = pageNo
      const {pageSize, searchObj} = this

      // this.listLoading = true
      const result = await this.$API.adminUser.getPageList(pageNo, pageSize, searchObj)
      console.log(result)
      this.listLoading = false
      const {userlist, totalCount} = result.data
      this.users = userlist
      // console.log(this.users)
      this.totalCount = totalCount
      this.selectedIds = []
    },
    /* 处理pageSize发生改变的监听回调 */
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getUsers()
    },
    /* 根据输入进行搜索*/
    search () {
      this.searchObj = {...this.tempSearchObj}
      this.getUsers()
    },
    /* 重置输入后搜索*/
    resetSearch () {
      this.searchObj = {
        username: ''
      }
      this.tempSearchObj = {
        username: ''
      }
      this.getUsers()
    },
    // 点击添加用户
    showAddUser(){
      this.user = {}
      this.dialogUserVisible = true

      // this.$nextTick(() => this.$refs.userForm.clearValidate())
    },
    /*自定义密码校验*/
    validatePassword (rule, value, callback) {
      if (!value) {
        callback('密码必须输入')
      } else if (!value || value.length < 6) {
        callback('密码不能小于6位')
      } else {
        callback()
      }
    },
    /* 取消用户的保存或更新*/
    cancel () {
      this.dialogUserVisible = false
      this.user = {}
    },
    /* 保存或者更新用户 */
    addOrUpdate () {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          const {user} = this
          this.loading = true
          this.$API.adminUser[user._id ? 'update' : 'add'](user).then((result) => {
            // console.log(result)
            this.loading = false
            this.$message.success('保存成功!')
            this.getUsers(user._id ? this.pageNo : 1)
            this.user = {}
            this.dialogUserVisible = false
          })
        }
      })
    },
    /* 显示更新用户的界面*/
    showUpdateUser (user) {
      // 两种方式可以实现深拷贝，不能直接this.user = user赋值
      this.user = cloneDeep(user)
      // this.user = {...user}
      // console.log(this.user)
      this.dialogUserVisible = true
    },
    // 删除用户
    async removeUser(id){
      const result = await this.$API.adminUser.removeById(id)
      if(result.code === 200){
        this.$message.success('删除成功')
        this.getUsers(this.users.length === 1 ? this.pageNo-1 : this.pageNo)
      }
      
    },
    // check批量删除
    handleSelectionChange (selection) { 
      this.selectedIds = selection.map(item => item._id)
      // console.log(this.selectedIds)
    },

    // 批量删除所有选中的用户
    revomveUsers () {
      this.$confirm('确定删除吗?').then(async () => {
        const result = await this.$API.adminUser.removeUsers(this.selectedIds)
        // console.log(result)
        if(result.code === 200){
          this.$message.success('删除成功')
          this.getUsers()
        }
        
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },

  }
}
</script>
