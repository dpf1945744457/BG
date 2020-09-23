<template>
  <div>
    <el-card
      v-if="tableDataList.length>0"
      class="ibox-card"
    >
      <div class="ibox">
        <span>业主信息</span>
        <!-- <el-button
          type="success"
          @click="dialogVisible=true"
        >选择房间</el-button> -->
      </div>

      <el-row
        type="flex"
        class="row-bg"
        justify="center"
      >
        <!-- 左边图片 -->
        <el-col
          v-for=" item in tableData"
          :key="item.photo"
          :span="6"
          class="col_p"
        >
          <div>
            <p class="picture">{{item.photo}}</p>
          </div>
        </el-col>
        <!-- 右边信息 -->
        <el-col :span="18">
          <el-row
            v-for=" item in tableData"
            :key="item.unitName"
          >
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
          <el-row
            v-for=" item in tableData"
            :key="item.mobilePhone"
          >
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

    <!-- 第二 -->
    <template v-if="tableRoomId!=''">
      <el-card
        v-for="item in tableDataList1"
        :key="item.roomId"
        class="ibox-card"
      >
        <div class="ibox">
          <span></span>
          <el-button
            type="success"
            @click="dialogVisible=true"
          >解绑</el-button>
        </div>
        <el-row
          v-for=" item in tableDataList"
          :key="item.roomId"
          type="flex"
          class="row-bg"
          justify="space-around"
        >
          <el-col :span="4">
            <p class="title">楼栋：{{item.buildingNum}}</p>
          </el-col>
          <el-col :span="4">
            <p class="title">单元：{{item.buildingUnitNum}}</p>
          </el-col>
          <el-col :span="4">
            <p class="title">房间编号：{{item.buildingUnitRoomNum}}</p>
          </el-col>
        </el-row>
        <el-row
          v-for=" item in tableDataList"
          :key="item.ownerId"
          type="flex"
          class="row-bg"
          justify="space-around"
        >
          <el-col :span="4">
            <p class="title">楼层：{{item.layer}}</p>
          </el-col>
          <el-col :span="4">
            <p class="title">面积:{{item.size}}</p>
          </el-col>
          <el-col :span="4">
            <p class="title">户型：{{item.room + item.hall}}</p>
          </el-col>
        </el-row>
        <!-- <el-row
        type="flex"
        class="row-bg"
        justify="space-around"
      >
        <el-col :span="4">
          <p class="title">面积：</p>
        </el-col>
        <el-col :span="4">

        </el-col>
        <el-col :span="4">

        </el-col>
      </el-row> -->
      </el-card>
    </template>

    <el-dialog
      title="请确认您的操作"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确认是否解除！</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirm"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// import { unbunding } from '@/api/binding-rooms'
import {
  getOwnerRoom,
  unbunding
  // getOwnerBinding
} from '@/api/binding-rooms'
export default {
  data() {
    return {
      dialogVisible: false,
      input: '',
      tableData: [], // 业主参数
      tableDataList: [], // 业主房间的参数信息
      tableRoomId: [], // 房间ID
      tableDataList1: [], // 业主1房间的参数信息
      unbundList: [] // 解除绑定
      // ownerIdList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const params = {
        ownerId: this.$route.query.id
        // roomId: this.roomId
      }
      console.log(params, '传来的业主ID')
      //  debugger
      getOwnerRoom(params).then(response => {
        this.tableData = [response.data.ownerRoomOwnerInfo]
        this.tableDataList = [response.data.ownerRoomRoomInfos[0]]
        this.tableDataList1 = response.data.ownerRoomRoomInfos
        // debugger
        console.log(
          this.tableDataList1,
          '666666666666666666666666668888888888888888888'
        )
        this.tableRoomId = response.data.ownerRoomRoomInfos[0].roomId
        console.log(this.tableRoomId, '返回的RoomId6666666666666666666')
        console.log(this.tableDataList, '这是返回房间ID的参数eeeeeeeeee')
        console.log(this.tableData, '这是第三的参数信息')
        this.total = response.data.total
      })
    },
    // 解除绑定
    unbund() {
      // debugger
      const params = {
        ownerId: this.$route.query.id,
        roomId: this.tableRoomId
      }
      unbunding(params).then(response => {
        this.unbundList = response.data
      })
    },
    // handleEdit(index, row) {
    //   console.log(index, row)
    // },
    // handleDelete(index, row) {
    //   console.log(index, row)
    // },
    confirm() {
      // debugger
      this.unbund()
      this.$router.push({
        path: '/owner-management/owner-information'
      })
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.dialogVisible = false
    },
    handleClose(done) {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
      this.dialogVisible = false
    }
  }
}
</script>
<style lang='scss' scoped>
.ibox-card {
  margin-top: 20px;
  box-sizing: border-box;
  padding-top: 10px;
  margin-bottom: 20px;
  height: 250px;
}
.ibox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #d0d0d0;
  box-sizing: border-box;
  padding-bottom: 10px;
  margin-bottom: 30px;
  & > span {
    color: #909090;
    font-size: 14px;
    font-weight: bold;
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
</style>
