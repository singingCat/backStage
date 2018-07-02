<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的内容">
				<Select v-model="searchType" slot="prepend" style="width: 100px">
		            <Option value="uuid">分析师uuid</Option>
		            <Option value="nickName">分析师昵称</Option>
		            <Option value="taskName">调研名称</Option>
		        </Select>
				<Button slot="append" icon="search" @click="search"></Button>
			</Input>
		</ButtonGroup>
		<Table border highlight-row :columns="columns" :data="data" :loading="loadingState" @on-current-change="changeRequest"></Table>
		<div class="page">
			<Page :total="total" :current="1" show-total @on-change="changePage"></Page>
		</div>
		<div class="text-center" style="margin-top: 100px">接单列表</div>
		<ButtonGroup size="small" class="btn-group">
			<Input class="searchBox" size="small" v-model.trim="orderSearchContent" placeholder="要搜索的调研id" style="width: 200px;">
				<Button slot="append" icon="search" @click="orderSearch"></Button>
			</Input>
		</ButtonGroup>
		<Table border highlight-row :columns="orderColumns" :data="orderData" :loading="orderLoadingState" @on-current-change="changeOrder"></Table>
		<div class="page">
			<Page :total="orderTotal" :current="1" show-total @on-change="orderChangePage"></Page>
		</div>
		<div class="text-center" style="margin-top: 100px">报告列表</div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="addReport" style="margin-left: 20px;">新增</Button>
			<Input class="searchBox" size="small" v-model.trim="reportSearchContent" placeholder="要搜索的内容">
				<Select v-model="reportSearchType" slot="prepend" style="width: 100px">
		            <Option value="uuid">分析师uuid</Option>
		            <Option value="nickName">分析师昵称</Option>
		            <Option value="reportName">报告名称</Option>
		        </Select>
				<Button slot="append" icon="search" @click="reportSearch"></Button>
			</Input>
		</ButtonGroup>
		<Table border :columns="reportColumns" :data="reportData" :loading="reportLoadingState"></Table>
		<div class="page">
			<Page :total="reportTotal" :current="1" show-total @on-change="reportChangePage"></Page>
		</div>
		<Modal
	        v-model="addReportShow"
	        title="新增报告"
	        @on-ok="addReportConfirm">
	        <Form :model="reportFormItem" :label-width="100">
				<FormItem label="报告名称:">
		            <Input v-model="reportFormItem.name" placeholder="请输入报告名称"></Input>
		       	</FormItem>
		        <FormItem label="报告描述:">
		            <Input v-model="reportFormItem.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入报告描述"></Input>
		        </FormItem>
		        <FormItem label="评级:">
		            <Select v-model="reportFormItem.rating">
						<Option value="1">一星</Option>
						<Option value="2">二星</Option>
						<Option value="3">三星</Option>
						<Option value="4">四星</Option>
						<Option value="5">五星</Option>
					</Select>
		        </FormItem>
		        <FormItem label="报告价格:">
		            <Input v-model="reportFormItem.price" placeholder="请输入报告价格"></Input>
		        </FormItem>
		        <FormItem label="所在调研Id:">
		            <Input v-model="reportFormItem.taskId" placeholder="请输入所在调研Id"></Input>
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
						type: 'index',
						width: 60,
						fixed: 'left',
						align: 'center'
					},
                    {
                        title: 'uid',
                        key: 'uid',
                        width: 60
                    },
                    {
                        title: '货币名',
                        key: 'coinName',
                        width: 100,
                        render: (h, params) => {
                        	return h('div', params.row.coin.name);
                        }
                    },
                    {
                        title: '调研名称',
                        key: 'name',
                        width: 100
                    },
                    {
                    	title: '调研状态',
                    	key: 'status',
                    	width: 100,
                    	render: (h, params) => {
                    		let status = params.row.status;
                    		switch(status){
								case 1: status = '已发布'; break;
								case 2: status = '已接单'; break;
								case 3: status = '已完成'; break;
								case 4: status = '已过期'; break;
								case 5: status = '已取消'; break;
								default: break;
							}
                    		return h('div', status);
                    	}
                    },
                    {
                    	title: '是否公开',
                    	key: 'isPublic',
                    	width: 100,
                    	render: (h, params) => {
                    		let isPublic = params.row.isPublic;
                    		switch(isPublic){
								case 1: isPublic = '公开'; break;
								case 2: isPublic = '不公开'; break;
								default: break;
							}
                    		return h('div', isPublic);
                    	}
                    },
                    {
                        title: '每份奖励',
                        key: 'rewardInb',
                        width: 100
                    },
                    {
                        title: '开始时间',
                        key: 'validFromTime',
                        sortable: true,
                        width: 150,
                        render: (h, params) => {
                        	return h('div', this.formatDate(params.row.validFromTime));
                        }
                    },
                    {
                        title: '结束时间',
                        key: 'validToTime',
                        sortable: true,
                        width: 150,
                        render: (h, params) => {
                        	return h('div', this.formatDate(params.row.validToTime));
                        }
                    },
                    {
                    	title: '所需语言',
                    	key: 'language',
                    	width: 100
                    },
                    {
                    	title: '冻结的Inb数量',
                    	key: 'frozenInb',
                    	width: 100
                    },
                    {
                    	title: '需分析师',
                    	key: 'needAnalystNumber',
                    	width: 100
                    },
                    {
                    	title: '附带免费报告数',
                    	key: 'freeReportNumber',
                    	width: 90
                    },
                    {
                    	title: '接单数',
                    	key: 'acceptRequestNumber',
                    	width: 80
                    },
                    {
                        title: '要求详情',
                        key: 'description',
                        width: 100,
                        render: (h, params) => {
	                        return h('Poptip', {
	                            props: {
	                                trigger: 'hover',
	                                content: params.row.description,
	                                placement: 'bottom'
	                            }
	                        }, [
	                            h('Tag', params.row.description)
	                        ]);
	                    }
                    },
                    {
                    	title: '操作',
                    	width: 150,
                    	fixed: 'right',
                    	align: 'center',
                    	render: (h, params) => {
                    		return h('div', [
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
                                            this.toReceiptList(params.index)
                                        }
                                    }
                                }, '接单详情'),
                                h('Button', {
                                    props: {
                                        type: params.row.onlineStatus == 3?'error':'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                        	if (params.row.onlineStatus == 3) {
                                        		if (params.row.acceptRequestNumber > 0) {
                                        			this.$Notice.warning({ title: '已被接单,不能下线' });
                                        		} else {
                                        			this.offLine(params.index, params.row.uid, params.row.user.uuid);
                                        		}
                                        	} else {
                                        		this.onLine(params.index, params.row.uid, params.row.user.uuid);
                                        	}
                                        }
                                    }
                                }, params.row.onlineStatus == 3?'下线':'上线')
                            ]);
                    	}
                    }
                ],
                data: [],				//要渲染的数据
                loadingState: true,		//表格读取状态
                total: 0,				//总页数
                searchType: 'uuid',		//检索类型
                searchContent: '',		//检索内容
                orderColumns: [
                	{
						type: 'index',
						width: 60,
						align: 'center'
					},
					{
						title: 'uid',
						key: 'uid'
					},
                    {
                        title: '调研名称',
						render: (h, params) => {
							return h('div', params.row.task.name);
						}
                    },
                    {
                        title: '分析师',
                        render: (h, params) => {
							return h('div', params.row.user.nickName);
						}
                    },
                    {
                        title: '接单时间',
                        key: 'orderTime',
                        render: (h, params) => {
							return h('div', this.formatDate(params.row.orderTime));
						}
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                        	let status = params.row.status;
                        	switch(status){
                        		case 1: status = '已发布'; break;
                        		case 2: status = '已接单'; break;
                        		case 3: status = '已完成'; break;
                        		case 4: status = '已过期'; break;
                        		case 5: status = '已取消'; break;
                        		default: break;
                        	}
                        	return h('div', status);
                        }
                    }
                ],
                orderData: [],
                orderLoadingState: false,
                orderTotal: 0,
                orderSearchContent: '',
                reportColumns: [
					{
						type: 'index',
						width: 60,
						fixed: 'left',
						align: 'center'
					},
                    {
                        title: 'uid',
                        key: 'uid',
                        width: 80
                    },
                    {
                        title: '报告名称',
                        key: 'name',
                        width: 100
                    },
                    {
                        title: '评级',
                        key: 'rating',
                        width: 100,
                        render: (h, params) => {
                        	let rating = params.row.rating;
                        	switch(rating){
                        		case 1: rating = '一星'; break;
                        		case 2: rating = '二星'; break;
                        		case 3: rating = '三星'; break;
                        		case 4: rating = '四星'; break;
                        		case 5: rating = '五星'; break;
                        		default: break;
                        	}
                        	return h('div', rating);
                        }
                    },
                    {
                        title: '提交人',
                        key: 'nickName',
                        width: 150,
                        render: (h, params) => {
                        	return h('div', params.row.user.nickName);
                        }
                    },
                    {
                        title: '提交人身份',
                        key: 'certificationType',
                        width: 120,
                        render: (h, params) => {
                        	let certificationType = params.row.user.certificationType;
                        	switch(certificationType){
                        		case 1:	certificationType = '没有认证'; break;
								case 2: certificationType = '分析师'; break;
								case 3: certificationType = '媒体'; break;
								case 4: certificationType = '投资者'; break;
								case 5: certificationType = '企业'; break;
								case 88: certificationType = '已下线'; break;
								case 99: certificationType = '运营人员'; break;
								default: break;
                        	}
                        	return h('div', certificationType);
                        }
                    },
                    {
                        title: '报告价格',
                        key: 'price',
                        width: 100
                    },
                    {
                        title: '创建时间',
                        key: 'createdTime',
                        width: 150,
                        render: (h, params) => {
                        	return h('div', this.formatDate(params.row.createdTime));
                        }
                    },
                    {
                        title: '报告描述',
                        key: 'content',
                        render: (h, params) => {
	                        return h('Poptip', {
	                            props: {
	                                trigger: 'hover',
	                                content: params.row.content,
	                                placement: 'bottom'
	                            }
	                        }, [
	                            h('Tag', params.row.content)
	                        ]);
	                    }
                    },
                    {
                    	title: '操作',
                    	fixed: 'right',
                    	width: 80,
                    	align: 'center',
                    	render: (h, params) => {
                    		return h('div', [
                                h('Button', {
                                    props: {
                                        type: params.row.onlineStatus == 3?'error':'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            if (params.row.onlineStatus == 3) {
                                            	if (params.row.certificationType == '已下线') {
	                                        		this.$Notice.warning({ title: '该用户已下线' });
	                                        	} else {
	                                        		this.reportOffLine(params.index, params.row.uid);
	                                        	}
                                        	} else {
                                        		this.reportOnLine(params.index, params.row.uid);
                                        	}
                                        }
                                    }
                                }, params.row.onlineStatus == 3?'下线':'上线')
                            ]);
                    	}
                    }
                ],
                reportLoadingState: false,			//表格读取状态
                reportData: [],					//渲染的数据
                reportTotal: 0,
                reportCurrentIndex: '',			//当前索引
                reportSearchType: 'uuid',			//检索类型
                reportSearchContent: '',			//检索内容
                addReportShow: false,
                reportFormItem: {
					name: '',
					content: '',
					rating: '1',
					price: '',
					taskId: ''
				}
			}
		},
		methods: {
            /*查看接单详情*/
           	toReceiptList (index) {
           		this.$router.push({ path: 'orderTakingList/' + this.data[index].uid, query: { name: this.data[index].name, taskAcceptList: this.data[index].taskAcceptList } })
           	},
           	/*获取列表*/
           	loadList (page) {
           		this.loadingState = true;
	        	let url = '';
	        	if (this.searchContent == '') {
           			url = 'user/task/condition/lists?page=' + page + '&pageSize=10';
           		} else {
           			url = 'user/task/condition/lists?' + this.searchType + '=' + this.searchContent + '&page=' + page + '&pageSize=10';
           		}
           		this.$axios.get(url)
				.then((response) => {
					if(response.data.isSuccessful){
						this.data = response.data.data.rows;
						this.total = parseInt(response.data.data.records);
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
           	/*分页*/
           	changePage (page) {
           		this.loadList(page);
           	},
           	/*搜索*/
           	search () {
           		this.loadList(1);
           	},
           	/*获取接单列表*/
           	changeRequest (currentRow, oldCurrentRow) {
           		this.orderSearchContent = currentRow.uid;
           		this.getOrderList(1);
           	},
            /*下线*/
            offLine (index, taskId, userUuid) {
            	let adminUuid = localStorage.adminUuid;
            	this.$Modal.confirm({
                    content: `确认下线名称为${this.data[index].name}的调研吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/task/remove', qs.stringify({ taskId: taskId, userUuid: userUuid, adminUuid: adminUuid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							console.log(response.data);
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
            /*上线*/
            onLine (index, taskId, userUuid) {
            	let adminUuid = localStorage.adminUuid;
            	this.$Modal.confirm({
                    content: `确认上线名称为${this.data[index].name}的调研吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/task/online', qs.stringify({ taskId: taskId, userUuid: userUuid, adminUuid: adminUuid }),
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
            /*时间格式化*/
			formatDate (timestamp) {
				let date = new Date(timestamp);
		        let Y = date.getFullYear() + '-';
		        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		        let D = (	date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
		        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		        return Y+M+D+h+m+s;
			},
			/*接单列表相关*/
			/*获取接单列表*/
			getOrderList (page) {
				let url = '';
				let orderSearchContent = this.orderSearchContent;
				if (orderSearchContent == '') {
					url = 'user/taskAccept/lists?page=' + page + '&pageSize=10';
				} else {
					url = 'user/taskAccept/lists?page=' + page + '&pageSize=10&taskId=' + orderSearchContent;
				}
				this.orderLoadingState = true;
				this.$axios.get(url)
				.then((response) => {
					if (response.data.isSuccessful) {
						this.orderData = response.data.data.rows;
						this.orderTotal = response.data.data.records;
					} else {
						this.$Notice.error({ title: response.data.message });
					}
					this.orderLoadingState = false;
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.orderLoadingState = false;
	        	})
			},
			/*接单列表分页*/
			orderChangePage (page) {
				this.getOrderList(page);
			},
			/*接单搜索*/
			orderSearch () {
				this.getOrderList(1);
			},
			/*获取指定报告*/
			changeOrder (currentRow, oldCurrentRow) {
				let currentTaskId = currentRow.taskId;
				let currentUserId = currentRow.userId;
				this.reportData = [];
				this.reportLoadingState = true;
				this.$axios.get('user/reportByTaskIdAndUserId?taskId='+currentTaskId+'&userId='+currentUserId)
				.then((response) => {
					if(response.data.isSuccessful){
						let arr = [];
						arr.push(response.data.data);
						this.reportData = arr;
						this.reportTotal = 1;
					}
					this.reportLoadingState = false;
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.reportLoadingState = false;
	        	})
			},
			/*报告列表相关*/
			/*获取报告列表*/
			getReportList (page) {
				this.reportLoadingState = true;
           		let url = '';
           		if (this.reportSearchContent == '') {
           			url = 'user/report/condition/list?page=' + page + '&pageSize=10';
           		} else {
           			url = 'user/report/condition/list?' + this.reportSearchType + '=' + this.reportSearchContent + '&page=' + page + '&pageSize=10';
           		}
           		this.$axios.get(url)
				.then((response) => {
					if(response.data.isSuccessful){
						this.reportData = response.data.data.rows;
						this.reportTotal = parseInt(response.data.data.records);
					} else {
						this.$Notice.error({ title: response.data.message });
					}
					this.reportLoadingState = false;
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.reportLoadingState = false;
	        	})
			},
			/*报告列表分页*/
			reportChangePage (page) {
            	this.getReportList(page);
            },
            /*报告搜索*/
           	reportSearch () {
           		this.getReportList(1);
           	},
           	/*下线*/
            reportOffLine (index, reportId) {
            	this.$Modal.confirm({
                    content: `确认下线名称为${this.reportData[index].name}的报告吗?`,
                    onOk: () => {
                    	this.reportLoadingState = true;
		           		this.$axios.post('user/report/remove', qs.stringify({ reportId: reportId }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.reportData[index].onlineStatus = 9;
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: response.data.message });
							}
							this.reportLoadingState = false;
			        	})
			        	.catch((error) => {
			        		console.log(error);
			        		this.reportLoadingState = false;
			        	})
                    }
                });
            },
            /*上线*/
            reportOnLine (index, reportId) {
            	this.$Modal.confirm({
                    content: `确认上线名称为${this.reportData[index].name}的报告吗?`,
                    onOk: () => {
                    	this.reportLoadingState = true;
		           		this.$axios.post('user/report/online', qs.stringify({ reportId: reportId }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.reportData[index].onlineStatus = 3;
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: response.data.message });
							}
							this.reportLoadingState = false;
			        	})
			        	.catch((error) => {
			        		console.log(error);
			        		this.reportLoadingState = false;
			        	})
                    }
                });
            },
            /*新增报告*/
            addReport () {
            	this.reportFormItem = {
					name: '',
					content: '',
					rating: '1',
					price: '',
					taskId: ''
				}
				this.addReportShow = true;
			},
			/*新增报告确认*/
			addReportConfirm () {
				this.reportLoadingState = true;
				this.reportFormItem['onlineTime'] = new Date().getTime();
            	this.reportFormItem['adminUuid'] = localStorage.adminUuid;
            	
            	this.$axios.post('user/add/report', qs.stringify(this.reportFormItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
						this.getReportList(1);
					} else {
						this.$Notice.error({ title: response.data.message });
						this.reportLoadingState = false;
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.$router.push({ path: '/500' });
	        	})
			}
		},
		mounted: function () {
			this.loadList(1);
			this.getOrderList(1);
			this.getReportList(1);
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
	.searchBox {
		float: right;
		width: 280px;
	}
	.page {
		float: right;
		margin-top: 20px;
	}
	.text-center {
		text-align: center;
	}
</style>