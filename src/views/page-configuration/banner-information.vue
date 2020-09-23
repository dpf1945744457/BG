<template>
	<div class="container">
		<!--<div class="container_on">
			<div class="on_title">
				<p>查询条件</p>
				<p>更多</p>
			</div>
			<div class="on_input">
				<el-row>
					<el-col :span="7">
						<div class="grid-content bg-purple">
							<el-input v-model="input" placeholder="请输入物业名称"></el-input>
						</div>
					</el-col>
					<el-col :span="4" :offset="1"><div class="grid-content bg-purple-light"><el-input v-model="input" placeholder="请输业主身份证"></el-input></div></el-col>
          <el-col :span="7" :offset="1"><div class="grid-content bg-purple"><el-input v-model="input" placeholder="请输入联系方式"></el-input></div></el-col>
					<el-col :span="2">
						<div class="grid-content bg-purple-light">
							<el-button type="primary" icon="el-icon-search" class="query">查询</el-button>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>-->
		<div class="container_tw">
			<div class="tw_title">
				<p>banner列表</p>
				<!--右边按钮  -->
				<div class="tools-right">
					<el-button type="primary" class="tools-button" @click="dialogVisible = true">
						<i class="el-icon-circle-plus-outline"></i> 添加
					</el-button>
				</div>
				<!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
			</div>
			<div class="tw_form">
				<el-table :data="tableData" style="width: 100%" class="table">
					<el-table-column prop="date" label="ID" width="180"></el-table-column>
					<el-table-column prop="name" label="图片名称" width="180"></el-table-column>
					<el-table-column prop="date" label="url" width="180"></el-table-column>
					<el-table-column prop="name" label="序号" width="180"></el-table-column>
					<el-table-column prop="name" label="类型" width="180"></el-table-column>
					<el-table-column prop="name" label="跳转地址" width="180"></el-table-column>
					<el-table-column prop="address" label="操作"></el-table-column>
				</el-table>
			</div>

		</div>
		<!-- 弹出框 -->
		<el-dialog title="添加banner图" :visible.sync="dialogVisible" width="40%">

			<el-form ref="form" :model="form" label-width="140px" label-position="left">
				<el-form-item label="图片名称">
					<el-input v-model="form.companyName"></el-input>
				</el-form-item>
				<el-form-item label="序号">
					<el-input v-model="form.name"></el-input>
				</el-form-item>

				<el-form-item label="图片">
					<el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="类型">
					<el-select v-model="sex" placeholder="请选择">
						<el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="跳转地址">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">保存</el-button>
					<el-button>取消</el-button>
				</el-form-item>
			</el-form>

		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'OwnerIinformation',
		data() {
			return {
				input: '',
				tableData: [],
				dialogVisible: false,
				form: {
					companyName: "",
					name: '',
					companyLegal: '',
					licenseNumber: '',
					desc: ""
				},
				imageUrl: '',
				sexOptions: [{
					value: '1',
					label: '男'
				}, {
					value: '0',
					label: '女'
				}],
				sex: '',
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
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
</style>