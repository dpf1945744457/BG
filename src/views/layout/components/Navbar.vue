<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">

      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
          <i class="el-icon-caret-bottom"></i>
          <div class="user-name"><span>您好{{name}}</span></div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              主页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="updatePassword">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="centerDialogVisible" width="30%" center :append-to-body="true">
      <el-form :model="passwordForm" status-icon :rules="passwordRules" ref="passwordForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="password">
          <el-input v-model="passwordForm.password"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="passwordForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="passwordSave('passwordForm')">提交</el-button>
        <el-button @click="resetForm('passwordForm')">重置</el-button>
      </span>
    </el-dialog>
  </el-menu>
</template>

<script> 
import { modifyPassword } from '@/api/password'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import md5 from 'js-md5';
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  created() {
  },
  data() {
    return {
      centerDialogVisible: false,
      passwordRules: {
        password: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('请填写旧密码'));
              }
              setTimeout(() => {
                // if (value < 18) {
                //   callback(new Error('为了账号安全，请填写6-10位字母组合'));
                // } else {
                callback();
                // }
              }, 500);
            }, trigger: 'blur'          }
        ],
        newPassword: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'));
              } else {
                setTimeout(() => {
                  if (this.passwordForm.checkPass !== '') {
                    this.$refs.passwordForm.validateField('checkPass');
                  } else if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/g.test(value))) {
                    callback(new Error('密码必须为6-10数字与字母混合形式!'));
                  } else if (value == this.passwordForm.password) {
                    callback(new Error('新密码跟旧密码相同!'));
                  }
                  callback();
                }, 500);
              }
            },
            trigger: 'blur'
          }
        ],
        checkPass: [
          {
            validator: (rule, value, callback) => {
              setTimeout(() => {
                if (value === '') {
                  callback(new Error('请再次输入密码'));
                } else if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/g.test(value))) {
                  callback(new Error('密码必须为6-10数字与字母混合形式!'));
                } else if (value !== this.passwordForm.newPassword) {
                  callback(new Error('两次输入密码不一致!'));
                } else {
                  callback();
                }
              }, 500);
            }, trigger: 'blur'          }
        ],

      },
      passwordForm: {
        newPassword: '',
        checkPass: '',
        password: ''
      },
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    // 修改密码
    updatePassword() {
      this.centerDialogVisible = true;
    },
    passwordSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          modifyPassword({
            password: md5(this.passwordForm.password),
            newPassword: md5(this.passwordForm.newPassword),
          }).then(res => {
            if (res.code = '0') {
              this.$message({
                message: '密码修改成功',
                type: 'success'
              });
              this.$refs['passwordForm'].resetFields();
              this.centerDialogVisible = false;
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    display: flex;
    float: right;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    &:focus {
      outline: none;
    }
    .user-name {
      flex: 1;
      margin: 0 5px;
      flex-wrap: nowrap;
      white-space: nowrap;
      // display: inline-block;
      // height: 20px;
    }
    .right-menu-item {
      flex: 1;
      // display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      flex: 1;
      height: 20px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        // margin-top: 5px;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
