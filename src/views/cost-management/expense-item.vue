<template>
  <div class="container">
    <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
      </div>
      <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.feeCycleType" clearable placeholder="请选择费用周期">
            <el-option
              v-for="item in feecycleoptions"
              :key="item.key"
              :label="item.codeName"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.feeType" clearable placeholder="选择费用类型">
            <el-option
              v-for="item in feeTypeoptions"
              :key="item.key"
              :label="item.codeName"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.name" placeholder="请输入费用项目" />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="onSubmit('formInline')"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="container_tw">
      <div class="tw_title">
        <p>物业列表</p>
        <!--右边按钮  -->
        <div class="tools-right">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="add">添加</el-button>
        </div>
        <!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
      </div>
      <div class="tw_form">
        <el-table :data="tableData" style="width: 100%" class="table" height="calc(100vh - 420px)">
          <el-table-column type="index" label="编号"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="feeType" label="费用类型"></el-table-column>
          <el-table-column prop="feeCycleType" label="费用周期类型"></el-table-column>
          <el-table-column prop="feeCycle" label="费用周期"></el-table-column>
          <el-table-column prop="unitPrice" label="计费单价"></el-table-column>
          <el-table-column prop="surcharge" label="附加/固定费用">
            <template slot-scope="scope">
              <span v-if="scope.row.unitPrice==0||scope.row.unitPrice==''">{{scope.row.surcharge}}</span>
              <span v-else>{{scope.row.fixedExpenses}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit( scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="text-align:center; margin-top:2em">
          <el-pagination
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 弹出框 -->
    <el-dialog
      :title="dltitle"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" label-position="left">
        <!-- <el-form-item label="物业公司:" prop="companyId">
          <el-select v-model="form.companyId" placeholder="请选择物业公司">
            <el-option
              v-for="item in Propertyoptions"
              :key="item.id"
              :label="item.companyName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="收费项目:" prop="name">
          <el-input v-model="form.name" style="width:200px" placeholder="收费项目"></el-input>
        </el-form-item>
        <el-form-item label="费用类型:" prop="feeType">
          <el-select v-model="form.feeType" clearable placeholder="请选择费用类型">
            <el-option
              v-for="item in feeTypeoptions"
              :key="item.key"
              :label="item.codeName"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用周期类型:" prop="feeCycleType">
          <el-select v-model="form.feeCycleType" clearable placeholder="请选择费用周期类型">
            <el-option
              v-for="item in feecycleoptions"
              :key="item.key"
              :label="item.codeName"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="费用周期：" prop="feeCycle">
          <el-select v-model="form.feeCycle" clearable placeholder="请选择费用周期">
            <el-option
              v-for="item in fee_cycleoptions"
              :key="item.key"
              :label="item.codeName"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计费起始时间：" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            value-format="timestamp"
            style="width:200px"
            placeholder="计费起始时间："
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="计费终止时间：" prop="endDate">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            value-format="timestamp"
            style="width:200px"
            placeholder="计费终止时间："
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="计算公式：" prop="formula">
          <el-select v-model="form.formula" clearable placeholder="计算公式">
            <el-option
              v-for="item in fee_formulaoptions"
              :key="item.key"
              :label="item.codeName"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固定费用：" prop="fixedExpenses">
          <el-input v-model="form.fixedExpenses" style="width:200px" placeholder="固定费用"></el-input>
        </el-form-item>
        <el-form-item v-if="form.formula!='fixed.fee'" label="计算单价：" prop="unitPrice">
          <el-input v-model="form.unitPrice" style="width:200px" placeholder="计算单价"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="dltitle=='添加费用配置'" type="success" @click="addquarters('form')">确定</el-button>
          <el-button v-if="dltitle=='修改费用配置'" type="success" @click="editquarters('form')">确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="gugedialogVisible"
      :close-on-click-modal="false"
      width="1000px"
      style="height:900px"
    >
      <GOGEMAp ref="child" @getlat="getMsgFormSon"></GOGEMAp>
      <span slot="footer" class="dialog-footer">
        <el-button @click="gugedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getguge">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  payfeeconfiglist,
  payfeeconfigid,
  addpayfeeconfig
} from "../../api/expenseitem";
import { getcommontype } from "../../api/commontype";

import GOGEMAp from "../guge/guge";
export default {
  name: "OwnerIinformation",
  components: { GOGEMAp },
  data() {
    return {
      input: "",
      tableData: [],
      formInline: {},
      pageSize: 10,
      pageNum: 1,
      total: 0,
      dialogVisible: false,
      gugedialogVisible: false,
      feeTypeoptions: [],
      feecycleoptions: [],
      fee_formulaoptions: [],
      fee_cycleoptions: [],
      dltitle: "",
      form: {
        endDate: "",
        feeCycle: "",
        feeCycleType: "",
        feeType: "",
        fixedExpenses: "",
        formula: "",
        name: "",
        startDate: "",
        surcharge: "",
        unitPrice: ""
      },
      imageUrl: "",
      rules: {
        name: [{ required: true, message: "请输入小区名称", trigger: "blur" }],
        feeType: [
          { required: true, message: "请选择费用类型", trigger: "change" }
        ],
        feeCycleType: [
          { required: true, message: "请选择费用周期类型", trigger: "change" }
        ],
        feeCycle: [
          { required: true, message: "请选择费用周期", trigger: "change" }
        ],
        startDate: [
          { required: true, message: "请选择费计费起始时间", trigger: "change" }
        ],
        endDate: [
          { required: true, message: "请选择费计费终止时间", trigger: "change" }
        ],
        formula: [
          { required: true, message: "请选择费计算公式", trigger: "change" }
        ],
        fixedExpenses: [
          { required: true, message: "请输入固定费用", trigger: "blur" }
        ],
        unitPrice: [
          { required: true, message: "请输入计算单价", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getPropertylist();
    this.getcommontypelist("pro_fee_type");
    this.getcommontypelist("fee_cycle_type");
    this.getcommontypelist("fee_cycle");
    this.getcommontypelist("fee_formula");
  },
  methods: {
    getcommontypelist(type) {
      let data = {
        type: type
      };
      getcommontype(data)
        .then(response => {
          console.log(response);
          if (type == "pro_fee_type") {
            this.feeTypeoptions = response.data;
          }
          if (type == "fee_cycle_type") {
            this.feecycleoptions = response.data;
          }
          if (type == "fee_cycle") {
            this.fee_cycleoptions = response.data;
          }
          if (type == "fee_formula") {
            this.fee_formulaoptions = response.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancel(formName) {
      this.$refs[formName].clearValidate();
      this.dialogVisible = false;
    },
    handleEdit(row) {
      this.dltitle = "修改费用配置";
      let data = {
        id: row.id,
        method: "get"
      };
      payfeeconfigid(data)
        .then(response => {
          console.log(response);

          this.form = response.data;
          this.dialogVisible = true;
          // this.Propertyoptions = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleDelete(row) {
      this.$confirm("确定删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            id: row.id,
            method: "DELETE"
          };
          payfeeconfigid(data)
            .then(response => {
              this.getPropertylist();
              // this.Propertyoptions = response.data;
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    onSubmit() {
      this.getPropertylist();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    getguge() {
      this.$refs.child.callMethod();
    },
    getMsgFormSon(data) {
      console.log(data);
      this.form.address = data.address;
      this.form.mapLat = data.lat;
      this.form.mapLon = data.lon;
      this.gugedialogVisible = false;
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;

      this.getPropertylist();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;

      this.getPropertylist();
    },
    add() {
      this.form = {
        endDate: "",
        feeCycle: "",
        feeCycleType: "",
        feeType: "",
        fixedExpenses: "",
        formula: "",
        name: "",
        startDate: "",
        surcharge: "",
        unitPrice: ""
      };

      this.dltitle = "添加费用配置";
      this.dialogVisible = true;
    },
    addquarters(formName) {
      console.log(this.form);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.method = "post";
          addpayfeeconfig(this.form)
            .then(response => {
              console.log(response);
              this.dialogVisible = false;
              this.getPropertylist();
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editquarters(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form);
          this.form.method = "put";
          addpayfeeconfig(this.form)
            .then(response => {
              console.log(response);
              this.dialogVisible = false;
              this.getPropertylist();
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getPropertylist() {
      const param = {
        feeType: this.formInline.feeType,
        feeCycleType: this.formInline.feeCycleType,
        name: this.formInline.name,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      payfeeconfiglist(param)
        .then(response => {
          console.log(response);

          //   for (let index = 0; index < response.data.dataList.length; index++) {
          //     const element = response.data.dataList[index];
          //     if (element.adminState == 0) {
          //       element.status = false;
          //     }
          //     if (element.adminState == 1) {
          //       element.status = true;
          //     }
          //   }

          this.tableData = response.data.dataList;
          this.total = response.data.total;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang='scss'>
.container {
  padding: 20px;
}
.container_on {
  padding: 20px;
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
  margin-top: 20px;
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
/*弹出框*/
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
