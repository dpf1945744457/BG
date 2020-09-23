<template>
  <div class="container">
    <div class="container_tw">
      <div class="tw_on">
        <P>投诉历史单</P>
        <el-button size="mini" round class="tw_button " icon="el-icon-search">搜索</el-button>
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
  name: 'ComplaintHistory',
  data() {
    return {
      restaurants: [],
      state1: '',
      state2: '',
      isShow: false,
      tableData: []
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
 .container_tw{
   margin-top: 30px;
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
