<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<template v-for="item in uploadList">
	            <Progress 
	            	v-if="item.showProgress"
	            	:percent="item.percentage" 
	            	hide-info 
	            	style="margin-bottom: 20px;">
	            </Progress>
			</template>
			<template v-for="item in uploadList2">
	            <Progress 
	            	v-if="item.showProgress"
	            	:percent="item.percentage" 
	            	hide-info 
	            	style="margin-bottom: 20px;">
	            </Progress>
			</template>
			<Upload
				ref="upload2"
				action="user/appVersion/upload/ios"
				:show-upload-list="false"
				:on-success="uploadIosSuccess"
				:on-error="uploadIosError"
				style="float: right; margin-left: 20px;">
		        <Button type="primary" size="small">新增Ios版本</Button>
		    </Upload>
			<Upload
				ref="upload"
				action="user/appVersion/upload"
				:show-upload-list="false"
				:on-success="uploadAndroidSuccess"
				:on-error="uploadAndroidError"
				:timeout="1000"
				style="float: right;">
		        <Button type="primary" size="small">新增Android版本</Button>
		    </Upload>
			<Select size="small" class="selectType" v-model="defaultType" @on-change="typeChange()">
				<Option value="">全部</Option>
				<Option value="1">ios</Option>
				<Option value="2">android</Option>
			</Select>
		</ButtonGroup>
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
		<div class="page">
			<Page :total="total" :current="1" show-total @on-change="changePage"></Page>
		</div>
		<Modal
	        v-model="editVersionShow"
	        title="编辑版本"
	        @on-ok="editVersionConfirm">
	        <Form :model="formItem" :label-width="100">
		        <FormItem label="强制更新:">
		            <Select v-model="formItem.isForceUpdate">
						<Option value="1">否</Option>
						<Option value="2">是</Option>
					</Select>
		        </FormItem>
		        <FormItem label="更新内容:">
		            <Input v-model="formItem.releaseNote" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入更新内容"></Input>
		        </FormItem>
			</Form>
	    </Modal>
	</div>
</template>

<script>
	import qs from 'qs'
	
	export default {
		data () {
			return {
				columns: [
					{
                        title: 'app名',
                        key: 'appName'
                   },
                    {
                        title: '版本名',
                        key: 'versionName'
                    },
                    {
                        title: 'build',
                        key: 'versionCode'
                    },
                    {
                        title: '类型',
                        key: 'appType',
                        render: (h,params) => {
                        	let appType = params.row.appType;
                        	switch(appType){
                        		case 1: appType = 'IOS'; break;
                        		case 2: appType = 'Android'; break;
                        		default: break;
                        	}
                        	return h('div', appType);
                        }
                    },
                    {
                        title: '强制更新',
                        key: 'isForceUpdate',
                        render: (h,params) => {
                        	let isForceUpdate = params.row.isForceUpdate;
                        	switch(isForceUpdate){
                        		case 1: isForceUpdate = '否'; break;
                        		case 2: isForceUpdate = '是'; break;
                        		default: break;
                        	}
                        	return h('div', isForceUpdate);
                        }
                    },
                    {
                        title: '更新内容',
                        key: 'releaseNote',
                        tooltip: true
                    },
                    {
                        title: '下载地址',
                        key: 'downloadUrl',
                        tooltip: true
                    },
                    {
                        title: '上线时间',
                        key: 'onlineTime',
                        render: (h,params) => {
                        	let onlineTime = '';
                        	if (params.row.onlineTime) {
                        		onlineTime = this.formatDate(params.row.onlineTime);
                        	}
                        	return h('div', onlineTime);
                        }
                    },
                    {
                        title: '状态',
                        key: 'onlineStatus',
                        width: 130,
                        render: (h, params) => {
	                        const row = params.row;
	                        const color = row.onlineStatus === 1 ? '#000' : row.onlineStatus === 2 ? '#2db7f5' : row.onlineStatus === 3 ? '#f90' : '#ed3f14';
	                        const text = row.onlineStatus === 1 ? '未上线' : row.onlineStatus === 2 ? '测试中' : row.onlineStatus === 3 ? '已上线' : '已下线';
	                        return h('Tag', {
	                            props: {
	                                type: 'dot',
	                                color: color
	                            }
	                        }, text);
	                    }
                    },
                    {
                    	title: '操作',
                    	align: 'center',
                    	width: 180,
                    	render: (h, params) => {
                    		return h('div', [
                    			h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                        	this.currentIndex = params.index;
                                            this.editVersion(params.row);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                        	this.test(params.index, params.row.uid);
                                        }
                                    }
                                }, '测试'),
                                h('Button', {
                                    props: {
                                        type: params.row.onlineStatus == 3?'error':'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                        	if (params.row.onlineStatus == 3) {
                                        		this.offLine(params.index, params.row.uid);
                                        	} else {
                                        		this.onLine(params.index, params.row.uid);
                                        	}
                                        }
                                    }
                                }, params.row.onlineStatus == 3?'下线':'上线')
                            ]);
                    	}
                    }
                ],
                data: [],
                loadingState: false,
                total: 0,
                defaultType: '',
                uploadList: [],
                uploadList2: [],
                editVersionShow: false,
                currentIndex: '',
                formItem: {
                	uid: '',
                	isForceUpdate: '',
                	releaseNote: ''
                }
			}
		},
		methods: {
			loadList (page) {
				let appType = this.defaultType;
				this.loadingState = true;
           		this.$axios.get('user/appVersion/list?page='+page+'&pageSize=10&appType='+appType)
				.then((response) => {
					console.log(response.data);
					if (response.data.isSuccessful) {
						this.data = response.data.data.rows;
						this.total = response.data.data.records;
					} else {
						this.$Notice.error({ title: response.data.message });
					}
					this.loadingState = false;
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.loadingState = false;
	        	})
			},
			typeChange () {
				this.loadList(1);
			},
			changePage (page) {
				this.loadList(page);
			},
			/*时间格式化*/
			formatDate (timestamp) {
				let date = new Date(timestamp);
		        let Y = date.getFullYear() + '-';
		        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
		        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		        return Y+M+D+h+m+s;
			},
			/*文件上传钩子*/
			uploadAndroidSuccess (data) {
				if (data.isSuccessful) {
					this.$Notice.success({ title: '操作成功' });
					this.defaultType = '2';
					this.loadList(1);
				} else {
					this.$Notice.error({ title: data.message });
				}
			},
			uploadAndroidError (error) {
				this.$Notice.error({ title: error });
			},
			uploadIosSuccess (data) {
				if (data.isSuccessful) {
					this.$Notice.success({ title: '操作成功' });
					this.defaultType = '1';
					this.loadList(1);
				} else {
					this.$Notice.error({ title: data.message });
				}
			},
			uploadIosError (error) {
				this.$Notice.error({ title: error });
			},
			/*编辑*/
			editVersion (row) {
				this.formItem = {
					uid: row.uid,
					isForceUpdate: row.isForceUpdate + '',
					releaseNote: row.releaseNote
				}
				this.editVersionShow = true;
			},
			editVersionConfirm () {
				this.loadingState = true;
				this.$axios.post('user/update/appVersion', qs.stringify(this.formItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						let isForceUpdate = this.formItem.isForceUpdate;
						if (isForceUpdate == 1) {
							this.data[this.currentIndex].isForceUpdate = '否';
						} else if (isForceUpdate == 2) {
							this.data[this.currentIndex].isForceUpdate = '是';
						} else {
							this.data[this.currentIndex].releaseNote = this.formItem.isForceUpdate;
						}
						this.data[this.currentIndex].releaseNote = this.formItem.releaseNote;
						this.$Notice.success({ title: '操作成功' });
					} else {
						this.$Notice.error({ title: response.data.message });
					}
					this.loadingState = false;
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.loadingState = false;
	        	})
			},
			onLine (index, uid) {
				this.$Modal.confirm({
					content: `确认上线该版本吗?`,
                    onOk: () => {
                    	this.loadingState = true;
						this.$axios.post('user/appVersion/online', qs.stringify({ appVersionId: uid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[index].onlineStatus = 3;
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: response.data.message });
							}
							this.loadingState = false;
			        	})
			        	.catch((error) => {
			        		console.log(error);
			        		this.loadingState = false;
			        	})
                    }
				});
			},
			offLine (index, uid) {
				this.$Modal.confirm({
					content: `确认下线该版本吗?`,
                    onOk: () => {
                    	this.loadingState = true;
						this.$axios.post('user/appVersion/offline', qs.stringify({ appVersionId: uid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[index].onlineStatus = 9;
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: response.data.message });
							}
							this.loadingState = false;
			        	})
			        	.catch((error) => {
			        		console.log(error);
			        		this.loadingState = false;
			        	})
                    }
				});
			},
			test (index, uid) {
				this.$Modal.confirm({
					content: `确认将该版本改为测试吗?`,
                    onOk: () => {
                    	this.loadingState = true;
						this.$axios.post('user/appVersion/test', qs.stringify({ appVersionId: uid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[index].onlineStatus = 2;
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: response.data.message });
							}
							this.loadingState = false;
			        	})
			        	.catch((error) => {
			        		console.log(error);
			        		this.loadingState = false;
			        	})
                    }
               });
			}
		},
		mounted () {
			this.loadList(1);
			this.uploadList = this.$refs.upload.fileList;
			this.uploadList2 = this.$refs.upload2.fileList;
		}
	}
</script>

<style scoped>
	.btn-group {
		margin-bottom: 10px;
		margin-right: 20px;
		width: 100%;
	}
	.btn-group button.ivu-btn {
		float: right;
	}
	.selectType {
		float: right;
		width: 100px;
		margin-right: 20px;
	}
	.page {
		float: right;
		margin-top: 20px;
	}
</style>