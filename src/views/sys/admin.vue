<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <myp-search-form @changeform="callbackformHandle" @resetInput="resetSearchHandle" @seachstart="seachstartHandle" :searchOptions="searchOptions"></myp-search-form>
    <div class="operation-box">
      <el-button size="small" class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
      <el-button size="small" class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>
    <!-- 查询结果 -->
    <TableData :list="list" :listLoading="listLoading" :loadingText="'正在查询中。。。'" :tableColumn="tableSet.tableColumn" :operation="tableSet.operation" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :currentPage="listQuery.page" :currentLimit="listQuery.limit" :total="total" @operationHandle="operationHandle">
    </TableData>
    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="dataForm" ref="dataForm" status-icon label-position="left" label-width="100px">
        <el-form-item label="管理员名称" prop="username" :rules="{
          required: true, message: '管理员名称不能为空', trigger: 'blur'
        }">
          <el-input :disabled="edittDis" v-model="dataForm.username"></el-input>
        </el-form-item>
        <!--<el-form-item label="微信openid" prop="wxOpenid">-->
          <!--<el-input type="text" v-model="dataForm.wxOpenid" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="邮箱" prop="email" :rules="{
           type: 'email',required: true, message: '请输入正确的邮箱地址', trigger: 'blur'
        }">
              <el-input type="email" v-model="dataForm.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-switch v-model="dataForm.emailNotice" :active-value="true" :inactive-value="false" active-text="启用" inactive-text="关闭">
            </el-switch>
          </el-col>
        </el-row>

        <el-form-item label="管理员头像" prop="avatar">
          <el-upload class="avatar-uploader" :headers="headers" :action="uploadPath" list-type="picture-card" :show-file-list="false" accept=".jpg,.jpeg,.png,.gif" :on-success="uploadAvatar">
            <img v-if="dataForm.avatar" :src="dataForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button :disabled="saveDis" v-if="dialogStatus=='create'" type="primary" @click="createSave('dataForm')">确定</el-button>
        <el-button :disabled="saveDis" v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <!-- 配置角色 start -->
    <el-dialog title="配置角色" center :visible.sync="configRoleFormVisible" width="500px">
      <div class="zTreeDemoBackground left">
        <ul id="roleTree" class="ztree"></ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="configRoleFormVisible = false">取 消</el-button>
        <el-button :loading="saveLoading" type="primary" @click="configRoleSave(roleForm)">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 配置角色 end -->
  </div>
</template>
<style>
@import "../../common/zTree/css/metroStyle/metroStyle.css";
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
<script>
import $ from "jquery";
import "@/common/zTree/js/jquery.ztree.all.js";
import { listAdmin, createAdmin, updateAdmin, deleteAdmin } from "@/api/admin";
import {
  getRoleTree,
  postAdminRoleBind,
  postPermissionOperator
} from "@/api/menu_manage";
import { resetPassword } from "@/api/password";
import { uploadPath } from "@/api/storage";
import { getToken } from "@/api/api_token";
import TableData from "@/components/TableData";
import SearchForm from "@/components/SearchForm";
import { searchMixin } from "@/common/searchMixin";
import { operationMixin } from "@/common/operationMixin.js";
import {
  filterColor,
  statusFilterQuery,
  statusFilter
} from "@/utils/statusMixin.js";
export default {
  mixins: [
    filterColor,
    statusFilterQuery,
    statusFilter,
    searchMixin,
    operationMixin
  ],
  components: {
    TableData,
    "myp-search-form": SearchForm // 搜索组件
  },
  name: "Admin",
  computed: {
    headers() {
      return {
        "Admin-Token": getToken()
      };
    },
    edittDis() {
      return this.dialogStatus == "update";
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.dataForm.checkPassword !== "") {
          this.$refs.dataForm.validateField("checkPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.dataForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      roleForm: {},
      setting: {
        check: {
          enable: true
        },
        data: {
          simpleData: {
            enable: true,
            idKey: "code",
            // pIdKey: "parentNodeId",
            url: "xUrl"
          },
          keep: {
            leaf: false,
            parent: true
          },
          key: {
            name: "name"
          }
        }
      },
      configRoleFormVisible: false,
      saveDis: false,
      searchOptions: {
        lableWidth: "100px",
        searchList: []
      },
      tableSet: {
        tableColumn: [
          // table列信息 key=>表头标题，word=>表内容信息
          {
            key: "管理员ID",
            width: "120px",
            word: "id"
          },
          {
            key: "管理员名称",
            width: "120px",
            word: "username"
          },
          // {
          //   key: "微信openid",
          //   width: "120px",
          //   word: "wxOpenid"
          // },
          {
            key: "邮箱",
            width: "120px",
            word: "email"
          },

          {
            key: "邮箱状态",
            width: "150px",
            word: "emailNotice",
            status: true,
            type: data => {
              return this.statusFilter(data, "emailNotice");
            }
          },
          {
            key: "头像",
            width: "150px",
            word: "avatar",
            isImage: true
          }
        ],
        operation: {
          width: "300px",
          options: [
            {
              colorType: "success",
              text: "配置角色",
              visibleFn: rowdata => {
                return true;
              },
              color: "#1890ff",
              cb: row => {
                this.roleConfigHandle(row);
              }
            },
            {
              text: "编辑",
              visibleFn: rowdata => {
                return true;
              },
              color: "#1890ff",
              cb: row => {
                this.handleUpdate(row);
              }
            },
            {
              text: "重置密码",
              visibleFn: rowdata => {
                return true;
              },
              color: "#E6A23C",
              cb: row => {
                this.$confirm("确定要重置密码吗？", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(() => {
                    resetPassword({
                      id: row.id
                    }).then(res => {
                      if (res.errno == "0") {
                        this.$alert(
                          "密码已被重置为“1234qwer“",
                          "重置密码成功",
                          {
                            confirmButtonText: "知道了",
                            callback: action => {}
                          }
                        );
                      }
                    });
                  })
                  .catch(error => {});
              }
            },
            {
              colorType: "danger",
              text: "删除",
              visibleFn: rowdata => {
                return true;
              },
              color: "#1890ff",
              cb: row => {
                this.handleDelete(row);
              }
            }
          ]
        }
      },
      uploadPath,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        email: "",
        emailNotice: "",
        wxOpenid: "",
        sort: "add_time",
        order: "desc"
      },
      dataFormDefault: {
        id: undefined,
        username: undefined,
        password: undefined,
        checkPassword: undefined,
        avatar: "",
        email: undefined,
        emailNotice: false,
        wxOpenid: ""
      },
      dataForm: {
        username:'',
        email:'',
        emailNotice:'',
        avatar:'',
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      // rules: {
      //   username: [
      //     { required: true, message: "管理员名称不能为空", trigger: "blur" }
      //   ],
      //   email: [
      //     { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      //     { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      //   ],
      //
      //   password: [
      //     { required: true, message: "密码不能为空", trigger: "blur" },
      //     { validator: validatePass, trigger: "blur" }
      //   ],
      //   checkPassword: [
      //     { required: true, message: "密码不能为空", trigger: "blur" },
      //     { validator: validatePass2, trigger: "blur" }
      //   ]
      // },
      downloadLoading: false,
      sendList:[]
    };
  },
  methods: {
    configRoleSave(roleForm) {
      let roleCode = roleForm.roleCode;
      let nodes = this.zTreeObj.getChangeCheckedNodes();
      if (nodes.length == 0) {
        this.$message({
          message: "请勾选或取消角色",
          type: "warning",
          center: true
        });
      } else {
        let addRoles = [];
        let deleteRoles = [];
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i][this.zTreeObj.setting.data.key.checked] == true) {
            // addRoles += nodes[i].privilegeCode + ",";
            addRoles.push(nodes[i].id);
          } else {
            // deleteRoles += nodes[i].privilegeCode + ",";
            deleteRoles.push(nodes[i].id);
          }
        }
        postPermissionOperator({
          adminId: roleForm.id,
          addRoles: addRoles,
          deleteRoles: deleteRoles
        })
          .then(res => {
            if (res.errno == "0") {
              this.$message({
                message: "恭喜你，角色配置成功!",
                type: "success",
                center: true
              });
              this.seachstartHandle();
              this.configRoleFormVisible = false;
            }
            this.saveLoading = false;
          })
          .catch(error => {
            this.saveLoading = false;
            this.$message({
              message: error.errmsg,
              type: "error"
            });
          });
      }
    },
    roleConfigHandle(rowdata) {
      this.roleForm = rowdata;
      this.configRoleFormVisible = true;
      this.$nextTick(() => {
        if (this.zTreeObj != null) {
          $.fn.zTree.destroy("roleTree");
          this.zTreeObj = null;
        }
        getRoleTree({
          adminId: rowdata.id
        })
          .then(res => {
            this.$nextTick(() => {
              this._roleTree(res.data);
            });
          })
          .catch(error => {
            this.$message({
              message: error.errmsg,
              type: "warning"
            });
          });
      });
    },
    _roleTree(data) {
      this.zTreeInit($("#roleTree"), data, this.setting);
    },
    zTreeInit(element, zNodes, setting) {
      this.zTreeObj = $.fn.zTree.init(element, setting, zNodes);
      this.zTreeObj.expandAll(true);
    },
    getList() {
      this.listLoading = true;
      listAdmin(this.listQuery)
        .then(response => {
          this.list = response.data.items;
          this.total = response.data.total;
          this.listLoading = false;
        })
        .catch(error => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
          this.$message({
            message: error.errmsg,
            type: "error"
          });
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    resetForm() {
      this.dataForm = {
        ...this.dataFormDefault
      };
    },
    uploadAvatar: function(response) {
      this.dataForm.avatar = response.data.url;
    },
    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.dataForm.password = "1234qwer";
        this.$refs["dataForm"].clearValidate();
      });
    },

    handleUpdate(row) {
      this.dataForm = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createSave(dataForm) {
      this.$refs[dataForm].validate(valid => {
        if (valid) {
          this.saveDis = true;
          createAdmin({ ...this.dataForm })
            .then(res => {
              if (res.errno == "0") {
                this.list.unshift(res.data);
                this.dialogFormVisible = false;
                this.$notify({
                  title: "成功",
                  message: "创建成功",
                  type: "success",
                  duration: 2000
                });
              }
              this.saveDisClear();
            })
            .catch(err => {
              setTimeout(function () {
                this.saveDis = false;
              },1000)
              this.saveDisClear();
            });
        } else {
          return false;
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.saveDis = true;
          updateAdmin({ ...this.dataForm })
            .then(res => {
              if (res.errno == "0") {
                for (const v of this.list) {
                  if (v.id === this.dataForm.id) {
                    const index = this.list.indexOf(v);
                    this.list.splice(index, 1, this.dataForm);
                    break;
                  }
                }
                this.dialogFormVisible = false;
                this.$message({
                  message: "更新成功",
                  type: "success"
                });
              }
              this.saveDisClear();
            })
            .catch(err => {
              this.$message({
                message: err.errmsg,
                type: "warning"
              });
              this.saveDisClear();
            });
        }
      });
    },
    saveDisClear() {
      this.saveDis = false;
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteAdmin(row)
            .then(response => {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            })
            .catch(err => {
              this.$message({
                message: err.errmsg,
                type: "warning"
              });
            });
        })
        .catch(error => {});
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "管理员ID",
          "管理员名称",
          "邮箱",
          "邮箱状态",
        ];
        const filterVal = [
          "id",
          "username",
          "email",
          "emailNotice",
        ];
        this.sendList = JSON.parse(JSON.stringify(this.list)).slice(0);
        for (let j in this.sendList){
          if(this.sendList[j].emailNotice === true){
            this.sendList[j].emailNotice = '开启';
          }else if(this.sendList[j].emailNotice === false){
            this.sendList[j].emailNotice = '关闭';
          }else {
            this.sendList[j].emailNotice = '';
          }
        }
        excel.export_json_to_excel2(tHeader, this.sendList, filterVal, "管理员信息");
        this.downloadLoading = false;
      });
    }
  },
  created() {
    this.$nextTick(() => {
      this.searchOptions.searchList.push(
        // 请注意 该数组里对象的corresattr属性值与listQuery里面的属性是一一对应的 不可少
        {
          corresattr: "username",
          type: "text", // 表单类型
          label: "管理员名称",
          placeholder: "请输入管理员名称",
          clearable: true, // 是否可清空
          defaultVlue: "", // 点击重置时恢复成defaultVlue
          value: this.listQuery.username, // 初始化默认值
          cb: value => {
            this.listQuery.username = value;
          }
        },
        // {
        //   corresattr: "wxOpenid",
        //   type: "text", // 表单类型
        //   label: "微信openid",
        //   placeholder: "请输入微信openid",
        //   clearable: true, // 是否可清空
        //   defaultVlue: "", // 点击重置时恢复成defaultVlue
        //   value: this.listQuery.wxOpenid, // 初始化默认值
        //   cb: value => {
        //     this.listQuery.wxOpenid = value;
        //   }
        // },
        {
          corresattr: "email",
          type: "text", // 表单类型
          label: "邮箱",
          placeholder: "请输入邮箱",
          clearable: true, // 是否可清空
          defaultVlue: "", // 点击重置时恢复成defaultVlue
          value: this.listQuery.email, // 初始化默认值
          cb: value => {
            this.listQuery.email = value;
          }
        },
        {
          corresattr: "emailNotice",
          type: "select",
          label: "邮箱开启",
          placeholder: "请选择邮箱开启状态",
          show: true, // 普通搜索显示
          defaultVlue: "", // 点击重置时恢复成defaultVlue
          value: this.listQuery.emailNotice,
          options: [
            {
              value: "",
              label: "全部"
            },
            ...this.statusFilterQuery("emailNotice")
          ],
          cb: value => {
            this.listQuery.emailNotice = value;
          }
        }
      );
    });
    this.getList();
  }
};
</script>
