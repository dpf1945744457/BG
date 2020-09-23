<template>
  <div class="container">
    <div class="top-tools">
      <h5>小区信息</h5>

      <!--右边按钮  -->
      <div class="tools-right">
        <el-button type="primary" class="tools-button" @click="dialogVisible = true">
          <i class="el-icon-circle-plus-outline"></i>
          入驻小区
        </el-button>
      </div>

      <!-- 弹出框 -->
      <el-dialog
        title="申请入驻"
        :visible.sync="dialogVisible"
        width="40%"
      >

        <!-- 搜索框 -->
        <div style="display:flex">
          <el-input v-model="input" placeholder="请输入内容" size="medium"></el-input>
          <el-button type="success">查询</el-button>
        </div>

        <!-- 表格文字 -->
        <div>
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="date" label="小区ID" width="180"></el-table-column>
            <el-table-column prop="name" label="名称" width="150"></el-table-column>
            <el-table-column prop="address" label="地址" width="220"></el-table-column>
            <el-table-column prop="name" label="操作" width="150"></el-table-column>
          </el-table>
        </div>

      </el-dialog>
    </div>
    <div class="form">
      <el-table :data="tableData" style="width: 100%" class="form_table">
        <el-table-column prop="name" label="省份" width="180"></el-table-column>
        <el-table-column prop="name" label="市/州" width="120"></el-table-column>
        <el-table-column prop="name" label="县区" width="300"></el-table-column>
        <el-table-column prop="name" label="小区名称" width="200"></el-table-column>
        <el-table-column prop="name" label="小区编码" width="200"></el-table-column>
        <el-table-column prop="name" label="联系方式" width="130"></el-table-column>
        <el-table-column prop="name" label="状态" width="220"></el-table-column>
        <el-table-column prop="address" label="操作"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyNeighborhood',
  data() {
    return {
      tableData: [
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      dialogVisible: false,
      handleClose: '',
      input: ''
    };
  },
  methods: {
    // handleClose(done) {
    //   this.$confirm("确认关闭？")
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // }
  }
};
</script>

<style lang='scss' scoped>
.container{
  margin: 20px;
  border: 1px solid rgb(231,234,236);
  border-radius: 10px;
  .top-tools{
    height: 50px;
    display: flex;
    justify-content: space-between;
    background: white;
    border-bottom: 1px solid rgb(222,226,230);
    box-sizing: border-box;
    padding-left: 10px;
    color: rgb(113,115,117);
    align-items: center;
    text-align: center;
    .tools-right{
      margin-right: 20px;
      .tools-button{
       display: flex;
       width: 85px;
       height: 35px;
       justify-content: center;
       align-items: center;
       color: white;
       font-size: 12px;
       font-weight: bold;
      }
      .tools-button:hover{
        background: rgb(27,179,148);
      }
    }
  }
  .form{
    .form_table{
      box-sizing: border-box;
      padding: 20px;
    }
  }
}

</style>
