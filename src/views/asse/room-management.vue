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
          <el-select
            v-model="formInline.buildingId"
            clearable
            placeholder="请选择楼栋"
            @change="changList"
          >
            <el-option
              v-for="item in tableDataList"
              :key="item.id"
              :label="item.num"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="formInline.buildingUnitId"
            clearable
            placeholder="请选择单元"
          >
            <el-option
              v-for="item in tableUnitList"
              :key="item.id"
              :label="item.num"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="formInline.num"
            placeholder="请输入房屋编号   "
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
        <p>房屋信息</p>
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
            label="楼栋名称"
          ></el-table-column>
          <el-table-column
            prop="unitNum"
            label="单元"
          ></el-table-column>
          <el-table-column
            prop="num"
            label="房屋编号"
          ></el-table-column>
          <el-table-column
            prop="layer"
            label="楼层"
          ></el-table-column>
          <el-table-column
            prop="size"
            :formatter="onLineStatus"
            label="建筑面积"
          ></el-table-column>
          <el-table-column
            prop="state"
            label="房屋状态"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit( scope.row)"
              >编辑</el-button>
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
          label="楼栋:"
          prop="buildingUnitId"
        >
          <el-select
            v-model="form.buildingId"
            clearable
            style="width:100%"
            placeholder="必填，请选择楼栋"
            @change="changList"
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
          label="房屋单元:"
          prop="buildingId"
        >
          <el-select
            v-model="form.buildingUnitId"
            clearable
            placeholder="请选择单元"
            style="width:100%"
          >
            <el-option
              v-for="item in tableUnitList"
              :key="item.id"
              :label="item.num"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="房屋编号："
          prop="num"
        >
          <el-input v-model="form.num"></el-input>
        </el-form-item>
        <el-form-item
          label="房屋楼层："
          prop="layer"
        >
          <el-input v-model="form.layer"></el-input>
        </el-form-item>
        <el-form-item
          label="房屋户型："
          prop="room"
        >
          <el-select
            v-model="form.room"
            placeholder="一室"
            style="width:49%"
          >
            <el-option
              v-for="item in roomRoom"
              :key="item.key"
              :label="item.codeName"
              :value="item.key"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="form.hall"
            placeholder="一厅"
            style="width:49%"
          >
            <el-option
              v-for="item in roomHall"
              :key="item.key"
              :label="item.codeName"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="建筑面积："
          prop="size"
        >
          <el-input v-model="form.size"></el-input>
        </el-form-item>
        <el-form-item
          label="面积单位:"
          prop="unitName"
        >
          <el-select
            v-model="form.unitName"
            clearable
            placeholder="必填，选择计算面积单位"
            style="width:100%"
          >
            <el-option
              v-for="item in unitList"
              :key="item.id"
              :label="item.unitsName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注:"
          prop="remark"
        >
          <el-input
            v-model="form.remark"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="dltitle=='添加房屋'"
            type="success"
            @click="addquarters('form')"
          >确定</el-button>
          <el-button
            v-if="dltitle=='编辑房屋'"
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
  addRoom, // 添加
  editRoom, // 修改
  getDetailRoom, // 信息
  getRoomList, // 列表
  getBuilList, // 楼栋列表
  getUnitList // 单元列表
} from '@/api/room'
import { getMeteringList, getCommonList } from '@/api/common'

export default {
  name: 'OwnerIinformation',
  data() {
    return {
      input: '',
      value: '',
      tableData: [], // 列表数组
      tableDataList: [], // 楼栋数组
      tableUnitList: [], // 单元数组
      formInline: {},
      formInput: {},
      pageSize: 10,
      pageNum: 1,
      total: 0,
      dialogVisible: false,
      choicedialogVisible: false,
      Propertyoptions: [],
      unitList: [], // 计量单位
      roomRoom: [], // 房
      roomHall: [], // 厅
      dltitle: '',
      options: [],
      form: {
        buildingId: '',
        buildingUnitId: '',
        num: '',
        layer: '',
        room: '',
        hall: '',
        size: '',
        unitId: '',
        remark: '',
        unitName: ''
      },
      rules: {
        buildingUnitId: [
          { required: true, message: '请输入房屋楼栋', trigger: 'blur' }
        ],
        // buildingId: [
        //   { required: true, message: '请选择房屋单元', trigger: 'change' }
        // ],
        num: [{ required: true, message: '请选择房屋编号', trigger: 'blur' }],
        layer: [{ required: true, message: '请填写房屋楼层', trigger: 'blur' }],
        hall: [{ required: false, message: '请选择房屋户型', trigger: 'blur' }],
        size: [{ required: true, message: '请填写建筑面积', trigger: 'blur' }],
        unitName: [
          { required: true, message: '请填写面积单位', trigger: 'blur' }
        ],
        remark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getBuilUnit()
    this.getMetering()
    this.getCommonRoom()
    this.getCommonHall()
  },
  methods: {
    // 列表
    getList() {
      const param = {
        buildingId: this.formInline.buildingId,
        buildingUnitId: this.formInline.buildingId,
        num: this.formInline.num,
        pageNo: this.pageNum,
        pageSize: this.pageSize
      }
      getRoomList(param)
        .then(response => {
          console.log(response)
          this.tableData = response.data.dataList
          this.total = response.data.total
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 楼栋
    getBuilUnit() {
      const params = {
        buildingUnitId: this.formInline.buildingUnitId
      }
      getBuilList(params).then(response => {
        console.log(response)
        this.tableDataList = response.data
      })
    },
    // 单元
    getUnit(val) {
      const params = {
        buildingId: val
      }
      console.log(params);
      getUnitList(params).then(response => {
        console.log(response)
        this.tableUnitList = response.data
      })
    },
    cancel(formName) {
      this.$refs[formName].clearValidate()
      this.dialogVisible = false
    },
    handleEdit(row) {
      this.dltitle = '编辑房屋'
      getDetailRoom(row.id)
        .then(response => {
          console.log(response)
          this.form = response.data
          this.dialogVisible = true
        })
        .catch(error => {
          console.log(error)
        })
    },
    changList(val) {
      this.getUnit(val)
    },
    onSubmit() {
      this.getList()
    },
    // 建筑面积
    onLineStatus: function(row, column) {
      return row.size
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
        buildingId: '',
        buildingUnitId: '',
        num: '',
        layer: '',
        room: '',
        hall: '',
        size: '',
        unitId: '',
        remark: '',
        unitName: ''
      }
      this.dltitle = '添加房屋'
      this.dialogVisible = true
    },
    addquarters(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form)
          addRoom(this.form)
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
          editRoom(this.form)
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
    // 获取单位
    getMetering() {
      getMeteringList().then(response => {
        console.log(response)
        this.unitList = response.data
      })
    },
    // 房
    getCommonRoom() {
      const params = {
        type: 'house_type_room'
      }
      getCommonList(params).then(response => {
        this.roomRoom = response.data
      })
    },
    // 厅
    getCommonHall() {
      const params = {
        type: 'house_type_hall'
      }
      getCommonList(params).then(response => {
        this.roomHall = response.data
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
