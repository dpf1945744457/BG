<template>
  <div class="container">
    <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
      </div>
      <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.companyId" clearable placeholder="请选择物业">
            <el-option
              v-for="item in Propertyoptions"
              :key="item.id"
              :label="item.companyName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input v-model="formInline.name" placeholder="请输入小区名称   " />
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
        <p>小区列表</p>
        <!--右边按钮  -->
        <div class="tools-right">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="add">添加</el-button>
        </div>
        <!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
      </div>
      <div class="tw_form">
        <el-table :data="tableData" style="width: 100%" class="table" height="calc(100vh - 420px)">
          <el-table-column type="index" label="编号"></el-table-column>
          <el-table-column prop="companyName" label="物业名称"></el-table-column>
          <el-table-column prop="name" label="小区名称"></el-table-column>
          <el-table-column prop="phone" label="联系电话"></el-table-column>
          <el-table-column prop="createUserName" label="创建员工"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit( scope.row)">编辑</el-button>
              <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
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
        <el-form-item label="物业公司:" prop="companyId">
          <el-select v-model="form.companyId" placeholder="请选择物业公司">
            <el-option
              v-for="item in Propertyoptions"
              :key="item.id"
              :label="item.companyName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小区名称:" prop="name">
          <el-input v-model="form.name" style="width:200px" placeholder="小区名称"></el-input>
        </el-form-item>
        <el-form-item label="小区电话:" prop="phone">
          <el-input v-model="form.phone" style="width:200px" placeholder="小区电话"></el-input>
        </el-form-item>
        <el-form-item label="详细地址:" prop="address">
          <el-input v-model="form.address" disabled style="width:200px" placeholder="详细地址"></el-input>
          <i class="el-icon-location" style="font-size: 20px;" @click="gugedialogVisible = true"></i>
        </el-form-item>

        <el-form-item label="小区描述:" prop="decription">
          <el-input
            v-model="form.decription"
            type="textarea"
            style="width:200px"
            placeholder="小区描述"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="dltitle=='新增小区'" type="success" @click="addquarters('form')">确定</el-button>
          <el-button v-if="dltitle=='编辑小区'" type="success" @click="editquarters('form')">确定</el-button>
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
  getList,
  addComm,
  getAllList,
  getDetail,
  editComm
} from '../../api/neighborhood';
import GOGEMAp from '../guge/guge';
export default {
  name: 'OwnerIinformation',
  components: { GOGEMAp },
  data() {
    return {
      input: '',
      tableData: [],
      formInline: {},
      pageSize: 10,
      pageNum: 1,
      total: 0,
      dialogVisible: false,
      gugedialogVisible: false,
      Propertyoptions: [],
      dltitle: '',
      form: {
        address: '',
        companyId: '',
        decription: '',
        mapLat: '',
        mapLon: '',
        name: '',
        phone: ''
      },
      imageUrl: '',
      rules: {
        name: [{ required: true, message: '请输入小区名称', trigger: 'blur' }],
        companyId: [
          { required: true, message: '请选择物业公司', trigger: 'change' }
        ],

        address: [
          { required: true, message: '请选择小区地址', trigger: 'blur' }
        ],
        decription: [
          { required: true, message: '请填写小区描述', trigger: 'blur' }
        ],
        phone: [{ required: true, message: '请填写小区电话', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getPropertylist();
    this.getAllListwuye();
  },
  methods: {
    getAllListwuye() {
      getAllList()
        .then(response => {
          console.log(response);
          this.Propertyoptions = response.data;
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
      this.dltitle = '编辑小区';
      getDetail(row.id)
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
        address: '',
        companyId: '',
        decription: '',
        mapLat: '',
        mapLon: '',
        name: '',
        phone: ''
      };

      this.dltitle = '新增小区';
      this.dialogVisible = true;
    },
    addquarters(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form);

          addComm(this.form)
            .then(response => {
              console.log(response);
              this.dialogVisible = false;
              this.getPropertylist();
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    editquarters(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form);
          editComm(this.form)
            .then(response => {
              console.log(response);
              this.dialogVisible = false;
              this.getPropertylist();
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getPropertylist() {
      const param = {
        companyId: this.formInline.companyId,
        name: this.formInline.name,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getList(param)
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
