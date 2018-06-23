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
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
		<div class="page">
			<Page :total="total" :current="1" show-total @on-change="changePage"></Page>
		</div>
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
                        width: 100
                    },
                    {
                        title: '调研名称',
                        key: 'name',
                        width: 100
                    },
                    {
                    	title: '调研状态',
                    	key: 'status',
                    	width: 100
                    },
                    {
                    	title: '是否公开',
                    	key: 'isPublic',
                    	width: 100
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
                        width: 150
                    },
                    {
                        title: '结束时间',
                        key: 'validToTime',
                        sortable: true,
                        width: 150
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
                searchContent: ''		//检索内容
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
						this.handleData();
						this.loadingState = false;
					}
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
								this.loadingState = false;
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: '操作失败' });
								this.loadingState = false;
							}
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
								this.loadingState = false;
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: '操作失败' });
							}
			        	})
			        	.catch((error) => {
			        		console.log(error);
			        		this.loadingState = false;
			        	})
                    }
                });
            },
            /*数据处理*/
           	handleData () {
           		this.data.forEach((item, index) => {
           			item.coinName = item.coin.name;
           			if (item.validFromTime) {
           				item.validFromTime = this.formatDate(item.validFromTime);
           			}
           			if (item.validToTime) {
           				item.validToTime = this.formatDate(item.validToTime);
           			}
           			if (item.nickName) {
           				item.nickName = item.user.nickName;
           			}
           			/*状态*/
					switch(item.status)
					{
						case 1:
							item.status = '已发布';
							break;
						case 2:
							item.status = '已接单';
							break;
						case 3:
							item.status = '已完成';
							break;
						case 4:
							item.status = '已过期';
							break;
						case 5:
							item.status = '已取消';
							break;
						default:
							break;
					}
					/*是否公开*/
					switch(item.isPublic)
					{
						case 1:
							item.isPublic = '公开';
							break;
						case 2:
							item.isPublic = '不公开';
							break;
						default:
							break;
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
			}
		},
		mounted: function () {
			this.loadList(1);
		}
	}
</script>

<style scoped>
	.btn-group {
		margin-bottom: 10px;
		margin-right: 20px;
		width: 100%;
	}
	.searchBox {
		float: right;
		width: 280px;
	}
	.page {
		float: right;
		margin-top: 20px;
	}
</style>