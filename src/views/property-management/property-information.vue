<template>
  <div class="container">
    <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
        <p>更多</p>
      </div>
      <div class="on_input">
        <el-row>
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <el-select
                v-model="company"
                placeholder="请选择物业公司"
              >
                <el-option
                  v-for="item in companyOptions"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.companyName"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <!--<el-col :span="4" :offset="1"><div class="grid-content bg-purple-light"><el-input v-model="input" placeholder="请输业主身份证"></el-input></div></el-col>
          <el-col :span="7" :offset="1"><div class="grid-content bg-purple"><el-input v-model="input" placeholder="请输入联系方式"></el-input></div></el-col>-->
          <el-col :span="2">
            <div class="grid-content bg-purple-light">
              <el-button
                type="primary"
                icon="el-icon-search"
                class="query"
                @click="search"
              >查询</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="container_tw">
      <div class="tw_title">
        <p>物业列表</p>
        <!--右边按钮  -->
        <div class="tools-right">
          <el-button
            type="primary"
            class="tools-button"
            @click="addCompany"
          >
            <i class="el-icon-circle-plus-outline"></i> 添加
          </el-button>
        </div>
        <!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
      </div>
      <div class="tw_form">
        <el-table
          :data="companyList"
          style="width: 100%"
          class="table"
        >
          <el-table-column
            prop="id"
            label="编号"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="companyName"
            label="名称"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="companyPhone"
            label="联系电话"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="createUserName"
            label="创建员工"
            width="180"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="handleLook(scope.row)"
                type="primary"
                size="small"
              >查看</el-button>
              <el-button
                type="success"
                size="small"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
    <!-- 弹出框 -->
    <el-dialog
      title="添加物业信息"
      :visible.sync="dialogVisible"
      width="40%"
    >

      <el-form
        ref="form"
        :model="form"
        label-width="140px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item
          label="物业公司名称"
          prop="companyName"
        >
          <el-input v-model="form.companyName"></el-input>
        </el-form-item>
        <el-form-item
          label="物业公司电话"
          prop="companyPhone"
        >
          <el-input v-model="form.companyPhone"></el-input>
        </el-form-item>
        <el-form-item
          label="公司法人"
          prop="legalPerson"
        >
          <el-input v-model="form.legalPerson"></el-input>
        </el-form-item>
        <el-form-item
          label="营业执照号码"
          prop="busLicense"
        >
          <el-input v-model="form.busLicense"></el-input>
        </el-form-item>

        <el-form-item
          label="营业执照图片"
          prop="busLicensePic"
        >
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            accept=".jpg, .jpeg, .png"
            :on-success="handleLicenseSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="form.busLicensePic"
              :src="form.busLicensePic"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="logo"
          prop="logo"
        >
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="form.logo"
              :src="form.logo"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="物业公司描述"
          prop="decription"
        >
          <el-input
            type="textarea"
            v-model="form.decription"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5,10,15,20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getCompanyList,
  addPropertyCompany,
  getPropertyDetail,
  editPropertyCompany,
  getAllPropertyCompany
} from '@/api/property'

export default {
  name: 'OwnerIinformation',
  data() {
    return {
      company: '',
      companyOptions: [],
      dialogVisible: false,
      form: {
        companyName: '111',
        companyPhone: '111',
        legalPerson: '111',
        busLicense: '',
        busLicensePic: '',
        logo: '',
        decription: ''
      },
      pageNum: 1,
      pageSize: 5,
      total: 0,
      companyList: [],
      addOrEdit: 'add',
      rules: {
        companyName: [
          {
            required: true,
            message: '请输入物业公司名称',
            trigger: 'blur'
          }
          //          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        companyPhone: [
          {
            required: true,
            message: '请输入物业公司电话',
            trigger: 'blur'
          }
        ],
        legalPerson: [
          {
            required: true,
            message: '请输入公司法人',
            trigger: 'blur'
          }
        ],
        busLicense: [
          {
            required: true,
            message: '请输入营业执照号码',
            trigger: 'blur'
          }
        ],
        busLicensePic: [
          {
            required: true,
            message: '请上传营业执照图片',
            trigger: 'blur'
          }
        ],
        logo: [
          {
            required: true,
            message: '请上传公司logo',
            trigger: 'blur'
          }
        ],
        decription: [
          {
            required: true,
            message: '请输入公司描述',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getAllPropertyCompany()
    this.getCompanyList('')
  },
  methods: {
    getAllPropertyCompany() {
      getAllPropertyCompany()
        .then(response => {
          if (response.code == '200') {
            this.companyOptions = response.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getCompanyList(company) {
      getCompanyList({
        companyName: company,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
        .then(response => {
          if (response.code == '200') {
            this.companyList = response.data.dataList
            this.total = response.data.total
          }
        })
        .catch(error => {
          this.$message.error(error.errmsg)
        })
    },
    search() {
      console.log(this.company)
      this.getCompanyList(this.company)
    },
    addCompany() {
      this.dialogVisible = true
      this.addOrEdit = 'add'
      this.form = {}
    },
    getPropertyDetail(id) {
      getPropertyDetail(id)
        .then(response => {
          if (response.code == '200') {
            this.form = response.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleLook(row) {
      this.dialogVisible = true
      this.getPropertyDetail(row.id)
    },
    handleEdit(row) {
      this.addOrEdit = 'edit'
      this.dialogVisible = true
      this.getPropertyDetail(row.id)
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //		      	编辑
          if (this.addOrEdit == 'edit') {
            editPropertyCompany(this.form)
              .then(response => {
                if (response.code == '200') {
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  })
                  this.dialogVisible = false
                  this.getCompanyList()
                }
              })
              .catch(error => {
                console.log(error)
              })
          }
          //		      	新增
          else if (this.addOrEdit == 'add') {
            addPropertyCompany(this.form)
              .then(response => {
                if (response.code == '200') {
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  this.dialogVisible = false
                  this.getCompanyList()
                }
              })
              .catch(error => {
                console.log(error)
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleLicenseSuccess(res) {
      console.log(res)
      this.form.busLicensePic = res.data.url
      console.log(this.form.busLicensePic)
    },
    handleLogoSuccess(res, file) {
      this.form.logo = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      console.log(file)
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
    handleSizeChange(val) {
      this.pageSize = val
      this.getCompanyList('')
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getCompanyList('')
    }
  }
}
</script>

<style lang='scss'>
.container_on {
  margin: 20px;
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
  margin: 0 20px;
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

.pagination-container {
  background: #ffffff;
  padding: 10px 0;
  margin: 20px;
}
</style>