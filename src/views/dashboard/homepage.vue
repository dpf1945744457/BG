<template>
  <div class="title">
    <div>
      <p>插件默认计算值为也就是以为计算单位实际情况与默认值不同需要进入首选项=》设置搜索“cssrem”</p>
    </div>
    <div class="tabs">
      <el-tabs v-model="tabName">
        <el-tab-pane label="副业" name="first">
          <Homepage2 v-model="formParams" @filter="filterHandle"></Homepage2>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
const Homepage2 = () => import('./homepage2');
export default {
  name: 'Dashboard',
  components: {
    Homepage2
  },
  data() {
    return {
      tabName: '',
      formParams: {
        name: ''
      }
    }
  },
  methods: {
    filterHandle() {
      console.log('????？')
    }
  }
};
</script>

<style lang='scss' scoped>
.title {
  //例长600px 做窗口375的适配可写为 600/(375/10) 将其转换为rem单位
  & > div {
    width: 16rem;
    background: lavender;
    & > p {
      font-size: 20px;
    }
  }
}
</style>
