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
          <el-form-item>
            <el-select
              v-model="formInline.buildingId"
              clearable
              placeholder="请选择楼栋"
            >
              <el-option
                v-for="item in tableDataList"
                :key="item.id"
                :label="item.num"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="formInline.num"
            placeholder="请输入单元编号"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="formInline.numOfFloors"
            placeholder="请输入总层数"
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
        <p>小区列表</p>
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
            prop="buildingNum"
            label="楼栋"
          ></el-table-column>
          <el-table-column
            prop="num"
            label="单元编号"
          ></el-table-column>
          <el-table-column
            prop="numOfFloors"
            label="总层数"
          ></el-table-column>
          <el-table-column
            prop="hasElevator"
            :formatter="onLineStatus"
            label="是否有电梯"
          ></el-table-column>
          <el-table-column
            prop="createName"
            label="创建员工"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit( scope.row)"
              >编辑</el-button>
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
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <!-- <el-form-item
          label="楼栋:"
          prop="buildingId"
        >
          <el-input
            v-model="formInline.buildingId"
            placeholder="必填，请选择楼栋"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              type="primary"
              @click="choicedialogVisible=true"
            >选择</el-button>
          </el-input>
        </el-form-item> -->

        <el-form-item
          label="楼栋:"
          prop="buildingId"
        >
          <el-select
            v-model="form.buildingId"
            clearable
            placeholder="必填，请选择楼栋"
            style="width:100%"
          >
            <el-option
              v-for="item in tableDataList"
              :key="item.id"
              :label="item.num"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="单元编号:"
          prop="num"
        >
          <el-input v-model="form.num"></el-input>
        </el-form-item>
        <el-form-item
          label="总层数:"
          prop="numberOfFloors"
        >
          <el-input v-model="form.numberOfFloors"></el-input>
        </el-form-item>
        <el-form-item
          label="电梯:"
          prop="hasElevator"
        >
          <!-- <el-input
            v-model="form.hasElevator"
            placeholder="必填，是否有电梯"
          ></el-input> -->
          <el-select
            v-model="form.hasElevator"
            clearable
            placeholder="必填，是否有电梯"
            style="width:100%"
          >
            <el-option
              v-for="item in elevatorList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="小区描述:"
          prop="remark"
        >
          <el-input
            v-model="form.remark"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="dltitle=='单元详情'"
            type="success"
            @click="addquarters('form')"
          >确定</el-button>
          <el-button
            v-if="dltitle=='编辑小区'"
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
import {
  addUnit,
  editUnit,
  getDetailUnit,
  getbuilding,
  getBuilUnitList,
  getUnitList
  // getList
} from '@/api/unit'
// import { getCommonList } from '@/api/common'
export default {
  name: 'OwnerIinformation',
  data() {
    return {
      input: '',
      tableData: [], // 列表数组
      tableDataList: [], // 选择数组
      formInline: {},
      formInput: {},
      pageSize: 10,
      pageNum: 1,
      total: 0,
      communityId: 66,
      dialogVisible: false,
      choicedialogVisible: false,
      Propertyoptions: [],
      dltitle: '',
      elevatorList: [
        {
          value: 1,
          label: '是'
        },
        {
          value: 2,
          label: '否'
        }
      ],
      form: {
        buildingId: '',
        hasElevator: '',
        id: '',
        num: '',
        numberOfFloors: '',
        remark: ''
      },
      rules: {
        buildingId: [
          { required: true, message: '请选择楼栋', trigger: 'blur' }
        ],
        num: [{ required: true, message: '请选择单元编号', trigger: 'change' }],
        numberOfFloors: [
          { required: true, message: '请选择总层数', trigger: 'blur' }
        ],
        hasElevator: [
          { required: true, message: '请选择电梯', trigger: 'blur' }
        ],
        remark: [{ required: true, message: '请填写小区描述', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getBuilUnit()
    // this.getCommon()
    // this.getAllListwuye()
  },
  methods: {
    getList() {
      const param = {
        buildingId: this.formInline.buildingId,
        num: this.formInline.num,
        numOfFloor: this.formInline.numOfFloor,
        pageNo: this.pageNum,
        pageSize: this.pageSize
      }
      getbuilding(param)
        .then(response => {
          console.log(response)
          this.tableData = response.data.dataList
          this.total = response.data.total
        })
        .catch(error => {
          console.log(error)
        })
    },
    getBuilUnit() {
      const params = {
        buildingId: this.formInline.buildingId
      }
      getBuilUnitList(params).then(response => {
        console.log(response)
        this.tableDataList = response.data
      })
    },
    getlUnit() {
      const params = {
        buildingId: this.formInline.buildingId
      }
      getUnitList(params).then(response => {
        console.log(response)
        this.tableDataList = response.data
      })
    },
    // 电梯
    onLineStatus: function(row, column) {
      return row.hasElevator === 1 ? '是' : '否';
    },
    // 电梯接口
    // getCommon() {
    //   const params = {
    //      type: 'yes_or_no'
    //   }
    // getCommonList(params)
    // .then(response => {
    //   this.elevatorList = response.data
    // })
    // },
    cancel(formName) {
      this.$refs[formName].clearValidate()
      this.dialogVisible = false
    },
    handleEdit(row) {
      this.dltitle = '编辑小区'
      getDetailUnit(row.id)
        .then(response => {
          console.log(response)
          this.form = response.data
          this.dialogVisible = true
        })
        .catch(error => {
          console.log(error)
        })
    },
    onSubmit() {
      // this.getPropertylist()
      this.getList()
    },

    // 列表分页
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
        buildingId: '',
        hasElevator: '',
        num: '',
        numberOfFloors: '',
        remark: ''
      }
      this.dltitle = '单元详情'
      this.dialogVisible = true
    },
    addquarters(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form)

          if (this.form.hasElevator === '1') {
            this.form.hasElevator = '是'
          }
          if (this.form.hasElevator === '0') {
            this.form.hasElevator = '否'
          }
          addUnit(this.form)
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
          editUnit(this.form)
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
