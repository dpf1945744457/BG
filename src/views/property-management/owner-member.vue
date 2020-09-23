<template>
  <div>
    <div class="container_on">
      <div class="on_title">
        <p>业主信息</p>
        <el-button type="primary" icon="el-icon-search" size="small">选择业主</el-button>
      </div>
      <div class="on_information">
        <div class="infor_left">
          <p></p>
        </div>
        <div class="infor_right">
          <el-row>
            <el-col :span="8">
              <div class="grid-content bg-purple">业主ID:</div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple-light">名称:</div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">性别:</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div class="grid-content bg-purple">年龄:</div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple-light">身份证:</div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">联系方式:</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div class="grid-content bg-purple">创建员工:</div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple-light">备注:</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="container_tw">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="成员ID" width="180"></el-table-column>
        <el-table-column prop="name" label="名称" width="140"></el-table-column>
        <el-table-column prop="name" label="性别" width="140"></el-table-column>
        <el-table-column prop="name" label="年龄" width="140"></el-table-column>
        <el-table-column prop="name" label="类型" width="140"></el-table-column>
        <el-table-column prop="name" label="身份证" width="180"></el-table-column>
        <el-table-column prop="name" label="联系方式" width="180"></el-table-column>
        <el-table-column prop="name" label="创建员工" width="180"></el-table-column>
        <el-table-column prop="name" label="备注" width="140"></el-table-column>
        <el-table-column prop="name" label="操作" width="180"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OwnerMember',
  data() {
    return {
      input: '',
      tableData: []
    }
  }
};
</script>

<style lang='scss' scoped>
.container_on {
  background: white;
  margin: 20px;
  height: 250px;
  .on_title {
    height: 50px;
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
  }
  .on_information {
    height: 200px;
    display: flex;
  }
  .infor_left {
    height: 150px;
    width: 200px;
    margin: 0 40px;
    & > p {
      height: 150px;
      width: 150px;
      background: yellowgreen;
    }
  }
  .infor_right {
    width: 1200px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .el-col {
      & > div {
        color: rgb(104, 107, 109);
        font-size: 14px;
      }
    }
  }
}
.container_tw{
  margin: 0 20px;
  .el-table{
    box-sizing: border-box;
    padding: 0 20px;
  }
}
</style>
