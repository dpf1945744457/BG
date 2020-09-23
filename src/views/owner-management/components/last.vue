<template>
  <div>
    <!-- <StepBar></StepBar> -->
    <el-card class="ibox-card">
      <div class="ibox">
        <span>业主信息</span>
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
            @click="end"
          >完成</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
// const StepBar = () => import('@/components/StepBar')
import bus from '@/main'
import { getOwnerRoom, getOwnerBinding } from '@/api/binding-rooms'
// import { string } from 'jszip/lib/support'
export default {
  components: {
    // StepBar
  },
  // props: {
  //   RoomId: String
  // },
  data() {
    return {
      dialogVisible: false,
      input: '',
      tableData: [],
      roomId: [],
      tableDataList: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // 接收兄弟传值
    bus.$on('RoomId', msg => {
      this.roomId = msg
      console.log(this.roomId, '这是值哦')
    })
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
        console.log(this.tableData, '这是第三的参数信息')
        this.total = response.data.total
      })
    },
    // 房间绑定
    getBinding() {
      const params = {
        ownerId: this.$route.query.id,
        roomId: this.roomId
      }
      console.log(params, '6666666666666666666参数信息')
      getOwnerBinding(params).then(response => {
        this.tableDataList = response.data
        console.log(this.tableDataList, '2222222333333333')
        // this.tableDataList.push(response.data)
      })
    },
    // handleEdit(index, row) {
    //   console.log(index, row)
    // },
    // handleDelete(index, row) {
    //   console.log(index, row)
    // },
    back() {
      // debugger
      this.$emit('threeVisible', false)
      bus.$emit('twoVisible', true)
      // this.$emit('dialogVisibleEventt', false);
    },
    end() {
      this.getBinding()
      this.$router.push({
        path: '/owner-management/owner-information'
      })
      this.$message({
        type: 'success',
        message: '绑定成功!'
      })
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
</style>
