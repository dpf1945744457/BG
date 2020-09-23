<template>
  <div>
    <!-- <StepBar></StepBar> -->
    <el-card class="ibox-card">
      <div class="ibox">
        <span>楼栋信息</span>
        <el-button
          type="success"
          @click="dialogVisible=true"
        >选择楼</el-button>
      </div>
      <el-row
        v-for=" item in tableDataList"
        :key="item.id"
      >
        <el-col :span="8">
          <p class="title">楼名称：{{item.name}}</p>
        </el-col>
        <el-col :span="8">
          <p class="title">楼栋编号：{{item.num}}</p>
        </el-col>
        <el-col :span="8">
          <p class="title">备注：{{item.remark}}</p>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        class="row-bg"
        justify="end"
      >
        <el-col :span="6">
          <el-button
            type="primary"
            style="margin-top:50px;"
            @click="next"
          >下一步</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 选择楼栋 -->
    <el-dialog
      title="小区楼"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <!-- 内容主题 -->

      <el-form
        ref="formInline"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-input
            v-model="formInline.num"
            placeholder="请输入小区楼编号   "
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

      <!-- 列表 -->
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:20px"
      >
        <el-table-column
          prop="num"
          label="楼栋编号"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="楼栋名称"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.row)"
            >选择</el-button>
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

      <!-- 确认取消 -->
      <!-- <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="editquarters()"
        >确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
// const StepBar = () => import('@/components/StepBar')
import bus from '@/main'
import { getPageList, getDetailList } from '@/api/binding-rooms'
export default {
  components: {
    // StepBar
  },
  data() {
    return {
      dialogVisible: false,
      input: '',
      tableData: [],
      // tableDataList: [{
      //     num: '',
      //     layer: '',
      //     remark: ''
      //   }],
      tableDataList: [],
      formInline: {},
      pageSize: 10,
      pageNum: 1,
      total: 0
    }
  },
  created() {
    this.getList()
    // this.get()
  },
  methods: {
    getList() {
      const params = {
        num: this.formInline.num,
        pageSize: this.pageSize,
        pageNo: this.pageNum
      }
      getPageList(params).then(response => {
        this.tableData = response.data.dataList
          // this.tableData.push(response.data.dataList)
        this.total = response.data.total
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
    handleEdit(row) {
      getDetailList(row.id)
        .then(response => {
          console.log(response)
          // this.tableDataList.push(response.data)
          this.tableDataList = [response.data]
            //  this.tableDataList.push(response.data)
          console.log(this.tableDataList, '这是第一选择的参数信息')
          this.dialogVisible = false
          // this.dialogVisible = false
          // if (this.tableDataList === '') {
          //   alert('请选择楼栋')
          //   return
          // }
        })
        .catch(error => {
          console.log(error)
        })
    },
    next() {
      // debugger
      console.log(this.tableDataList, '5666666666666655')
      if (this.tableDataList == '') {
          return alert('请填选楼栋信息内容')
      } else {
        this.$emit('oneVisible', false)
      bus.$emit('twoVisible', true)
      // alert(66)
      }
    }
    // next() {
    //   this.$emit('oneVisible', false)
    //   bus.$emit('twoVisible', true)
    //   console.log(this.tableDataList, '参数为')
    //   // bus.$on('')
    // }
  }
}
</script>

<style lang='scss' scoped>
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
</style>
