<template>
  <div class="app-container calendar-list-container">
    <div class="admin-main-box tree-table-box">
      <div class="zTreeDemoBackground left">
        <ul id="rootTreeNenu" class="ztree"></ul>
      </div>
      <div class="table-box" v-show="tableVisible">
        <el-button-group class="button-group">
          <el-button class="mybutton" @click="addFuncDialog" size="small" type="primary" icon="el-icon-plus">新增</el-button>
        </el-button-group>
        <TableData :list="list" :listLoading="listLoading" :loadingText="'正在查询中。。。'" :tableColumn="tableSet.tableColumn" :operation="tableSet.operation" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :currentPage="listQuery.page" :currentLimit="listQuery.limit" :total="total" @operationHandle="operationHandle">
        </TableData>
      </div>
    </div>
    <!-- 新增菜单 start -->
    <el-dialog :title="meneDialogType" center :visible.sync="addFormVisible" width="500px">
      <el-form size="small" :model="addForm" ref="addForm" :rules="addFormRules">
        <el-form-item label="菜单名称" prop="menuName" :label-width="formLabelWidth">
          <el-input v-model="addForm.menuName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单编号" prop="menuCode" :label-width="formLabelWidth">
          <el-input :disabled="editVisible?true:false" v-model="addForm.menuCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否有下级菜单">
          <el-switch :disabled="editVisible?true:false" v-model="addForm.isParent" active-value="TRUE" inactive-value="FALSE" active-text="是" inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item v-if="editVisible?(addForm.isParent=='TRUE'?false:true):(addForm.isParent=='TRUE'?false:true)" label="菜单url" prop="url" :label-width="formLabelWidth">
          <el-input v-model="addForm.url" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button :loading="saveLoading" type="primary" @click="dataSave('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增编辑 start -->
    <el-dialog title="修改功能" center :visible.sync="editFuncFormVisible" width="500px">
      <el-form size="small" :model="editFuncForm" ref="editFuncForm" :rules="addFormRules">
        <el-form-item label="归属菜单" prop="menuName" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="editFuncForm.menuName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="functionType=='ADD'?true:false" label="功能类型" :label-width="formLabelWidth">
          <el-select @change="functionTypeChange" prop="functiontype" v-model="editFuncForm.functiontype" placeholder="功能类型">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能名称" prop="functionName" :label-width="formLabelWidth">
          <el-input v-model="editFuncForm.functionName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="功能url" prop="url" :label-width="formLabelWidth">
          <el-input v-model="editFuncForm.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="请求方法" :label-width="formLabelWidth">
          <el-select prop="httpMethod" v-model="editFuncForm.httpMethod" placeholder="是否有下级菜单">
            <el-option v-for="item in httpMethodOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能编号" prop="functionCode" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="editFuncForm.functionCode" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFuncFormVisible = false">取 消</el-button>
        <el-button :loading="saveLoading" type="primary" @click="functionSave('editFuncFormVisible')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 功能编辑 end -->
  </div>
</template>
<style lang='scss' scoped>
@import "../../common/zTree/css/metroStyle/metroStyle.css";
.tree-table-box {
  display: flex;
  flex-direction: row;
  .button-group {
    margin-bottom: 10px;
  }
  .tree-box {
    flex-shrink: 0;
    overflow: auto;
    width: 250px;
  }
  .table-box {
    flex-shrink: 1;
    width: 100%;
    padding-top: 10px;
  }
}
</style>
<script>
import { getToken } from "@/api/api_token";
import $ from "jquery";
import "@/common/zTree/js/jquery.ztree.all.js";
import TableData from "@/components/TableData";
import {
  getPermissions,
  postPermissionAdd,
  postPermissionUpdate,
  getPermissionDelete,
  getRolePermissionDelete,
  getRolePermissionDeleteList,
  getMenuFunction,
  postAddMenuFunction,
  postUpdateMenuFunction,
  postDeleteMenuFunction
} from "@/api/menu_manage";
import base from "@/api/base";
import { searchMixin } from "@/common/searchMixin";
import { operationMixin } from "@/common/operationMixin.js";
import { mapGetters } from 'vuex';
export default {
  name: "",
  components: {
    TableData
  },
  mixins: [searchMixin, operationMixin],
  data() {
    var httpMethodOptions = [
      {
        value: "GET",
        label: "GET"
      },
      {
        value: "POST",
        label: "POST"
      },
      {
        value: "PATCH",
        label: "PATCH"
      },
      {
        value: "DELETE",
        label: "DELETE"
      },
      {
        value: "PUT",
        label: "PUT"
      },
      {
        value: "HEADN",
        label: "HEADN"
      },
      {
        value: "OPTIONS",
        label: "OPTIONS"
      }
    ];
    return {
      //编辑start
      // 功能类型
      typeOptions: [
        {
          value: "add",
          label: "新增"
        },
        {
          value: "edit",
          label: "修改"
        },
        {
          value: "page",
          label: "分页查询"
        },
        {
          value: "delete",
          label: "删除"
        }
      ],
      functionType: "",
      editFuncFormDefault: {
        httpMethod: "",
        functiontype: "",
        functionName: "",
        url: "",
        functionCode: ""
      },
      editFuncForm: {},
      editFuncFormVisible: false,
      httpMethodOptions: httpMethodOptions,
      //编辑end
      functionMenu: {},
      menuFunctionParentNode: {},
      visibleType: "",
      editVisible: false,
      formLabelWidth: "100px",
      saveLoading: false,
      addFormVisible: false,
      addFormRules: {},
      zTreeObj: {},
      addFormDefaultData: {
        isParent: "FALSE"
      },
      addForm: {},
      setting: {
        view: {
          addHoverDom: this.addHoverDom,
          removeHoverDom: this.removeHoverDom,
          selectedMulti: false
        },
        check: {
          enable: true
        },
        data: {
          simpleData: {
            enable: true,
            idKey: "menuCode",
            pIdKey: "parentCode"
          },
          keep: {
            leaf: false,
            parent: true
          },
          key: {
            name: "menuName"
          }
        },
        edit: {
          enable: true
        },
        callback: {
          onAsyncSuccess: this.zTreeOnAsyncSuccess,
          beforeEditName: this.beforeEditName,
          beforeRemove: this.beforeRemove,
          onClick: this.zTreeOnClick,
          beforeDrag: this.zTreeBeforeDrag,
          beforeDrop: this.zTreeBeforeDrop
        }
      },
      // tablestart
      tableVisible: false,
      tableSet: {
        tableColumn: [
          // table列信息 key=>表头标题，word=>表内容信息
          {
            key: "功能名称",
            width: "120px",
            word: "functionName"
          },
          {
            key: "功能编号",
            width: "120px",
            word: "menuCode"
          },
          {
            key: "url",
            width: "120px",
            word: "url"
          },
          {
            key: "请求方式",
            width: "120px",
            word: "httpMethod"
          }
        ],
        operation: {
          width: "130px",
          options: [
            {
              text: "编辑",
              visibleFn: rowdata => {
                return true;
              },
              color: "#1890ff",
              cb: rowdata => {
                this.functionType = "EDIT";
                this.editFuncForm = rowdata;
                this.editFuncForm.menuName = this.functionMenu.menuName;
                this.editFuncFormVisible = true;
              }
            },
            {
              text: "删除",
              colorType: "danger",
              visibleFn: rowdata => {
                return true;
              },
              color: "#E6A23C",
              cb: rowdata => {
                this.$confirm("此操作将永久删除该功能, 是否继续?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(() => {
                  let functionId = [rowdata.id];
                  this.DeleteFunctions(functionId);
                });
              }
            }
          ]
        }
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: "add_time",
        order: "desc"
      },
      // tableend

      perms:''
    };
  },
  created() {
    this.init();
    this.perms = JSON.stringify(this.menuList);
  },
  methods: {
    init() {
      getPermissions().then(res => {
        if (res.errno == "0") {
          let data = res.data;
          $.fn.zTree.init($("#rootTreeNenu"), this.setting, data);
          this.expandAll();
        }
      });
    },
    expandAll() {
      // var tree = $.fn.zTree.getZTreeObj("rootTreeNenu");
      // tree.expandAll(tree);
      var tree = $.fn.zTree.getZTreeObj("rootTreeNenu");
      var nodes = tree.transformToArray(tree.getNodes());
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].level == 0) {
          //根节点展开
          tree.expandNode(nodes[i], true, true, false);
        } else {
          tree.expandNode(nodes[i], false, true, false);
        }
      }
    },
    // closeTree(nodes) {
    //   var tree = $.fn.zTree.getZTreeObj("rootTreeNenu");
    //   //获取 zTree 的全部节点数据将节点数据转换为简单 Array 格式
    //   var nodes = tree.transformToArray(tree.getNodes());
    //   for (var i = 0; i < nodes.length; i++) {
    //     if (nodes[i].level == 0) {
    //       //根节点展开
    //       tree.expandNode(nodes[i], true, true, false);
    //     } else {
    //       tree.expandNode(nodes[i], false, true, false);
    //     }
    //   }
    // },
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
    removeHoverDom(treeId, treeNode) {
      $("#addBtn_" + treeNode.tId)
        .unbind()
        .remove();
    },
    // 新增
    dataSave() {
      // 保存新增信息
      this.saveLoading = true;
      var addForm = this.addForm;
      let saveApi = "";
      let successMessage = "";
      addForm.isParent = addForm.isParent.toString().toUpperCase();
      if (this.visibleType == "EDIT") {
        // 编辑
        this.updateSave(addForm);
      } else if (this.visibleType == "ADD") {
        // 新增
        this.addSave(addForm);
      }
    },
    // 新增
    addSave(addForm) {
      postPermissionAdd({
        ...addForm
      })
        .then(res => {
          if (res.errno == "0") {
            this.$message({
              type: "success",
              message: "恭喜您，修改成功!"
            });
            this.init();
            this.addFormVisible = false;
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
    },
    // 编辑
    updateSave(addForm) {
      postPermissionUpdate({
        ...addForm
      })
        .then(res => {
          if (res.errno == "0") {
            this.$message({
              type: "success",
              message: "恭喜您，修改成功!"
            });
            this.init();
            this.addFormVisible = false;
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
    },
    // 新增

    // 点击编辑按钮
    beforeEditName(treeId, treeNode) {
      this.visibleType = "EDIT";
      this.editVisible = true;
      this.addForm = {};
      this.treeNodeObj = treeNode.getParentNode();
      this.addForm = treeNode;
      if (treeNode.isParent) {
        this.addForm.isParent = "TRUE";
      } else {
        this.addForm.isParent = "FALSE";
      }
      this.addFormVisible = true;
    },
    // 点击删除按钮
    beforeRemove(treeId, treeNode) {
      if (
        treeNode.isParent &&
        treeNode.children != null &&
        treeNode.children.length != 0
      ) {
        this.$message({
          message: "操作失败: 请先删除该菜单下的子菜单",
          type: "warning"
        });
        return false;
      }
      // return false;
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          getPermissionDelete({
            menuCode: treeNode.menuCode
          })
            .then(res => {
              if (res.errno == "0") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.init();
              }
            })
            .catch(error => {
              this.$message({
                type: "warning",
                message: error.errmsg
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      return false;
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
    // 新增功能弹出显示
    addFuncDialog() {
      this.functionType = "ADD";
      this.editFuncForm = { ...this.editFuncFormDefault };
      this.editFuncForm.httpMethod = "GET";
      let functionMenu = this.functionMenu;
      this.$set(this.editFuncForm, "menuName", functionMenu.menuName);
      this.editFuncFormVisible = true;
    },
    zTreeOnClick(event, treeId, treeNode) {
      if (treeNode.isParent) {
        // this.zTreeObj.expandNode(treeNode, null, null, null);
      } else {
        this.functionMenu = treeNode; // 同步当前所点击的菜单menuCode
        this.menuFunctionParentNode = treeNode;
        // // 更新数据
        this.$set(this.listQuery, "menuCode", treeNode.menuCode);
        this.seachstartHandle();
        // // 显示表格
        this.tableVisible = true;
      }
      return false;
    },
    // 新增菜单功能类型改变
    functionTypeChange(data) {
      if (data.value == "") {
        return false;
      }
      let menuCode = this.functionMenu.menuCode;
      let functionName = "";
      let url = "/" + menuCode;
      if (data == "add") {
        this.editFuncForm.httpMethod = "POST";
        functionName = "新增";
      } else if (data == "edit") {
        functionName = "修改";
        this.editFuncForm.httpMethod = "PATCH";
      } else if (data == "page") {
        functionName = "分页查询";
        this.editFuncForm.httpMethod = "GET";
        url += "/page";
      } else if (data == "delete") {
        functionName = "删除";
        this.editFuncForm.httpMethod = "DELETE";
        url += "/delete/*";
      }
      this.editFuncForm.functionName = functionName;
      this.editFuncForm.url = url;
      this.editFuncForm.functionCode = menuCode + "_" + data;
    },
    functionSave() {
      // 修改功能保存
      this.saveLoading = true;
      var editFuncForm = this.editFuncForm;
      if (this.functionType == "ADD") {
        this.addFunctionSave(editFuncForm);
      }
      if (this.functionType == "EDIT") {
        this.updateFunctionSave(editFuncForm);
      }
    },
    // 新增功能保存
    addFunctionSave(editFuncForm) {
      postAddMenuFunction({
        menuCode: this.functionMenu.menuCode,
        functionName: editFuncForm.functionName,
        url: editFuncForm.url,
        httpMethod: editFuncForm.httpMethod,
        functionCode: editFuncForm.functionCode
      })
        .then(data => {
          if (data.errno == "0") {
            this.$message({
              type: "success",
              message: "恭喜您，功能更改成功!"
            });
            // 更新数据
            this.listQuery = {
              // 查询条件
              menuCode: this.functionMenu.menuCode,
              page: 1,
              limit: 10
            };
            this.seachstartHandle();
            this.editFuncFormVisible = false;
          }
          this.saveLoading = false;
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: data.msg
          });
        });
    },
    //编辑功能保存
    updateFunctionSave(editFuncForm) {
      postUpdateMenuFunction({
        id: editFuncForm.id,
        menuCode: this.functionMenu.menuCode,
        functionName: editFuncForm.functionName,
        url: editFuncForm.url,
        httpMethod: editFuncForm.httpMethod,
        functionCode: editFuncForm.functionCode
      })
        .then(data => {
          if (data.errno == "0") {
            this.$message({
              type: "success",
              message: "恭喜您，功能更改成功!"
            });
            // 更新数据
            this.listQuery = {
              // 查询条件
              menuCode: this.functionMenu.menuCode,
              page: 1,
              limit: 10
            };
            this.seachstartHandle();
            this.editFuncFormVisible = false;
          }
          this.saveLoading = false;
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: data.msg
          });
        });
    },
    // 删除功能
    DeleteFunctions(functionId) {
      postDeleteMenuFunction(functionId)
        .then(data => {
          if (data.errno == "0") {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            // 更新数据
            this.listQuery = {
              menuCode: this.functionMenu.menuCode,
              page: 1,
              limit: 10
            };
            this.seachstartHandle();
          }
        })
        .catch(error => {
          this.$message({
            message: error.errmsg,
            type: "error"
          });
        });
    },
    getList() {
      this.listLoading = true;
      getMenuFunction(this.listQuery)
        .then(res => {
          this.list = res.data;
          // this.total = res;
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
    }
  },
  computed: {
    meneDialogType() {
      if (this.visibleType == "EDIT") {
        return "编辑菜单";
      } else if (this.visibleType == "ADD") {
        return "新增菜单";
      }
    },

    ...mapGetters([
      'menuList'
    ])
  }
};
</script>
