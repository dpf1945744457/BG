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
						<div class="grid-content bg-purple">
							<el-select v-model="companyId" placeholder="请选择物业公司" @change="changeCompany">
								<el-option v-for="item in companyOptions" :key="item.id" :label="item.companyName" :value="item.id">
								</el-option>
							</el-select>
						</div>
					</el-col>
					<el-col :span="7" :offset="1">
						<div class="grid-content bg-purple-light">
							<el-select v-model="communityId" placeholder="请选择小区">
								<el-option v-for="item in propertyOptions" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</div>
					</el-col>
					<!--<el-col :span="7" :offset="1">
						<div class="grid-content bg-purple">
							<el-input v-model="input" placeholder="请输入用户邮箱"></el-input>
						</div>
					</el-col>-->
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
				<p>设备列表</p>
				<!--右边按钮  -->
				<div class="tools-right">
					<el-button type="primary" class="tools-button" @click="addEquipment">
						<i class="el-icon-circle-plus-outline"></i> 添加
					</el-button>
				</div>
				<!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
			</div>
			<div class="tw_form">
				<el-table :data="equipmentList" style="width: 100%" class="table">
					<el-table-column prop="id" label="设备ID" width="180"></el-table-column>
					<el-table-column prop="typeName" label="设备类型" width="180"></el-table-column>
					<el-table-column prop="name" label="设备名称" width="180"></el-table-column>
					<el-table-column prop="communityName" label="归属小区" width="180"></el-table-column>
					<el-table-column prop="ip" label="IP地址" width="180"></el-table-column>
					<el-table-column prop="mac" label="MAC地址" width="180"></el-table-column>
					<el-table-column prop="state" label="状态" width="180"></el-table-column>
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
		<el-dialog title="添加设备信息" :visible.sync="dialogVisible" width="40%">

			<el-form ref="form" :model="form" label-width="140px" label-position="left" :rules="rules">

				<el-form-item label="归属物业" prop="companyId">
					<el-select v-model="form.companyId" placeholder="请选择物业公司" @change="changeCompany">
						<el-option v-for="item in companyOptions" :key="item.id" :label="item.companyName" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="归属小区" prop="communityId">

					<el-select v-model="form.communityId" placeholder="请选择小区">
						<el-option v-for="item in propertyOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="设备名称" prop="name">
					<el-input v-model="form.name"></el-input>
				</el-form-item>

				<el-form-item label="设备物理地址" prop="mac">
					<el-input v-model="form.mac"></el-input>
				</el-form-item>
				<el-form-item label="ip" prop="ip">
					<el-input v-model="form.ip"></el-input>
				</el-form-item>
				<el-form-item label="设备类型" prop="type">
					<el-select v-model="form.type" placeholder="请选择">
						<el-option v-for="item in equipmentTypeOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">保存</el-button>
					<el-button @click="dialogVisible = false">取消</el-button>
				</el-form-item>
			</el-form>

		</el-dialog>
		
		<!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageNum"
                     :page-sizes="[5,10,15,20]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
		
	</div>
</template>

<script>
	import { addEquipment, getEquipmentList, editEquipment, getEquipmentDetail } from '@/api/equipment'
	import { getAllPropertyCompany, getCommunityListByCompanyId } from '@/api/property'

	export default {
		name: 'OwnerIinformation',
		data() {
			return {
				pageNum: 1,
				pageSize: 5,
				total: 0,
				equipmentList: [],
				dialogVisible: false,
				addOrEdit: "add",
				form: {
					companyId: "",
					ip: "",
					mac: '',
					name: '',
					type: '',
					communityId: "",
				},
				rules: {
					communityId: [{
						required: true,
						message: '请选择归属小区',
						trigger: 'blur'
					}, ],
					ip: [{
						required: true,
						message: '请输入设备ip地址',
						trigger: 'blur'
					}, ],
					mac: [{
						required: true,
						message: '请输入设备mac地址',
						trigger: 'blur'
					}, ],
					name: [{
						required: true,
						message: '请输入设备名称',
						trigger: 'blur'
					}, ],
					type: [{
						required: true,
						message: '请选择设备类型',
						trigger: 'blur'
					}, ],

				},

				companyId: '',
				communityId: "",
				companyOptions: [],
				propertyOptions: [],
				equipmentType: '',
				equipmentTypeOptions: [{
					label: "门禁设备",
					value: '0001'
				}]
			}
		},
		created() {
			this.getEquipmentList();
			this.getAllPropertyCompany();
			//			this.getCompanyList("");
		},
		methods: {
			changeCompany(val) {
				this.getCommunityList(val);
			},
			getAllPropertyCompany() {
				getAllPropertyCompany().then(response => {
					if(response.code == '200') {
						this.companyOptions = response.data;
					}
				}).catch(error => {
					console.log(error)
				})
			},
			getCommunityList(id) {
				getCommunityListByCompanyId(id).then(response => {
					if(response.code == '200') {
						this.propertyOptions = response.data;
					}
				}).catch(error => {
					console.log(error)
				});
			},
			getEquipmentList() {
				getEquipmentList({
					companyId: this.companyId,
					communityId: this.communityId,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(response => {
					if(response.code == '200') {
						this.equipmentList = response.data.dataList;
						this.total = response.data.total;
					}
				}).catch(error => {
					console.log(error)
				})
			},
			search(){
				this.getEquipmentList();
			},
			addEquipment() {
				this.dialogVisible = true;
				this.addOrEdit = 'add';
				this.form = {}
			},
			handleLook(row) {
				this.dialogVisible = true;
				this.getEquipmentDetail(row.id);
			},
			handleEdit(row) {
				this.addOrEdit = "edit";
				this.dialogVisible = true;
				this.getEquipmentDetail(row.id);
			},
			getEquipmentDetail(id) {
				getEquipmentDetail(id).then(response => {
					if(response.code == '200') {
						this.form = response.data;
						this.getCommunityList(response.data.companyId);
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
							editEquipment(this.form).then(response => {
								if(response.code == '200') {
									this.$message({
										message: '编辑成功',
										type: 'success'
									});
									this.dialogVisible = false;
									this.getEquipmentList();

								}
							}).catch(error => {
								console.log(error)
							})
						}
						//		      	新增
						else if(this.addOrEdit == "add") {
							addEquipment(this.form).then(response => {
								if(response.code == '200') {
									this.$message({
										message: '新增成功',
										type: 'success'
									});
									this.dialogVisible = false;
									this.getEquipmentList();
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
			handleSizeChange (val) {
		      this.pageSize = val;
		      this.getEquipmentList();
		    },
		    handleCurrentChange (val) {
		      this.pageNum = val;
		      this.getEquipmentList();
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
	.pagination-container{
  	background: #ffffff;
    padding: 10px 0;
    margin: 20px;
  }
</style>