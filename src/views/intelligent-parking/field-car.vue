<template>
  <div class="container">
    <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
        <p @click="show">更多</p>
      </div>
      <div class="on_input" :style="{height: isShow?'120px':'80px'}">
        <!-- <div :style="{ width: true?'calc(100% - 10px)':'200px', color: 'red' }"></div> -->
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-input v-model="input" placeholder="请选择楼栋"></el-input>
            </div>
          </el-col>

          <el-col :span="3">
            <el-button type="primary" icon="el-icon-search">搜索</el-button>
          </el-col>

          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-input v-model="input" placeholder="请输入单元编号"></el-input>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-input v-model="input" placeholder="请输入总层数"></el-input>
            </div>
          </el-col>

          <el-col :span="3">
            <div class="grid-content bg-purple">
              <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row :class="isShow?'':'hide'">
          <el-col :span="6">
            <div class="grid-content bg-purple-dark">
              <el-autocomplete
                class="inline-input"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容a"
                sortable
                style="width:500px;margin-top:10px"
                @select="handleSelect"
              ></el-autocomplete>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="container_tw">
      <div class="tw_on">
        <P>单元信息</P>
        <!-- <el-button size="mini" round class="tw_button " icon="el-icon-search">搜索</el-button> -->
      </div>
      <div class="tw_form">
        <el-table :data="tableData" style="width: 100%">
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
  name: 'FieldCar',
  data() {
    return {
      restaurants: [],
      state1: '',
      state2: '',
      isShow: false,
      tableData: [],
      input: ''
    };
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      return [
        { value: '必填，请选择是否有电梯' },
        {
          value: 'Hot honey 首尔炸鸡（仙霞路）',
          address: '上海市长宁区淞虹路661号'
        },
        { value: '三全鲜食（北新泾店）', address: '长宁区新渔路144号' }
      ];
    },
    handleSelect(item) {
      console.log(item);
    },
    show() {
      this.isShow = !this.isShow
    }
  }
};
</script>

<style lang='scss' scoped>
.container_on {
  // height: 165px;
  margin: 20px;
  background: white;
  .on_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 10px;
    border-bottom: 1px solid rgb(231, 234, 236);
    height: 50px;
    line-height: 50px;
    & > p:nth-child(1) {
      color: rgb(104, 107, 109);
      font-size: 14px;
      font-weight: bold;
    }
    & > p:nth-child(2) {
      color: rgb(1, 123, 255);
      font-size: 14px;
      font-weight: bold;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .on_input {
    margin: 20px 0 0 10px;
  }
}
 .container_tw{
   box-sizing: border-box;
   padding: 0 20px;
    .tw_on{
      display: flex;
      justify-content: space-between;
      height: 50px;
      background: white;
      font-size: 14px;
      font-weight: bold;
      box-sizing: border-box;
      align-items: center;
      padding: 0 20px;
     line-height: 50px;
     border-bottom: 1px solid rgb(231,234,236);
      &>p{
        color: #666;
      }
      .tw_button{
       background: rgb(27,179,148);
       color: white;
      }
    }
    .el-table{
      box-sizing: border-box;
      padding: 0 20px;
      color: rgb(34,38,42);
    }
  }
  .hide{
    visibility: hidden;
  }
</style>
