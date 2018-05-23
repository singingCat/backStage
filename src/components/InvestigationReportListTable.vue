<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="add">新增</Button>
			<Input class="searchBox" size="small" v-model="searchContent" placeholder="要搜索的内容">
				<Select v-model="searchType" slot="prepend" style="width: 100px">
		            <Option value="uuid">分析师uuid</Option>
		            <Option value="nickName">分析师昵称</Option>
		            <Option value="reportName">报告名称</Option>
		        </Select>
				<Button slot="append" icon="search" @click="search"></Button>
			</Input>
		</ButtonGroup>
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
		<div class="page">
			<Page :total="100" :current="1" show-total @on-change="changePage"></Page>
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
						align: 'center'
					},
                    {
                        title: 'uid',
                        key: 'uid'
                    },
                    {
                        title: '报告名称',
                        key: 'name'
                    },
                    {
                        title: '提交人',
                        key: 'nickName'
                    },
                    {
                        title: '提交人身份',
                        key: 'certificationType'
                    },
                    {
                        title: '报告价格',
                        key: 'price'
                    },
                    {
                        title: '创建时间',
                        key: 'createdTime',
                        width: 150
                    },
                    {
                        title: '地址',
                        key: 'content'
                    },
                    {
                    	title: '操作',
                    	width: 240,
                    	align: 'center',
                    	render: (h, params) => {
                    		var that = this;
                    		return h('div', [
                    			h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '所在调研请求详情'),
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
                loadingState: true,			//表格读取状态
                data: [],					//渲染的数据
                currentIndex: '',			//当前索引
                searchType: 'uuid',			//检索类型
                searchContent: ''			//检索内容
			}
		},
		methods: {
			/*查看*/
			show (index) {
                this.$Modal.success({
                    title: `${this.data[index].requestTitle}的主要信息`,
                    content: `货币名：${this.data[index].task.coin.name}<br>
                    		调研名称：${this.data[index].task.name}<br>
                    		调研状态：${this.data[index].task.status}<br>
                    		是否公开: ${this.data[index].task.isPublic}<br>
                    		请求调研开始时间: ${this.data[index].task.validFromTime}<br>
                    		请求调研结束时间: ${this.data[index].task.validToTime}<br>
                    		需要多少分析师: ${this.data[index].task.needAnalystNumber}<br>
                    		每份奖励：${this.data[index].task.rewardInb}<br>
                    		附带免费报告数: ${this.data[index].task.freeReportNumber}<br>
                    		接单数: ${this.data[index].task.acceptRequestNumber}<br>
                    		要求详情: ${this.data[index].task.description}<br>`
                })
            },
            /*查看接单详情*/
           	toReceiptList (index) {
           		this.$router.push({ path: 'orderTakingList/' + this.data[index].uuid })
           	},
            /*获取列表*/
           	loadList (page) {
           		this.loadingState = true;
           		let url = '';
           		if (this.searchContent == '') {
           			url = 'user/report/condition/list?page=' + page + '&pageSize=10';
           		} else {
           			url = 'user/report/condition/list?' + this.searchType + '=' + this.searchContent + '&page=' + page + '&pageSize=10';
           		}
           		this.$axios.get(url)
				.then((response) => {
					if(response.data.isSuccessful){
						this.data = response.data.data.rows;
						this.total = parseInt(response.data.data.total);
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
           	/*数据处理*/
           	handleData () {
           		this.data.forEach((item, index) => {
           			item.nickName = item.user.nickName;
           			item.createdTime = this.formatDate(item.createdTime);
           			/*提交人身份*/
           			switch(item.user.certificationType)
           			{
           				case 1:	
							item.certificationType = '没有认证';
							break;
						case 2:
							item.certificationType = '分析师';
							break;
						case 3:
							item.certificationType = '媒体';
							break;
						case 4:
							item.certificationType = '投资者';
							break;
						case 5:
							item.certificationType = '企业';
							break;
						default: 
							item.certificationType = '未知';
							break;
           			}
           			/*状态*/
					switch(item.task.status)
					{
						case 1:
							item.task.status = '已发布';
							break;
						case 2:
							item.task.status = '已接单';
							break;
						case 3:
							item.task.status = '已完成';
							break;
						case 4:
							item.task.status = '已过期';
							break;
						case 5:
							item.task.status = '已取消';
							break;
						default:
							break;
					}
					/*是否公开*/
					switch(item.task.isPublic)
					{
						case 1:
							item.task.isPublic = '公开';
							break;
						case 2:
							item.task.isPublic = '不公开';
							break;
						default:
							break;
					}
					item.task.validFromTime = this.formatDate(item.task.validFromTime);
           			item.task.validToTime = this.formatDate(item.task.validToTime);
           		});
           	},
           	/*下线*/
            offLine (index, reportId) {
            	this.$Modal.confirm({
                    content: `确认下线名称为${this.data[index].name}的报告吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/report/remove', qs.stringify({ reportId: reportId }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[index].onlineStatus = 9;
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
            /*上线*/
            onLine (index, reportId) {
            	this.$Modal.confirm({
                    content: `确认上线名称为${this.data[index].name}的报告吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/report/online', qs.stringify({ reportId: reportId }),
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
            /*新增*/
            add () {
				this.$Message.info('新增')
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
		mounted () {
			this.loadList(1);
		}
	}
</script>

<style scoped>
	.btn-group {
		margin-bottom: 10px;
		width: 100%;
	}
	.btn-group button.ivu-btn {
		float: right;
	}
	.searchBox {
		float: right;
		width: 280px;
		margin-right: 20px;
	}
	.page {
		float: right;
		margin-top: 20px;
	}
</style>