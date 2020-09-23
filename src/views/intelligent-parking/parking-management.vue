<template>
  <div class="container">
    <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
        <!-- <p>更多</p> -->
      </div>
      <div class="on_input">
        <el-row>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-input v-model="input" placeholder="请输入业主名称"></el-input>
            </div>
          </el-col>
          <el-col :span="4" :offset="1">
            <div class="grid-content bg-purple-light">
              <el-input v-model="input" placeholder="请输业主身份证"></el-input>
            </div>
          </el-col>
          <el-col :span="7" :offset="1">
            <div class="grid-content bg-purple">
              <el-input v-model="input" placeholder="请输入联系方式"></el-input>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple-light">
              <el-button type="primary" icon="el-icon-search" class="query">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="container_tw">
      <div class="tw_title">
        <p>停车场信息</p>
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          size="small"
          @click="dialogTableVisible = true"
        >
          添加
        </el-button>
        <!-- <el-button type="text" icon="el-icon-circle-plus" @click="dialogFormVisible = true">添加</el-button>
        <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="巡检点名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="巡检点名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog> -->
      </div>
      <div class="tw_form">
        <el-table :data="tableData" style="width: 100%" class="table">
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ParkingManagement',
  data() {
    return {
      gridData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      input: '',
      tableData: []
    };
  }
};
</script>

<style lang='scss' scoped>
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
</style>
