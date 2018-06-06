<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="add">新增</Button>
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的内容">
				<Select v-model="searchType" slot="prepend" style="width: 80px">
		            <Option value="coinName">数币名称</Option>
		            <Option value="getType">空投类型</Option>
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
						align: 'center'
					},
					{
                        title: 'uid',
                        key: 'uid'
                   },
                    {
                        title: '数币名称',
                        key: 'coinName'
                    },
                    {
	                    title: '状态',
	                    key: 'onlineStatus',
	                    width: 130,
	                    render: (h, params) => {
	                        const row = params.row;
	                        const color = row.onlineStatus === 2 ? '#2db7f5' : row.onlineStatus === 3 ? '#f90' : '#ed3f14';
	                        const text = row.onlineStatus === 2 ? '测试中' : row.onlineStatus === 3 ? '已上线' : '已下线';
	
	                        return h('Tag', {
	                            props: {
	                                type: 'dot',
	                                color: color
	                            }
	                        }, text);
	                    }
	                },
                    {
                        title: '奖励类型',
                        key: 'getType'
                    },
                    {
                        title: '空投详情',
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
                        title: '空投入口',
                        render: (h, params) => {
	                        return h('Poptip', {
	                            props: {
	                                trigger: 'hover',
	                                content: params.row.entrance,
	                                placement: 'bottom'
	                            }
	                        }, [
	                            h('Tag', params.row.entrance)
	                        ]);
	                    }
                    },
                    {
                        title: '空投奖励',
                        key: 'reward'
                    },
                    {
                        title: '开始日期',
                        key: 'validFromTime'
                    },
                    {
                        title: '结束日期',
                        key: 'validToTime'
                    },
                    {
                    	title: '操作',
                    	key: 'action',
                    	width: 140,
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
                                            let adminUuid = parseInt(localStorage.adminUuid);
                                            this.test(params.index, params.row.uid, adminUuid);
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
                                        	let adminUuid = parseInt(localStorage.adminUuid);
                                        	
                                        	if (params.row.onlineStatus == 3) {
                                        		this.offLine(params.index, params.row.uid, adminUuid);
                                        	} else {
                                        		this.onLine(params.index, params.row.uid, adminUuid);
                                        	}
                                        }
                                    }
                                }, params.row.onlineStatus == 3?'下线':'上线')
                            ]);
                    	}
                    }
                ],
                data: [],					//渲染的数据
                loadingState: true,			//表格读取状态
                total: 0,					//查询出的数据总条数
                searchType: 'coinName',
				searchContent: ''			//搜索的内容
			}
		},
		methods: {
			/*处理数据*/
			handleData () {
				this.data.forEach((item, index) => {
					item.coinName = item.coin.name;
					item.validFromTime = this.formatDate(item.validFromTime);
					item.validToTime = this.formatDate(item.validToTime);
					switch(item.getType)
					{
						case 1:
							item.getType = '新用户';
							break;
						case 2:
							item.getType = '社区';
							break;
						case 3:
							item.getType = '发款';
							break;
						case 4:
							item.getType = 'KYC';
							break;
						case 5:
							item.getType = '其它';
							break;
						default:
							break;
					}
				})
			},
            /*分页*/
           	changePage (page) {
           		this.loadList(page);
           	},
           	/*获取列表*/
           	loadList (page) {
           		this.loadingState = true;
           		let parameter = { page: page, pageSize: 10 };
           		let searchContent = this.searchContent;
	        	if (searchContent != '') {
	        		switch(searchContent)
	        		{
	        			case '新用户': parameter[this.searchType] = 1; break;
	        			case '社区': parameter[this.searchType] = 2; break;
	        			case '发款': parameter[this.searchType] = 3; break;
	        			case 'KYC': parameter[this.searchType] = 4; break;
	        			case '其它': parameter[this.searchType] = 5; break;
	        			default: parameter[this.searchType] = this.searchContent; break;
	        		}
           		}
           		this.$axios.post('user/airdrop/list', qs.stringify(parameter),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.data = response.data.data.rows;
						this.total = response.data.data.total;
						this.handleData();
						this.loadingState = false;
					} else {
						this.loadingState = false;
						this.$Notice.error({ title: response.data.message });
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.loadingState = false;
	        	})
           	},
           	/*添加空投*/
           	add () {
				this.$router.push({ name: 'airdropEdit' });
			},
			/*搜索*/
			search () {
				this.loadList(1);
			},
			/*下线*/
			offLine (index, airdropId, adminUuid) {
				this.$Modal.confirm({
                    content: `确认下线该空投吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/airdrop/remove', qs.stringify({ airdropId: airdropId, adminUuid: adminUuid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							console.log(response.data);
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
			onLine (index, airdropId, adminUuid) {
				this.$Modal.confirm({
                    content: `确认上线该空投吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/airdrop/online', qs.stringify({ airdropId: airdropId, adminUuid: adminUuid }),
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
			/*测试*/
			test (index, airdropId, adminUuid) {
				this.$Modal.confirm({
                    content: `确认将该空投改为测试状态吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/airdrop/testing', qs.stringify({ airdropId: airdropId, adminUuid: adminUuid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[index].onlineStatus = 2;
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
	.btn-group button.ivu-btn {
		float: right;
	}
	.selectType {
		float: right;
		width: 100px;
		margin-left: 20px;
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