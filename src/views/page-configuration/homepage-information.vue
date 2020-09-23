<template>
  <div class="container">
    <div class="container_tw">
      <div class="tw_title">
        <p>启动页列表</p>
        <!--右边按钮  -->
        <div class="tools-right">
          <el-button type="success" class="tools-button" @click="addurl()">
            <i class="el-icon-circle-plus-outline"></i> 添加
          </el-button>
        </div>
        <!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
      </div>
      <div class="tw_form">
        <el-table :data="tableData" style="width: 100%" class="table" height="calc(100vh - 280px)">
          <el-table-column prop="indexNum" label="序号"></el-table-column>
          <el-table-column prop="name" label="图片名称"></el-table-column>
          <el-table-column prop="pic" label="图片">
            <template slot-scope="scope">
              <el-image style="width: 100px; height: 100px" :src="scope.row.pic"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
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
    <el-dialog :title="title" :visible.sync="dialogVisible" width="40%">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" label-position="left">
        <el-form-item label="图片名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="indexNum">
          <el-input v-model="form.indexNum" type="number"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addSubmit('form')" v-if="title=='添加'">保存</el-button>
          <el-button type="primary" @click="endSubmit('form')" v-if="title=='编辑'">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  launchPageadd,
  launchPageedit,
  launchPagedel
} from "../../api/homepage";

export default {
  name: "OwnerIinformation",
  data() {
    return {
      input: "",
      tableData: [],
      dialogVisible: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      imageUrl: "",
      form: { indexNum: "", name: "", pic: "" },
      title: "添加",
      rules: {
        name: [{ required: true, message: "请输入图片名称", trigger: "blur" }],
        indexNum: [{ required: true, message: "请输入序号", trigger: "blur" }]
      }
    };
  },
  created() {
    this.geturllist();
    // this.getAllListwuye();
  },
  methods: {
    geturllist() {
      const param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getList(param)
        .then(response => {
          console.log(response);

          this.tableData = response.data.dataList;
          this.total = response.data.total;
        })
        .catch(error => {
          console.log(error);
        });
    },
    addurl() {
      this.form = {
        indexNum: "",
        name: "",
        pic: "www.baidu.com"
      };
      this.imageUrl = "";
      this.title = "添加";
      this.dialogVisible = true;
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
		 launchPagedel(row.id)
		 .then(response => {
              console.log(response);
              this.geturllist();
              
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
    addSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.pic == "") {
            this.$alert("请选择封面图片");
            return;
          }
          console.log(2222, this.form);

          launchPageadd(this.form)
            .then(response => {
              console.log(response);
              this.geturllist();
              this.dialogVisible = false;
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });

      console.log("submit!");
    },
    endSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.pic == "") {
            this.$alert("请选择封面图片");
            return;
          }
          console.log(2222, this.form);

          launchPageedit(this.form)
            .then(response => {
              console.log(response);
              this.geturllist();
              this.dialogVisible = false;
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
    handleEdit(row) {
      console.log(row);
      this.title = "编辑";
      this.dialogVisible = true;
      this.imageUrl = row.pic;
      this.form = row;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;

      this.geturllist();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;

      this.geturllist();
    },
    handleAvatarSuccess(res, file) {
      console.log(res);

      this.imageUrl = URL.createObjectURL(file.raw);
      this.formInline.pic = res.data.photoUrl;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang='scss'>
.container_on {
  margin: 20px;
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
  margin: 0 20px;
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
