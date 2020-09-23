<template>
  <div>
    <el-input v-model="value.name" placeholder="请输入内容"></el-input>
    <el-button plain @click="filtera">搜索/查询</el-button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      //   name: 'child',
      filterhandle: '',
      input: ''
    };
  },
  methods: {
    filtera() {
      this.$emit('filter');
    }
  }
};
</script>

<style>
</style>
