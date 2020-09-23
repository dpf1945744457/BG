<template>
  <div>
    <el-card class="ibox-card">
      <div class="ibox">
        <span>业主信息</span>
        <div>
          <el-button
            size="small"
            round
            type="success"
            @click="add"
          >添加成员</el-button>
          <el-button
            size="small"
            round
            type="success"
            @click="back"
          >返回</el-button>
        </div>
      </div>
      <el-row
        v-for=" item in tableData"
        :key="item.photo"
        type="flex"
        class="row-bg"
        justify="center"
      >
        <!-- 左边图片 -->
        <!-- <el-col
          v-for=" item in tableData"
          :key="item.photo"
          :span="6"
          class="col_p"
        > -->
        <el-col
          :span="6"
          class="col_p"
        >
          <div>
            <p class="picture">{{item.photo}}</p>
          </div>
        </el-col>
        <!-- 右边信息 -->
        <el-col :span="18">
          <el-row>
            <el-col :span="8">
              <p class="title">业主姓名：{{item.name}}</p>
            </el-col>
            <el-col :span="8">
              <p class="title">性别：{{item.sex}}</p>
            </el-col>
            <el-col :span="8">
              <p class="title">出生日期：{{item.birth}}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <p class="title">身份证：{{item.idCardNo}}</p>
            </el-col>
            <el-col :span="8">
              <p class="title">联系方式：{{item.mobilePhone}}</p>
            </el-col>
            <el-col :span="8">
              <p class="title">邮箱：{{item.email}}</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table
        :data="tableDataList"
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="姓名"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="sex"
          :formatter="onLineStatus"
          label="性别"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="ownerType"
          label="类型"
        >
        </el-table-column>
        <el-table-column
          prop="mobilePhone"
          label="电话"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog
      :title="dltitle"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item
          label="姓名"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="必填，请选择姓名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="性别:"
          prop="sex"
        >
          <el-select
            v-model="form.sex"
            clearable
            placeholder="请选择性别"
            style="width:100%"
          >
            <el-option
              v-for="item in sexList"
              :key="item.key"
              :label="item.codeName"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="出生日期"
          prop="birth"
        >
          <el-date-picker
            v-model="form.birth"
            type="date"
            placeholder="选择出生日期"
            style="width:100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="成员类型:"
          prop="ownerType"
        >
          <el-select
            v-model="form.ownerType"
            clearable
            placeholder="必填，选择家庭成员类型"
            style="width:100%"
          >
            <el-option
              v-for="item in tableMember"
              :key="item.key"
              :label="item.codeName"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="移动电话"
          prop="mobilePhone"
        >
          <el-input
            v-model="form.mobilePhone"
            placeholder="请填写电话号码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱："
          prop="email"
        >
          <el-input
            v-model="form.email"
            placeholder="请填写邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="头像："
          prop="photo"
        >
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handlePhotoSuccess"
            :before-upload="beforeAvatarUpload"
            placeholder="请上传照片"
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
            placeholder="请填写备注"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="dltitle=='添加业主成员'"
            type="success"
            @click="addquarters('form')"
          >确定</el-button>
          <el-button
            v-if="dltitle=='编辑成员信息'"
            type="success"
            @click="editquarters('form')"
          >确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--删除 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确认是否删除</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="deleteVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getOwnerRoom } from '@/api/binding-rooms'
import {
  getOwnerMember,
  addOwnerMember,
  editOwnerMember,
  getDetailMember,
  deleteOwnerMember
} from '@/api/member'
import { getCommonList } from '@/api/common'
import { validEmail, validTelephone } from '@/utils/validate'
;('@/api/common')
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      if (validEmail(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    var checkTelephone = (rule, value, callback) => {
      if (validTelephone(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入有效手机号'))
    }
    return {
      dialogVisible: false,
      deleteVisible: false,
      imageUrl: '',
      input: '',
      dltitle: '',
      tableDataList: [
        {
          name: '',
          sex: '',
          birth: '',
          idCardNo: '',
          mobilePhone: '',
          email: '',
          photo: ''
        }
      ], // 业主房间的参数信息
      tableMemberList: [], // 业主成员信息参数
      tableMember: [], // 业主成员类型
      sexList: [],
      tableUnitList: [],
      value1: '',
      pageSize: 10,
      pageNum: 1,
      form: {
        birth: '',
        email: '',
        idCardNo: '',
        mobilePhone: '',
        name: '',
        photo: '',
        remark: '',
        sex: '',
        ownerType: '',
        ownerId: this.$route.query.id
      },
      tableData: [],
      rules: {
        name: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        birth: [{ required: true, message: '请选这出生日期', trigger: 'blur' }],
        mobilePhone: [
          { required: true, message: '请填写电话号码', trigger: 'blur' },
           { validator: checkTelephone, trigger: 'blur' }
        ],
        ownerType: [
          { required: true, message: '请选择成员类型', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        photo: [{ required: false, message: '请上传照片', trigger: 'blur' }],
        remark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    // this.getMemberList()
    this.getSex()
    this.getMember()
  },
  methods: {
    // getList() {
    //   const params = {
    //     ownerId: this.$route.query.id
    //     // roomId: this.roomId
    //   }
    //   console.log(params, '传来的业主ID')
    //   //  debugger
    //   getOwnerRoom(params).then(response => {
    //     this.tableData = [response.data.ownerRoomOwnerInfo]
    //     this.tableDataList = [response.data.ownerRoomRoomInfos[0]]
    //     // this.tableRoomId = response.data.ownerRoomRoomInfos[0].roomId
    //     // console.log(this.tableRoomId, '返回的RoomId')
    //     // console.log(this.tableDataList, '这是返回房间ID的参数')
    //     console.log(this.tableData, '这是第三的参数信息')
    //     this.total = response.data.total
    //   })
    // },
    getList() {
      const params = {
        ownerId: this.$route.query.id
      }
      getOwnerMember(params).then(response => {
        this.tableData = [response.data.ownerMemberOwnerInfoResp]
        this.tableDataList = response.data.ownerMemberDetailResps
        console.log(this.tableData, '业主信息参数')
        console.log(this.tableDataList, '1111业主信息参数')
        // this.tableDataList = [response.data.ownerMemberDetailResps]
        // console.log(this.tableDataList, '业主成员参数信息')
      })
    },
    // 获取业主成员信息
    // getMemberList() {
    //   const params = {
    //     ownerId: this.$route.query.id
    //   }
    //   console.log(params, '成员的iD获取')
    //   addOwnerMember(params).then(response => {
    //     this.tableMemberList = response.data
    //     console.log(this.tableMemberList, '这是成员信息参数类型信息')
    //   })
    // },
    // 成员类型
    getMember() {
      const params = {
        type: 'owner_member'
      }
      getCommonList(params).then(response => {
        this.tableMember = response.data
        console.log(this.tableMember, '类型+++++++++++++++')
      })
    },
    // 性别类型
    getSex() {
      const params = {
        type: 'sex'
      }
      getCommonList(params).then(response => {
        this.sexList = response.data
        console.log(this.sexList, '性别数组')
      })
    },
    // 性别
    onLineStatus: function(row, column) {
      return row.sex == 1 ? '女' : '男'
    },
    add() {
      this.form = {
        birth: '',
        email: '',
        mobilePhone: '',
        name: '',
        ownerId: this.$route.query.id,
        photo: '12121212',
        remark: '',
        sex: '',
        ownerType: '',
        id: ''
      }
      this.dltitle = '添加业主成员'
      this.dialogVisible = true
    },
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
    handleEdit(row) {
      this.dltitle = '编辑成员信息'
      //   this.form = row
      //     this.dialogVisible = true
      getDetailMember(row.id)
        .then(response => {
          console.log(response)
          this.form = row
          this.dialogVisible = true
        })
        .catch(error => {
          console.log(error)
        })
    },
    // deleteMember() {
    //   deleteOwnerMember(row.)
    // }
    handleDelete(row) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteOwnerMember(row.id).then(response => {
						if (response.code == '200') {
							this.getList();
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						}
					}).catch(error => {
						this.$message.error(error.errmsg);
					})

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
    // handleDelete(row) {
    //   deleteOwnerMember(row.id).then(response => {
    //     console.log(response)
    //     this.getList()
    //     // this.$message('删除成功')
    //     // alert(6666)
    //   })
    // },
    cancel(formName) {
      this.$refs[formName].clearValidate()
      this.dialogVisible = false
    },
    addquarters(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.birth = +new Date(this.form.birth)
          console.log(this.form)
          addOwnerMember(this.form)
            .then(response => {
              console.log(response, '添加后的人员信息')
              this.dialogVisible = false
              this.tableDataList.push(response.ownerMemberDetailResps)
              this.getList()
              // this.getList()
              // this.getMemberList()
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
          this.form.birth = +new Date(this.form.birth)
          console.log(this.form)
          editOwnerMember(this.form)
            .then(response => {
              console.log(response)
              this.dialogVisible = false
              this.getList()
              // this.getMemberList()
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
    back() {
      this.$router.push({
        path: '/owner-management/owner-information'
      })
    },
    // handleDelete(index, row) {
    //   console.log(index, row) // delete
    //   this.deleteVisible = true
    // },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
<style lang='scss' scoped>
.ibox-card {
  margin-top: 20px;
  box-sizing: border-box;
  padding-top: 30px;
  margin-bottom: 20px;
}
.ibox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #d0d0d0;
  box-sizing: border-box;
  padding-bottom: 20px;
  margin-bottom: 30px;
  & > span {
    color: #909090;
    font-size: 14px;
  }
}
.title {
  font-size: 14px;
  color: #777777;
}
.col_p {
  display: flex;
  justify-content: center;
  align-items: center;
  .picture {
    width: 100px;
    height: 100px;
    border: 1px solid #666;
  }
}
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
  border: 1px solid #666;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
