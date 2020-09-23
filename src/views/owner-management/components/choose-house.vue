<template>
  <div>
    <!-- <StepBar></StepBar> -->
    <el-card class="ibox-card">
      <div class="ibox">
        <span>楼栋信息</span>
        <el-button
          type="success"
          @click="dialogVisible=true"
        >选择房间</el-button>
      </div>
      <el-row
        v-for=" item in tableDataList"
        :key="item.unitName"
        type="flex"
        class="row-bg"
        justify="center"
      >
        <!-- <el-col :span="6">
          <p class="title">房间名称：{{item.num}}</p>
        </el-col> -->
        <el-col :span="6">
          <p class="title">房间编号：{{item.num}}</p>
        </el-col>
        <el-col :span="6">
          <p class="title">楼层：{{item.layer}}</p>
        </el-col>
        <el-col :span="6">
          <p class="title">面积：{{item.size + item.unitName}}</p>
        </el-col>
      </el-row>

      <el-row
        v-for=" item in tableDataList"
        :key="item.id"
        type="flex"
        class="row-bg"
        justify="center"
      >
        <el-col :span="6">
          <p class="title">单元：{{item.num}}</p>
        </el-col>
        <el-col :span="6">
          <p class="title">楼栋：{{item.num}}</p>
        </el-col>
        <el-col :span="6">
          <p class="title">户型：{{item.room + item.hall}}</p>
        </el-col>
      </el-row>

      <el-row
        type="flex"
        class="row-bg"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            type="primary"
            style="margin-top:50px;"
            @click="back"
          >上一步</el-button>
        </el-col>
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
      title="小区房间"
      :visible.sync="dialogVisible"
      width="30%"
    >

      <el-form
        ref="formInline"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-input
            v-model="formInline.num"
            placeholder="请输入房间编号   "
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
          prop="buildingNum"
          label="楼栋编号"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="num"
          label="房间编号"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="layer"
          label="楼层"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
// const StepBar = () => import('@/components/StepBar')
import bus from '@/main'
import { getRoomList } from '@/api/room'
export default {
  components: {
    // StepBar
  },
  //  props: {
  //   RoomId: String
  // },
  // props: {
  //   // eslint-disable-next-line no-undef
  //   // h: string
  // },
  data() {
    return {
      dialogVisible: false,
      input: '',
      tableData: [],
      tableDataList: [],
      formInline: {},
      pageSize: 10,
      pageNum: 1,
      total: 0,
      List: []
    }
  },
  created() {
    this.getList()
    //  console.log(this.RoomId, 6666666662222222266666)
  },
  // mounted() {
  //   bus.$on('twoVisible', (msg) => {
  //     this.twoVisible = msg
  //   })
  // },
  methods: {
    getList() {
      const params = {
        num: this.formInline.num,
        pageSize: this.pageSize,
        pageNo: this.pageNum
      }
      getRoomList(params).then(response => {
        console.log(response, '第二参数')
        this.tableData = response.data.dataList
        console.log(this.tableData, '这是第二选择的参数信息')
        this.total = response.data.total
        // window.localStorage(this.tableData)
      })
    },
    onSubmit() {
      this.getList()
    },
    handleEdit(row) {
      // debugger
      console.log(row)
      this.tableDataList = [row]
      this.List = row.id
      this.dialogVisible = false
      // this.dltitle = '编辑信息'
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
    back() {
      // this.$emit('twoVisible', true)
      // alert(66)
      // bus.$emit('get(visible)', true)
      this.$emit('twoVisible', false)
      bus.$emit('oneVisible', true)
    },
    next() {
      // debugger
      if (this.tableDataList == '') {
        return alert('请填选楼栋信息内容')
      } else {
        bus.$emit('threeVisible', true)
        this.$emit('twoVisible', false)
        bus.$emit('RoomId', this.List)
        // alert(66)
      }
      // bus.$emit('threeVisible', true)
      // this.$emit('twoVisible', false)
      // bus.$emit('RoomId', this.List)
    }
  }
}
</script>

<style lang='scss' scoped>
.box-card {
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
.el-col {
  min-height: 1px;
}
</style>
