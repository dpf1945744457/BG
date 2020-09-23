<template>
    <div class="app-container calendar-list-container">
        <!-- 查询和其他操作 -->
        <myp-search-form @changeform="callbackformHandle" @resetInput="resetSearchHandle" @seachstart="seachstartHandle" :searchOptions="searchOptions"></myp-search-form>
        <div class="operation-box">
            <el-button size="small" class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>

            <el-table-column align="center" label="ID" prop="id"></el-table-column>
            <el-table-column align="center" label="App名称" prop="appName"></el-table-column>
            <el-table-column align="center" label="操作平台" prop="platformType">
                <template slot-scope="scope">
                    {{scope.row.platformType === 0 ? '安卓' : '苹果'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="文件大小 ( 字节 )" prop="fileSize"></el-table-column>
            <el-table-column align="center" label="版本号" prop="appVersion"></el-table-column>
            <el-table-column align="center" label="强制更新" prop="forceUpdate">
                <template slot-scope="scope">
                    {{scope.row.forceUpdate === true ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="下载地址" prop="downUrl"></el-table-column>
            <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--添加-->
        <el-dialog title="添加" :visible.sync="dialogCreate" width="720px">
            <el-form :model="createData" :rules="createDataRules" ref="createData" label-position="rigth" label-width="100px">
                <el-form-item label="App名称" prop="appName">
                    <el-input v-model="createData.appName"></el-input>
                </el-form-item>
                <el-form-item label="版本号" prop="appVersion">
                    <el-input v-model="createData.appVersion"></el-input>
                </el-form-item>
                <el-form-item label="是否强制更新" prop="forceUpdate">
                    <el-select v-model="createData.forceUpdate" placeholder="请选择">
                        <el-option
                                v-for="item in forceUpdateOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作平台" prop="platformType">
                    <el-select v-model="createData.platformType" placeholder="请选择">
                        <el-option
                                v-for="item in platformTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文件" prop="fileName">
                    <el-upload
                            class="upload-demo"
                            :action="uploadPath"
                            :headers="headers"
                            :on-success="uploadSuccess"
                            multiple
                            :limit="1"
                            accept=".apk"
                            :on-exceed="handleExceed"
                            :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传 *.apk 文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogCreate = false">取 消</el-button>
                <el-button type="primary" :loading="createLoading" @click="handleCreateSure">确 定</el-button>
            </span>
        </el-dialog>


        <!--编辑-->
        <el-dialog title="编辑" :visible.sync="dialogChange" width="720px">
            <el-form :model="changData" :rules="changDataRules" ref="changData"  label-position="rigth" label-width="100px">
                <el-form-item label="appName">
                    <el-input v-model="changData.appName"></el-input>
                </el-form-item>
                <el-form-item label="操作平台">
                    <el-select v-model="changData.platformType" placeholder="请选择">
                        <el-option
                                v-for="item in platformTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本号" prop="appVersion">
                    <el-input v-model="changData.appVersion"></el-input>
                </el-form-item>
                <el-form-item label="强制更新">
                    <el-select v-model="changData.forceUpdate" placeholder="请选择">
                        <el-option
                                v-for="item in forceUpdateOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogChange = false">取 消</el-button>
                <el-button type="primary" :loading="changeLoading" @click="handleChangeSure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
//import { appList,create,update,deleteData } from "@/api/app";
//import { createStorage, uploadPath } from "@/api/storage";
//import SearchForm from "@/components/SearchForm";
//import { searchMixin } from "@/common/searchMixin";
//import { getToken } from "@/api/api_token";
  export default {
    name: "app",
    computed: {
//    headers() {
//      return {
//        "Admin-Token": getToken()
//      };
//    }
    },
    components: {
//    "myp-search-form": SearchForm
    },
    mixins: [searchMixin],
    data(){
      const validateAppName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入App版本号"));
        }else {
          callback();
        }
      };
      const validateAppVersion = (rule, value, callback) => {
        let re = /^\d+(?=\.{0,1}\d+$|$)/
        if (value === '') {
          callback(new Error("请输入App版本号"));
        } else if(!re.test(value)){
          callback(new Error("请输入正确的App版本号"));
        }else {
          callback();
        }
      };
      const validateForceUpdate = (rule, value, callback) => {
        console.info(value)
        if (value === '') {
          callback(new Error("请选择是否强制更新"));
        } else {
          callback();
        }
      };
      const validatePlatformType = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请选择操作平台"));
        } else {
          callback();
        }
      };
      const validateFile = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请上传apk文件"));
        } else {
          callback();
        }
      };
      return{
        uploadPath,
        searchOptions: {
          lableWidth: "80px",
          searchList: [],
        },
        listQuery:{
          platformType:'',
          appName:'',
          page:1,
          limit:10
        },

        list:[],
        listLoading:false,

        //create
        dialogCreate:false,
        createLoading:false,
        createData:{
          appName:'',
          appVersion:'',
          forceUpdate:'',
          platformType:'',
          fileName:'',
          fileSize:'',
          fileKey:'',
          downUrl:''
        },
        createDataRules:{
          appName: [
            { required: true, trigger: "blur", validator: validateAppName }
          ],
          appVersion: [
            { required: true, trigger: "blur", validator: validateAppVersion }
          ],
          forceUpdate: [
            { required: true, trigger: "change", validator: validateForceUpdate }
          ],
          platformType: [
            { required: true, trigger: "change", validator: validatePlatformType }
          ],
          fileName: [
            { required: true, trigger: "change", validator: validateFile }
          ]
        },

        //change
        dialogChange:false,
        changeLoading:false,
        changData:{
          id:'',
          appName:'',
          platformType:'',
          appVersion:'',
          forceUpdate:'',
        },
        changDataRules:{
          appName: [
            { required: true, trigger: "blur", message: '请填写App名称' }
          ],
          appVersion: [
            { required: true, trigger: "blur", message: '请填写App版本号' }
          ],
        },
        platformTypeOptions:[
          {
            value: '1',
            label: '苹果'
          }, {
            value: '0',
            label: '安卓'
          }
        ],
        forceUpdateOptions: [
          {
            value: 'true',
            label: '是'
          }, {
            value: 'false',
            label: '否'
          }
        ],

        fileList: []
      }
    },
    created(){
      this.searchOptions.searchList.push(
          {
            corresattr: "appName",
            type: "text",
            label: "App名称",
            placeholder: "请输入App名称",
            clearable: true,
            defaultVlue: "",
            value: this.listQuery.appName,
            cb: value => {
              this.listQuery.appName = value;
            }
          },
          {
            corresattr: "platformType",
            type: "select",
            label: "操作平台",
            placeholder: "请选择操作平台",
            clearable: true,
            defaultVlue: [],
            value: this.listQuery.platformType,
            options: [
              { value: "", label: "全部" },
              { value: "0", label: "安卓" },
              { value: "1", label: "苹果" },
            ],
            cb: value => {
              this.listQuery.platformType = value;
            }
          }
      );
      this.getAppList();
    },
    methods:{
      seachstartHandle(){
        this.getAppList();
      },
      getAppList(){
        this.listLoading = true;
        appList(this.listQuery).then(res => {
          console.info(res);
          this.list = res.data.items;
          this.listLoading = false;
        });
      },

      // 添加
      handleCreate(){
        this.dialogCreate = true;
      },
      handleCreateSure(){
        this.$refs.createData.validate(valid => {
          if (valid) {
            this.createLoading = true;
            create(this.createData).then(res => {
              console.info(res);
              if(res.errno === 0){
                this.dialogCreate = false;
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.getAppList();
                setTimeout(()=>{
                  this.createLoading = false;
                },1000)
              }
            });
          } else {
            return false;
          }
        });
      },
      handleExceed(files) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`);
      },
      uploadSuccess(res){
        console.info(res);
        let data = res.data;
        this.createData.fileName = data.name;
        this.createData.fileSize = data.size;
        this.createData.fileKey = data.key;
        this.createData.downUrl = data.url;
      },

      //编辑
      handleUpdate(row){
        console.info(row);
        this.dialogChange = true;
        this.changData.id = row.id;
        this.changData.appName = row.appName;
        this.changData.appVersion = row.appVersion;
        this.changData.platformType = row.platformType.toString();
        this.changData.forceUpdate = row.forceUpdate.toString();
      },
      handleChangeSure(){

        this.$refs.changData.validate(valid => {
          if (valid) {
            this.changeLoading = true;
            this.$nextTick(()=>{
              update(this.changData).then(res => {
                console.info(res);
                if(res.errno === 0){
                  this.dialogChange = false;
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.changeLoading = false;
                  this.getAppList();
                }
              });
            })
          } else {
            return false;
          }
        });
      },

      //删除
      handleDelete(row){
        this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteData({id:row.id}).then(res => {
            console.info(res);
            if(res.errno === 0){
              this.dialogChange = false;
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getAppList();
            }
          });
        });
      }
    }
  }
</script>

<style scoped>

</style>