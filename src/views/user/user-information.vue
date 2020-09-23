<template>
	<div class="container">
		<div class="container_on">
			<div class="on_title">
				<p>查询条件</p>
				<p>更多</p>
			</div>
			<div class="on_input">
				<el-row>
					<el-col :span="7">
						<el-select v-model="userType" placeholder="请选择用户类型">
							<el-option v-for="item in userTypeOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-col>

					<el-col :span="7">
						<div class="grid-content bg-purple">
							<el-input v-model="userName" placeholder="请输入用户名称"></el-input>
						</div>
					</el-col>
					<el-col :span="4" :offset="1">
						<div class="grid-content bg-purple-light">
							<el-input v-model="phone" placeholder="请输入用户电话"></el-input>
						</div>
					</el-col>
					<el-col :span="7" :offset="1">
						<div class="grid-content bg-purple">
							<el-input v-model="email" placeholder="请输入用户邮箱"></el-input>
						</div>
					</el-col>
					<el-col :span="2">
						<div class="grid-content bg-purple-light">
							<el-button type="primary" icon="el-icon-search" class="query" @click="search">查询</el-button>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>
		<div class="container_tw">
			<div class="tw_title">
				<p>用户列表</p>
				<!--右边按钮  -->
				<div class="tools-right">
					<el-button type="primary" class="tools-button" @click="addUser">
						<i class="el-icon-circle-plus-outline"></i> 添加
					</el-button>
				</div>
				<!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
			</div>
			<div class="tw_form">
				<el-table :data="userList" style="width: 100%" class="table">
					<el-table-column prop="id" label="用户ID" width="180"></el-table-column>
					<el-table-column prop="name" label="姓名" width="180"></el-table-column>
					<el-table-column prop="mobilePhone" label="电话" width="180"></el-table-column>
					<el-table-column prop="email" label="邮箱" width="180"></el-table-column>
					<el-table-column prop="createUserName" label="创建员工" width="180"></el-table-column>
					<el-table-column prop="name" label="用户类型" width="180"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">

							<el-button @click="handleLook(scope.row)" type="primary" size="small">查看</el-button>
							<el-button type="success" size="small" @click="handleEdit(scope.row)">编辑</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>

		</div>
		<!-- 弹出框 -->
		<el-dialog title="添加用户信息" :visible.sync="dialogVisible" width="40%">

			<el-form ref="form" :model="form" label-width="140px" label-position="left" :rules="rules">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-select v-model="form.sex" placeholder="请选择">
						<el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="出生日期" prop="birth">
					<el-date-picker v-model="form.birth" type="date" placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="移动电话" prop="mobilePhone">
					<el-input v-model="form.mobilePhone"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="form.email"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password"></el-input>
				</el-form-item>
				<!--<el-form-item label="用户类型">
					<el-select v-model="sex" placeholder="请选择">
						<el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="绑定小区">
					<el-select v-model="sex" placeholder="请选择">
						<el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>-->
				<el-form-item label="头像" prop="photo">
					<el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						<img v-if="form.photo" :src="form.photo" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>

				<el-form-item label="备注" prop="descrition">
					<el-input type="textarea" v-model="form.descrition"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">保存</el-button>
					<el-button @click="dialogVisible = false">取消</el-button>
				</el-form-item>
			</el-form>

		</el-dialog>

		<!-- 分页 -->
		<div class="pagination-container">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[5,10,15,20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { getOperationList, addOperateUser, editOperateUser,getOperateUserDetail } from '@/api/operation'

	export default {
		name: 'OwnerIinformation',
		data() {
			return {
				userName: "",
				phone: "",
				email: "",
				dialogVisible: false,
				form: {
					name: '',
					sex: '',
					birth: "",
					mobilePhone: '',
					email: '',
					password: '',
					photo: '',
					descrition: ""
				},
				rules: {
					name: [{
						required: true,
						message: '请输入用户名称',
						trigger: 'blur'
					}, ],
					birth: [{
						required: true,
						message: '请输入物业公司电话',
						trigger: 'blur'
					}, ],
					mobilePhone: [{
						required: true,
						message: '请输入公司法人',
						trigger: 'blur'
					}, ],
					email: [{
						required: true,
						message: '请输入营业执照号码',
						trigger: 'blur'
					}, ],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'blur'
					}, ],
					//					logo: [{
					//						required: true,
					//						message: '请上传公司logo',
					//						trigger: 'blur'
					//					}, ],
					//					decription: [{
					//						required: true,
					//						message: '请输入公司描述',
					//						trigger: 'blur'
					//					}],
				},
				pageNum: 1,
				pageSize: 5,
				total: 0,
				userList: [],
				addOrEdit: "add",
				photo: '',
				userTypeOptions: [{
					value: '1',
					label: '运营'
				}, {
					value: '2',
					label: '物业'
				}, {
					value: '3',
					label: '小区'
				}],
				userType: '',

				sexOptions: [{
					value: 0,
					label: '男'
				}, {
					value: 1,
					label: '女'
				}],

			}
		},
		created() {
			this.getOperationList();
		},
		methods: {
			getOperationList() {
				getOperationList({
					email: this.email,
					mobilePhone:this.phone,
					name:this.userName,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(response => {
					if(response.code == '200') {
						this.userList = response.data.dataList;
						this.total = response.data.total;
					}
				}).catch(error => {
					this.$message.error(error.errmsg);
				})
			},
			search() {
				this.getOperationList();
			},
			addUser() {
				this.dialogVisible = true;
				this.addOrEdit = 'add';
				this.form = {}
			},
			getOperateUserDetail(id){
				getOperateUserDetail(id).then(response => {
			          if (response.code == '200') {
			          	this.form = response.data;
			          }
		        }).catch(error => {
		          console.log(error)
		        })
			},
			onSubmit() {
				this.$refs.form.validate(valid => {
					if(valid) {
						//		      	编辑
						if(this.addOrEdit == "edit") {
							editOperateUser(this.form).then(response => {
								if(response.code == '200') {
									this.$message({
										message: '编辑成功',
										type: 'success'
									});
									this.dialogVisible = false;
									this.getOperationList();

								}
							}).catch(error => {
								console.log(error)
							})
						}
						//		      	新增
						else if(this.addOrEdit == "add") {
							addOperateUser(this.form).then(response => {
								if(response.code == '200') {
									this.$message({
										message: '新增成功',
										type: 'success'
									});
									this.dialogVisible = false;
									this.getOperationList();
								}
							}).catch(error => {
								console.log(error)
							})
						}

					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			handleLook(row) {
				this.dialogVisible = true;
				this.getOperateUserDetail(row.id);
			},
			handleEdit(row) {
				this.addOrEdit = "edit";
				this.dialogVisible = true;
		        this.getOperateUserDetail(row.id);
			},
			handleAvatarSuccess(res, file) {
				this.photo = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if(!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if(!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getOperationList();
			},
			handleCurrentChange(val) {
				this.pageNum = val;
				this.getOperationList();
			},
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
			&>p:nth-child(1) {
				color: rgb(104, 107, 109);
				font-size: 14px;
				font-weight: bold;
			}
			&>p:nth-child(2) {
				color: rgb(1, 123, 255);
				font-size: 14px;
			}
			&>p:nth-child(2):hover {
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
			&>p {
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
		border-color: #409EFF;
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
	
	.pagination-container {
		background: #ffffff;
		padding: 10px 0;
		margin: 20px;
	}
</style>