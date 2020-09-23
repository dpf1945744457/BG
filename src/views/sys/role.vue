<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <myp-search-form @changeform="callbackformHandle" @resetInput="resetSearchHandle" @seachstart="seachstartHandle" :searchOptions="searchOptions"></myp-search-form>
    <div class="operation-box">
      <el-button size="small" class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
    </div>
    <!-- 查询结果 -->
    <TableData :list="list" :listLoading="listLoading" :loadingText="'正在查询中。。。'" :tableColumn="tableSet.tableColumn" :operation="tableSet.operation" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :currentPage="listQuery.page" :currentLimit="listQuery.limit" :total="total" @operationHandle="operationHandle">
    </TableData>
    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编号" prop="code">
          <el-input type="text" v-model="dataForm.code" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button :disabled="saveDis" v-if="dialogStatus=='create'" type="primary" @click="createSave">确定</el-button>
        <el-button :disabled="saveDis" v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <!-- 配置权限 start -->
    <el-dialog ref="roleTreebox" title="配置角色权限" center :visible.sync="configRoleFormVisible" width="500px">
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
  getRoleList,
  postRoleAdd,
  postRoleUpdate,
  postRoleDelete,
  postRoleMenuBind,
  getRolePermissionTree
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
    }
  },
  data() {
    return {
      roleForm: {
        roleCode: "",
        defaultCheckdMenu: [],
        defaultCheckdFunction: []
      }, // 设置角色表单
      configRoleFormVisible: false,
      setting: {
        // view: {
        //   addHoverDom: this.addHoverDom,
        //   removeHoverDom: this.removeHoverDom,
        //   selectedMulti: false
        // },
        check: {
          enable: true
        },
        data: {
          simpleData: {
            enable: false
            // idKey: "menuCode",
            // pIdKey: "parentCode"
          },
          keep: {
            leaf: false,
            parent: true
          },
          key: {
            name: "menuName",
            children: "childs",
            menuCode: "menuCode",
            checked: "checked"
          }
        }
      },
      saveDis: false,
      searchOptions: {
        lableWidth: "100px",
        searchList: []
      },
      tableSet: {
        tableColumn: [
          // table列信息 key=>表头标题，word=>表内容信息
          {
            key: "角色ID",
            width: "120px",
            word: "id"
          },
          {
            key: "角色名称",
            width: "120px",
            word: "name"
          },
          {
            key: "角色编号",
            width: "120px",
            word: "code"
          },
          {
            key: "状态",
            width: "150px",
            word: "deleted",
            status: true,
            type: data => {
              return this.statusFilter(data, "roleStatus");
            }
          }
        ],
        operation: {
          width: "220px",
          options: [
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
              text: "配置权限",
              word: "configPre",
              colorType: "success",
              visibleFn: rowdata => {
                return true;
              },
              loading: true,
              color: "#E6A23C",
              cb: (rowdata, operationLoading, index) => {
                this.roleForm = {
                  id: rowdata.id,
                  code: rowdata.code,
                  name: rowdata.name
                };
                getRolePermissionTree({
                  roleId: rowdata.id
                })
                  .then(res => {
                    if (res.errno == "0") {
                      let data = res.data;
                      this.configRoleFormVisible = true;
                      this.$nextTick(() => {
                        this._roleTree(data);
                      });
                    }
                    operationLoading[index] = false;
                  })
                  .catch(error => {
                    this.$message({
                      message: error.errmsg,
                      type: "warning"
                    });
                    operationLoading[index] = false;
                  });
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
        // username: undefined,
        // email: "",
        // emailNotice: "",
        // wxOpenid: "",
        sort: "add_time",
        order: "desc"
      },
      dataFormDefault: {
        code: "",
        name: ""
      },
      dataForm: {},
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        code: [{ required: true, message: "角色编号不能为空", trigger: "blur" }]
      },
      downloadLoading: false
    };
  },
  created() {
    this.$nextTick(() => {
      this.searchOptions.searchList.push(
        // 请注意 该数组里对象的corresattr属性值与listQuery里面的属性是一一对应的 不可少
        {
          corresattr: "id",
          type: "text", // 表单类型
          label: "角色ID",
          placeholder: "角色ID",
          clearable: true, // 是否可清空
          defaultVlue: "", // 点击重置时恢复成defaultVlue
          value: this.listQuery.id, // 初始化默认值
          cb: value => {
            this.listQuery.id = value;
          }
        },
        {
          corresattr: "code",
          type: "text", // 表单类型
          label: "角色编号",
          placeholder: "角色编号",
          clearable: true, // 是否可清空
          defaultVlue: "", // 点击重置时恢复成defaultVlue
          value: this.listQuery.code, // 初始化默认值
          cb: value => {
            this.listQuery.code = value;
          }
        },
        {
          corresattr: "name",
          type: "text", // 表单类型
          label: "角色名称",
          placeholder: "请输入角色名称",
          clearable: true, // 是否可清空
          defaultVlue: "", // 点击重置时恢复成defaultVlue
          value: this.listQuery.name, // 初始化默认值
          cb: value => {
            this.listQuery.name = value;
          }
        }

        // {
        //   corresattr: "emailNotice",
        //   type: "select",
        //   label: "状态",
        //   placeholder: "请选择邮箱开启状态",
        //   show: true, // 普通搜索显示
        //   defaultVlue: "", // 点击重置时恢复成defaultVlue
        //   value: this.listQuery.emailNotice,
        //   options: [
        //     {
        //       value: "",
        //       label: "全部"
        //     },
        //     ...this.statusFilterQuery("emailNotice")
        //   ],
        //   cb: value => {
        //     this.listQuery.emailNotice = value;
        //   }
        // }
      );
    });
    this.getList();
  },
  methods: {
    // filterCheckedData(data, arr) {
    //   // let arr = [];
    //   if (data.length > 0) {
    //     for (var i = 0; i < data.length; i++) {
    //       let node = data[i];
    //       let menuCode = node.menuCode;
    //       let childs = node.childs;
    //       console.log(menuCode);
    //       console.log(childs);
    //       arr.push(menuCode);
    //       if (childs && childs.length > 0) {
    //         this.filterCheckedData(childs, arr);
    //       }
    //     }
    //   }
    //   // console.log(arr);
    // },
    configRoleSave(roleForm) {
      let roleCode = roleForm.code;
      let nodes = this.zTreeObj.getChangeCheckedNodes();
      if (nodes.length == 0) {
        this.$message({
          message: "请勾选或取消菜单权限",
          type: "warning",
          center: true
        });
      } else {
        let addMenuCodes = []; // 勾选项code菜单组
        let deleteMenuCodes = []; // 未勾选项code菜单组
        let addFuncCodes = []; // 勾选项code功能组
        let deleteFuncCodes = []; // 未勾选项code功能组
        let arr = [];
        // this.filterCheckedData(nodes, arr);
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i][this.zTreeObj.setting.data.key.checked] == true) {
            // addMenuCodes += nodes[i].menuCode + ",";
            if (nodes[i].type == "0") {
              addMenuCodes.push(nodes[i].menuCode);
            } else if (nodes[i].type == "1") {
              addFuncCodes.push(nodes[i].menuCode);
            }
          } else {
            if (nodes[i].type == "0") {
              deleteMenuCodes.push(nodes[i].menuCode);
            } else if (nodes[i].type == "1") {
              deleteFuncCodes.push(nodes[i].menuCode);
            }
          }
        }
        this.saveLoading = true;
        let sendData = {
          roleCode: roleCode,
          addMenuCodes: addMenuCodes,
          deleteMenuCodes: deleteMenuCodes
        };
        postRoleMenuBind(sendData)
          .then(res => {
            if (res.errno == "0") {
              this.$message({
                message: "恭喜你，角色修改成功!",
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
    addHoverDom(treeId, treeNode) {
      this.treeNodeObj = treeNode;
      var sObj = $("#" + treeNode.tId + "_span");
      if (
        !treeNode.isParent ||
        treeNode.editNameFlag ||
        $("#addBtn_" + treeNode.tId).length > 0
      ) {
        return;
      }
      var addStr =
        "<span class='button add' id='addBtn_" +
        treeNode.tId +
        "' title='添加菜单' onfocus='this.blur();'></span>";
      sObj.after(addStr);
      var btn = $("#addBtn_" + treeNode.tId);
      if (btn) {
        btn.bind("click", () => {
          // 点击新增按钮
          // treeNode.menuCode
          this.visibleType = "ADD";
          this.editVisible = false;
          this.addForm = { ...this.addFormDefaultData };
          this.addForm.parentCode = treeNode.menuCode;
          this.addFormVisible = true;
          return false;
        });
      }
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
      getRoleList(this.listQuery)
        .then(res => {
          this.list = res.data.dataList;
          this.total = res.data.total;
          this.listLoading = false;
        })
        .catch(error => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
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
        this.$refs["dataForm"].clearValidate();
      });
    },

    handleUpdate(row) {
      this.dialogStatus = "update";
      this.dataForm = {
        id: row.id,
        code: row.code,
        name: row.name
      };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createSave() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.saveDis = true;
          postRoleAdd({ ...this.dataForm })
            .then(res => {
              if (res.errno == "0") {
                // this.list.unshift(res.data);
                this.seachstartHandle();
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
              this.saveDisClear();
            });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.saveDis = true;
          postRoleUpdate({ ...this.dataForm })
            .then(res => {
              if (res.errno == "0") {
                this.getList();
                this.dialogFormVisible = false;
                this.$message({
                  message: "更新成功",
                  type: "success"
                });
              }
              this.saveDisClear();
            })
            .catch(err => {
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
          postRoleDelete({
            roleId: row.id
          })
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
    }
  }
};
</script>
