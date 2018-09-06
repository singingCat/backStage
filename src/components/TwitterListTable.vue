<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Select size="small" class="selectType" v-model="status" @on-change="statusChange(status)">
				<Option value="0">全部</Option>
				<Option value="2">待审核</Option>
				<Option value="3">已拒绝</Option>
				<Option value="5">已打币</Option>
			</Select>
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的内容">
				<Select v-model="searchType" slot="prepend" style="width: 100px">
		            <Option value="uuid">uuid</Option>
		            <Option value="nickName">昵称</Option>
		            <Option value="email">邮箱</Option>
		            <Option value="userName">Twitter昵称</Option>
		        </Select>
				<Button slot="append" icon="md-search" @click="search"></Button>
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
						title: 'uid',
						key: 'uid'
					},
					{
						title: '用户昵称',
						render: (h, params) => {
							if (params.row.user) {
								return h('div', params.row.user.nickName);
							}
						}
					},
					{
						title: 'Twitter昵称',
						key: 'userName'
					},
					{
						title: '提交时间',
						render: (h, params) => {
							return h('div', this.formatDate(params.row.createdTime));
						}
					},
					{
						title: '奖励INB数量',
						key: 'rewardInb'
					},
					{
						title: '状态',
						render: (h, params) => {
							let status = params.row.status;
							switch (status) {
								case 2: status = '待审核'; break;
								case 3: status = '已拒绝'; break;
								case 5: status = '已打币'; break;
								default: break;
							}
							return h('div', status);
						}
					},
					{
						title: '审核时间',
						render: (h, params) => {
							return h('div', this.formatDate(params.row.reviewTime));
						}
					},
					{
						title: '审核人',
						render: (h, params) => {
							if (params.row.adminUser) {
								return h('div', params.row.adminUser.nickName);
							}
						}
					},
					{
						title: '操作',
						width: 160,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        display: params.row.status != 2?'none': 'inline-block'
                                    },
                                    on: {
                                        click: () => {
                                        	this.pass(params.row.uid);
                                        }
                                    }
                                }, '打币'),
								h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                    	display: params.row.status != 2?'none': 'inline-block'
                                    },
                                    on: {
                                        click: () => {
                                        	this.refuse(params.row.uid);
                                        }
                                    }
                                }, '拒绝')
							]);
						}
					}
				],
				searchType: '',
				searchContent: '',
				loadingState: false,
				total: 0,
				data: [{uid: 1}],
				status: '0'
			}
		},
		methods: {
			loadList (page) {
				this.loadingState = true;
				let url = 'user/userAirdrop/list?page='+page+'&pageSize=10&type=2';
				if (this.searchType != '') {
					url = 'user/userAirdrop/list?page='+page+'&pageSize=10&type=2' + 
					'&' + this.searchType + '=' + this.searchContent;
				}
				if (this.status != '' && this.status != 'undefind') {
					url += '&status=' + this.status;
				}
           		this.$axios.get(url)
				.then((response) => {
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
			search () {
				this.loadList(1);
			},
			changePage (page) {
				this.loadList(page);
			},
			statusChange (status) {
				this.loadList(1);
			},
			pass (userAirdropId) {
				this.$Modal.confirm({
					content: `确认打币吗?`,
					onOk: () => {
						this.loadingState = true;
		           		this.$axios.post('user/userAirdrop/pass', qs.stringify({ userAirdropId: userAirdropId }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.loadList(1);
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
			refuse (userAirdropId) {
				this.$Modal.confirm({
					content: `确认打币吗?`,
					onOk: () => {
						this.loadingState = true;
		           		this.$axios.post('user/userAirdrop/refuse', qs.stringify({ userAirdropId: userAirdropId }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.loadList(1);
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
		        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
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
		width: 290px;
	}
	.page {
		float: right;
		margin-top: 20px;
	}
</style>