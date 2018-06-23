<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的内容">
				<Select v-model="searchType" slot="prepend" style="width: 100px">
		            <Option value="uuid">用户uuid</Option>
		            <Option value="nickName">用户昵称</Option>
		            <Option value="transaction">transaction</Option>
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
                        title: 'uuid',
                        key: 'userUuid'
                    },
                    {
                        title: '用户名',
                        key: 'nickName'
                    },
                    {
                        title: '身份',
                        key: 'identity'
                    },
                    {
                        title: '身份类型',
                        key: 'identityType'
                    },
                    {
                        title: '交易类型',
                        key: 'status'
                    },
                    {
                        title: '交易金额',
                        key: 'inbNumber'
                    },
                    {
                        title: '交易号',
                        key: 'taskId'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime'
                    },
                    {
                        title: '交易时间',
                        key: 'orderTime'
                    },
                    {
                        title: '经办人',
                        key: 'agent'
                    }
                ],
                data: [],
                loadingState: false,	//表格读取状态
                total: 0,				//总页数
                searchType: 'uuid',		//检索类型
                searchContent: ''		//检索内容
			}
		},
		methods: {
           	/*获取列表*/
           	loadList (page) {
           		this.loadingState = true;
	        	let url = '';
	        	if (this.searchContent == '') {
           			url = 'user/order/lists?page=' + page + '&pageSize=10';
           		} else {
           			url = 'user/order/lists?' + this.searchType + '=' + this.searchContent + '&page=' + page + '&pageSize=10';
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
			/*数据处理*/
			handleData () {
				this.data.forEach((item, index) => {
					item.userUuid = item.user.uuid;
					item.nickName = item.user.nickName;
					item.orderTime = this.formatDate(item.orderTime);
					switch(item.status)
					{
						case 1:
							item.status = '注册奖励';
							break;
						case 2:
							item.status = '邀请奖励';
							break;
						case 3:
							item.status = '充值';
							break;
						case 4:
							item.status = '提现';
							break;
						case 5:
							item.status = '发起调研';
							break;
						case 6:
							item.status = '购买报告';
							break;
						case 7:
							item.status = '下线调研';
							break;
						case 8:
							item.status = '上线调研';
							break;
						case 9:
							item.status = '填写报告';
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
	.searchBox {
		float: right;
		width: 280px;
	}
	.page {
		float: right;
		margin-top: 20px;
	}
</style>