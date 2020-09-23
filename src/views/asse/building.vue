<template>
  <div class="container">
    <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
      </div>
      <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="formInline.num" placeholder="请输入楼栋编号   " />
        </el-form-item>

        <el-form-item>
          <el-input v-model="formInline.name" placeholder="请输入楼栋名称   " />
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
        <p>楼栋列表</p>
        <!--右边按钮  -->
        <div class="tools-right">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="add">添加</el-button>
        </div>
        <!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
      </div>
      <div class="tw_form">
        <el-table :data="tableData" style="width: 100%" class="table" height="calc(100vh - 420px)">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="num" label="楼栋编号"></el-table-column>
          <el-table-column prop="name" label="楼栋名称"></el-table-column>
          <el-table-column prop="createName" label="创建员工"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit( scope.row)">编辑</el-button>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="楼栋编号:" prop="num">
          <el-input v-model="form.num"></el-input>
        </el-form-item>
        <el-form-item label="楼栋名称:" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="dltitle=='楼栋详情'" type="success" @click="addquarters('form')">确定</el-button>
          <el-button v-if="dltitle=='编辑小区'" type="success" @click="editquarters('form')">确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  addBuilding,
  editBuilding,
  getDetailBuilding,
  getPageList
  // getBuildingList
} from '@/api/building';
export default {
  name: 'OwnerIinformation',
  data() {
    return {
      input: '',
      tableData: [],
      formInline: {},
      communityId: 666,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      dialogVisible: false,
      // Propertyoptions: [],
      dltitle: '',
      form: {
        name: '',
        num: '',
        remark: ''
      },
      rules: {
        num: [{ required: true, message: '请输入楼栋编号', trigger: 'blur' }],
        name: [
          { required: true, message: '请输入楼栋名称', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请填写小区描述', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    // this.getPropertylist();
    // this.getAllListwuye();
    this.getList()
  },
  methods: {
    getList() {
      const params = {
        communityId: this.communityId,
        pageNo: this.pageNum,
        pageSize: this.pageSize,
        name: this.formInline.name,
        num: this.formInline.num
      }
      getPageList(params)
      .then(response => {
        console.log(response)
        this.tableData = response.data.dataList;
      })
      .catch(error => {
        console.log(error)
      })
    },
    cancel(formName) {
      this.$refs[formName].clearValidate();
      this.dialogVisible = false;
    },
    handleEdit(row) {
      this.dltitle = '编辑小区';
      getDetailBuilding(row.id)
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
      this.getList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;

      this.getList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;

      this.getList();
    },
    add() {
      this.form = {
        name: '',
        num: '',
        remark: ''
      };
      this.dltitle = '楼栋详情';
      this.dialogVisible = true;
    },
    addquarters(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form);
          addBuilding(this.form)
            .then(response => {
              console.log(response);
              this.dialogVisible = false;
              this.getList();
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
          editBuilding(this.form)
            .then(response => {
              console.log(response);
              this.dialogVisible = false;
              this.getList();
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log('error submit!!');
          return false;
        }
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
