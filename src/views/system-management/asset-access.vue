<template>

	<div class="container">

		<el-tree :data="data" ref="tree" check-strictly show-checkbox node-key="taskCode" default-expand-all :expand-on-click-node="false" :default-checked-keys="checkedKeys">
			<span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.taskName  }}</span>
			<span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)" v-if="type =='system' && data.isParent == true">
        		添加
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => edit(data)" v-if="type =='system'">
        		编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)" v-if="type =='system'">
        		删除
          </el-button>
        </span>
			</span>
		</el-tree>
		<div class="saveBtn" v-if="type !='system'">
			<el-button type="primary" @click="save">保存</el-button>
		</div>

		<!-- 弹出框 -->
		<el-dialog title="添加菜单" :visible.sync="dialogVisible" width="40%">

			<el-form ref="form" :model="form" label-width="140px" label-position="left" :rules="rules">
				<el-form-item label="菜单名字" prop="taskName">
					<el-input v-model="form.taskName"></el-input>
				</el-form-item>
				<el-form-item label="菜单编号" prop="taskCode">
					<el-input v-model="form.taskCode" :disabled="addOrEdit != 'add'"></el-input>
				</el-form-item>
				<el-form-item label="是否有下级菜单">
					<el-switch :disabled="editVisible?true:false" v-model="form.isParent" :active-value="true" :inactive-value="false" active-text="是" inactive-text="否" @change="changeSwitch(form.isParent)">
					</el-switch>
				</el-form-item>
				<el-form-item label="菜单url" prop="url" label-width="140px">
					<!--<el-form-item v-if="editVisible?(form.isParent=='TRUE'?false:true):(form.isParent=='TRUE'?false:true)" label="菜单url" prop="url" label-width="140px">-->
					<el-input v-model="form.url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">保存</el-button>
					<el-button @click="dialogVisible = false">取消</el-button>
				</el-form-item>
			</el-form>

		</el-dialog>
	</div>

</template>

<script>
	import { getMenuList, getDeptMenuList, saveMenu, updateMenu, deleteMenu, operatorDept, operatorRole, getDeptPermission, getRolePermission } from '@/api/system'

	let id = 1000;

	export default {
		name: 'AssetAccess',
		data() {
			const data = [{
				id: 1,
				taskName: '根节点',
				taskCode: '000000',
				isParent: true,
				systemCode: this.$route.query.systemCode || this.$route.query.deptCode,
				children: ''
			}];
			return {
				data: data,
				checkedKeys: [],
				addOrEdit: "add",
				dialogVisible: false,
				editVisible: false,
				form: {
					taskName: '',
					taskCode: '',
					url: "",
					isParent: false,
					parentCode: "",
					systemCode: "",
					displayOrder: 1
				},
				rules: {
					taskName: [{
						required: true,
						message: '请输入菜单名称',
						trigger: 'blur'
					}],
					taskCode: [{
						required: true,
						message: '请输入菜单编号',
						trigger: 'blur'
					}],
					url: [{
						required: true,
						message: '请输入跳转地址',
						trigger: 'blur'
					}],
				},
				operateMenu: [],
				type: this.$route.query.type,
				id: this.$route.query.id,
				addMenuCodes: []
			}
		},
		watch: {
			$route() {
				this.deptCode = this.$route.query.systemCode || this.$route.query.deptCode;
				this.type = this.$route.query.type;
				this.id = this.$route.query.id;

				if(this.$route.query.systemCode) {
					this.getMenuList();
				} else if(this.$route.query.deptCode) {
					this.getDeptMenuList();
				}
				if(this.type == 'dept') {
					this.getDeptPermission();
				} else if(this.type == 'role') {
					this.getRolePermission();
				}
			},
		},
		created() {
			if(this.$route.query.systemCode) {
				this.getMenuList();
			} else if(this.$route.query.deptCode) {
				this.getDeptMenuList();
			}
			if(this.type == 'dept') {
				this.getDeptPermission();
			} else if(this.type == 'role') {
				this.getRolePermission();
			}

		},
		methods: {
			getMenuList() {
				getMenuList({
					systemCode: this.$route.query.systemCode
				}).then(response => {
					if(response.code == '200') {
						this.data[0].children = JSON.parse(JSON.stringify(response.data));
					}
				}).catch(error => {
					console.log(error)
				})
			},
			getDeptMenuList() {
				getDeptMenuList({
					deptCode: this.$route.query.deptCode
				}).then(response => {
					if(response.code == '200') {
						this.data[0].children = JSON.parse(JSON.stringify(response.data));
					}
				}).catch(error => {
					console.log(error)
				})
			},
			//			部门设置权限默认选中
			getDeptPermission() {
				getDeptPermission({
					id: this.id
				}).then(response => {
					if(response.code == '200') {
						this.checkedKeys = response.data;
						this.$nextTick(() => {
							this.$refs.tree.setCheckedKeys(this.checkedKeys); //获取已经设置的资源后渲染
						});
						console.log("checkedKeys", this.checkedKeys)
						
					}
				}).catch(error => {

					this.$message.error(error.errmsg);
				})
			},
			getRolePermission() {
				getRolePermission({
					id: this.id
				}).then(response => {
					if(response.code == '200') {
						this.checkedKeys = response.data;
						console.log("checkedKeys", this.checkedKeys)
						this.$nextTick(function() {
					    this.$refs.tree.setCheckedKeys(this.checkedKeys)
					  })
//						this.$nextTick(() => {
//							this.$refs.tree.setCheckedKeys(this.checkedKeys); //获取已经设置的资源后渲染
//						});
					}
				}).catch(error => {

					this.$message.error(error.errmsg);
				})
			},
			changeSwitch(value){
				console.log(value)
				this.form.isParent = value;
			},
			append(data) {
				this.dialogVisible = true;
				this.addOrEdit = 'add';
//				this.form = {}
//				this.form.taskName = '';
//				this.form.url = '';
//				this.form.taskCode = '';
////				this.form.isParent = false;
				this.operateMenu = data;
			},
			edit(data) {
				this.dialogVisible = true;
				this.addOrEdit = "edit";
				this.editVisible = true;
				this.operateMenu = data;
				this.form.parentCode = data.parentCode;
				this.form.systemCode = data.systemCode;
				this.form.taskName = data.taskName;
				this.form.url = data.url;
				this.form.taskCode = data.taskCode;
				this.form.id = data.id;
			},
			remove(node, data) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteMenu(data.id).then(response => {
						if(response.code == '200') {
							this.getMenuList();
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						}
					}).catch(error => {
						this.$message.error(error.errmsg);
					})

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},

			renderContent(h, {
				node,
				data,
				store
			}) {
				return(
					<span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
            </span>
          </span>);
			},
			onSubmit() {
				this.$refs.form.validate(valid => {
					if(valid) {
						this.form.parentCode = this.operateMenu.taskCode == '000000' ? '' : this.operateMenu.taskCode;
						this.form.systemCode = this.operateMenu.systemCode || this.$route.query.systemCode;
						
						//		      	编辑
						if(this.addOrEdit == "edit") {
							this.form.isParent = JSON.parse(this.operateMenu.isParent);
							updateMenu(this.form).then(response => {
								if(response.code == '200') {
									this.$message({
										message: '编辑成功',
										type: 'success'
									});
									this.dialogVisible = false;
									this.getMenuList();
								}
							}).catch(error => {
								console.log(error)
							})
						}
						//		      	新增
						else if(this.addOrEdit == "add") {
							console.log(this.operateMenu)
							this.form.isParent = JSON.parse(this.form.isParent);
							saveMenu(this.form).then(response => {
								if(response.code == '200') {
									this.$message({
										message: '新增成功',
										type: 'success'
									});
									this.dialogVisible = false;
									this.getMenuList();
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
			save() {
				this.addMenuCodes = [];
				let childrenNodes = this.$refs.tree.getCheckedNodes();
				let parentNodes = this.$refs.tree.getHalfCheckedNodes();
				console.log("childrenNodes", childrenNodes)
				console.log("parentNodes", parentNodes)
				childrenNodes.forEach((i) => {
					if(this.addMenuCodes.indexOf(i.taskCode) == -1) {
						this.addMenuCodes.push(i.taskCode);
					}
				})
				parentNodes.forEach((i) => {
					if(this.addMenuCodes.indexOf(i.taskCode) == -1) {
						this.addMenuCodes.push(i.taskCode);
					}
				})
				if(this.type == 'dept') {
					this.operatorDept();
				} else if(this.type == 'role') {
					this.operatorRole();
				}
			},
			operatorDept() {
				operatorDept({
					addMenuCodes: this.addMenuCodes,
					id: this.id
				}).then(response => {
					if(response.code == '200') {
						this.$message({
							message: '设置成功',
							type: 'success'
						});
					}
				}).catch(error => {
					console.log(error)
				})
			},
			operatorRole() {
				operatorRole({
					addMenuCodes: this.addMenuCodes,
					roleId: this.id
				}).then(response => {
					if(response.code == '200') {
						this.$message({
							message: '设置成功',
							type: 'success'
						});
					}
				}).catch(error => {
					console.log(error)
				})
			},
		}
	};
</script>

<style>
	.container {
		margin: 30px;
	}
	
	.saveBtn {
		position: relative;
		margin: 10px 0;
	}
	
	.saveBtn .el-button {
		position: absolute;
		right: 0;
		top: 0;
	}
	
	.el-tree {
		padding: 20px;
	}
	
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
	
	.el-tree-node__content:hover {
		background-color: #ccdaff;
	}
</style>