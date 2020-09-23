<template>
  <div class="container">
    <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
      </div>
      <el-form
        ref="formInline"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-input
            v-model="formInline.name"
            placeholder="请输入业主名称   "
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="formInline.idCardNo"
            placeholder="请输入业主身份证号   "
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="formInline.mobilePhone"
            placeholder="请输入联系方式   "
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="onSubmit('formInline')"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="container_tw">
      <div class="tw_title">
        <p>物业列表</p>
        <!--右边按钮  -->
        <div class="tools-right">
          <el-button
            type="success"
            icon="el-icon-circle-plus-outline"
            @click="add"
          >添加</el-button>
        </div>
        <!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
      </div>
      <div class="tw_form">
        <el-table
          :data="tableData"
          style="width: 100%"
          class="table"
          height="calc(100vh - 420px)"
        >
          <el-table-column
            prop="name"
            label="姓名"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="age"
            label="年龄"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="idCardNo"
            label="身份证"
            width="280"
          ></el-table-column>
          <el-table-column
            prop="mobilePhone"
            label="电话"
            width="250"
          ></el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="250"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="bindingRooms(scope.row)"
              >绑定房间</el-button>
              <el-button
                size="mini"
                @click="untieRoom( scope.row)"
              >解绑房间</el-button>
              <el-button
                size="mini"
                @click="handleEdit( scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                @click="ownerMember( scope.row)"
              >业主成员</el-button>
              <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div
          class="block"
          style="text-align:center; margin-top:2em"
        >
          <el-pagination
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 弹出框 -->
    <el-dialog
      :title="dltitle"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="140px"
        label-position="left"
      >
        <el-form-item
          label="姓名:"
          prop="name"
        >
          <el-input
            v-model="form.name"
            style="width:100%"
            placeholder="必填，请填写姓名"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="性别:"
          prop="sex"
        >
          <el-select
            v-model="form.sex"
            style="width:100%"
            placeholder="请选择业主性别"
          >
            <el-option
              v-for="item in sexList"
              :key="item.key"
              :label="item.codeName"
              :value="item.key"
              style="width:100%"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="出生日期:"
          prop="birth"
        >
          <el-date-picker
            v-model="form.birth"
            style="width:100%"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="移动电话:"
          prop="mobilePhone"
        >
          <el-input
            v-model="form.mobilePhone"
            style="width:100%"
            placeholder="必填，请填写电话"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱:"
          prop="email"
        >
          <el-input
            v-model="form.email"
            style="width:100%"
            placeholder="可选，请填写邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="身份证:"
          prop="idCardNo"
        >
          <el-input
            v-model="form.idCardNo"
            style="width:100%"
            placeholder="必填，请填写身份证"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="照片:"
          prop="photo"
        >
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handlePhotoSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="form.photo"
              :src="form.photo"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
        </el-form-item>

        <el-form-item
          label="备注:"
          prop="remark"
        >
          <el-input
            v-model="form.remark"
            type="textarea"
            style="width:200px"
            placeholder="小区描述"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="dltitle=='添加业主'"
            type="success"
            @click="addquarters('form')"
          >确定</el-button>
          <el-button
            v-if="dltitle=='编辑信息'"
            type="success"
            @click="editquarters('form')"
          >确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import moment from 'moment'
import { addowner, editowner, getDetailowner, getOwnerList } from '@/api/owner'
import { validEmail, validIdCard, validTelephone } from '@/utils/validate'
import { getCommonList } from '@/api/common'
// import { dateFormat } from '@/utils/validate'
// import { date } from 'jszip/lib/defaults'

export default {
  name: 'OwnerIinformation',
  data() {
     var checkEmail = (rule, value, callback) => {
      if (validEmail(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    };
    var checkIdCard = (rule, value, callback) => {
      if (validIdCard(value)) {
        return callback()
      }
      callback(new Error('请输入合法身份证'))
    };
     var checkTelephone = (rule, value, callback) => {
      if (validTelephone(value)) {
        return callback()
      }
      callback(new Error('请输入有效手机号'))
    };

    return {
      input: '',
      tableData: [],
      formInline: {},
      sexList: [], // 性别
      pageSize: 10,
      pageNum: 1,
      total: 0,
      dialogVisible: false,
      Propertyoptions: [],
      dltitle: '',
      imageUrl: '',
      form: {
        birth: '',
        email: '',
        idCardNo: '',
        mobilePhone: '',
        name: '',
        photo: '',
        remark: '',
        sex: '',
        id: ''
      },
      // 邮箱校验、
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
          // { validator: checkEmail, trigger: 'blur' }
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        birth: [{ required: true, message: '请选择出生日期', trigger: 'blur' }],
        mobilePhone: [
          { required: true, message: '请填写联系方式', trigger: 'blur' },
           { validator: checkTelephone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        idCardNo: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
           { validator: checkIdCard, trigger: 'blur' }
        ],
        photo: [{ required: false, message: '请上传照片', trigger: 'blur' }],
        remark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getCommon()
  },
  methods: {
    getList() {
      const params = {
        name: this.formInline.name,
        idCardNo: this.formInline.idCardNo,
        mobilePhone: this.formInline.mobilePhone,
        pageSize: this.pageSize,
        pageNo: this.pageNum
        // id: this.id
      }
      getOwnerList(params).then(response => {
        this.tableData = response.data.dataList
        this.total = response.data.total
      })
    },
    cancel(formName) {
      this.$refs[formName].clearValidate()
      this.dialogVisible = false
    },
    handleEdit(row) {
      // debugger
      console.log(row)
      this.dltitle = '编辑信息'
      getDetailowner(row.id)
        .then(response => {
          console.log(response)
          this.form = response.data
          this.dialogVisible = true
          // this.Propertyoptions = response.data;
        })
        .catch(error => {
          console.log(error)
        })
    },

    onSubmit() {
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getList()
    },
    add() {
      this.form = {
        birth: '',
        email: '',
        idCardNo: '',
        mobilePhone: '',
        name: '',
        photo: '12121212',
        remark: '',
        sex: '',
        id: ''
      }
      this.dltitle = '添加业主'
      this.dialogVisible = true
    },
    addquarters(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form)
          this.form.birth = +new Date(this.form.birth)
          // this.form.birth = dateFormat('YYYY-mm-dd hh:mm:ss', this.form.birth)
          addowner(this.form)
            .then(response => {
              console.log(response)
              this.dialogVisible = false
              this.getList()
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editquarters(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form)
          // eslint-disable-next-line no-trailing-spaces
          this.form.birth = +new Date(this.form.birth)
          // this.form.birth = dateFormat('YYYY-mm-dd', this.form.birth)
          editowner(this.form)
            .then(response => {
              console.log(response)
              this.dialogVisible = false
              this.getList()
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 上传
    handlePhotoSuccess(res, file) {
      console.log(res)
      this.form.photo = res.data.url
      console.log(this.form.photo)
      this.form.photo = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 性别
    getCommon() {
      const params = {
        type: 'sex'
      }
      getCommonList(params).then(response => {
        this.sexList = response.data
      })
    },
    // 绑定房间
    bindingRooms(row) {
      console.log(row, '这是主页详情参数')
      // this.$router.push('/owner-management/home', params：{id:row.id})
      // this.$router.push({ '/owner-management/home', params: { id:row.id} })
      this.$router.push({
        path: '/owner-management/home',
        query: { id: row.id }
      })
    },
    // 解绑房间
    untieRoom(row) {
      // this.$router.push('/owner-management/unbundling')
      this.$router.push({
        path: '/owner-management/unbundling',
        query: { id: row.id }
      })
    },
    // 业主成员
    ownerMember(row) {
      this.$router.push({
        path: '/owner-management/owner-member',
        query: { id: row.id }
      })
    }
  }
}
</script>

<style lang='scss'>
.container {
  padding: 20px;
}
.container_on {
  padding: 20px;
  height: 160px;
  background: white;
  .on_title {
    margin-bottom: 20px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 10px;
    border-bottom: 1px solid rgb(231, 234, 236);
    & > p:nth-child(1) {
      color: rgb(104, 107, 109);
      font-size: 14px;
      font-weight: bold;
    }
    & > p:nth-child(2) {
      color: rgb(1, 123, 255);
      font-size: 14px;
    }
    & > p:nth-child(2):hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .on_input {
    .el-row {
      display: flex;
      justify-content: space-around;
    }
  }
}

.container_tw {
  margin-top: 20px;
  .tw_title {
    height: 50px;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    border-bottom: 1px solid rgb(231, 234, 236);
    & > p {
      color: rgb(104, 107, 109);
      font-size: 14px;
      font-weight: bold;
    }
    .el-button:hover {
      background: rgb(27, 179, 148);
    }
  }
  .tw_form {
    box-sizing: border-box;
    .el-table {
      box-sizing: border-box;
      padding: 0 20px;
    }
  }
}
/*弹出框*/
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
