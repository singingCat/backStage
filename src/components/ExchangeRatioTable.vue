<template>
	<div>
		1美元 = {{ratio}}Inb
		<ButtonGroup size="small" class="btn-group">
			<Button type="info" @click="modifyRatio">修改比例</Button>
		</ButtonGroup>
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
		<div class="page">
			<Page :total="total" :current="1" show-total @on-change="changePage"></Page>
		</div>
		<Modal
	        v-model="showModify"
	        title="兑换比例修改"
	        @on-ok="confirmModify">
	        <p>请输入一美元兑换INB的数量:</p>
	        <Input v-model="currentRatio"></Input>
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
						align: 'center'
					},
					{
	                    title: 'uid',
	                    key: 'uid'
	                },
					{
	                    title: '数币名称',
	                    render: (h, params) => {
	                    	return h('span', 'ETH')
	                    }
	                },
	                {
	                    title: '交易单位',
	                    render: (h, params) => {
	                    	return h('span', 1)
	                    }
	                },
	                {
	                    title: '兑换比例',
	                    key: 'exchangeRate'
	                },
	                {
	                    title: '价格',
	                    key: 'price'
	                },
	                {
	                	title: '更新日期',
	                    key: 'updatedTime',
	                    render: (h, params) => {
	                    	return h('span', this.formatDate(params.row.updatedTime));
	                    }
	                }
                ],
                data: [],
                loadingState: false,	//表格读取状态
                ratio: '',
                total: 0,
                showModify: false,
                currentRatio: ''
			}
		},
		methods: {
			loadList (page) {
				this.loadingState = true;
				this.$axios.get('user/insight/info?page='+page+'&pageSize=10')
				.then((response) => {
					if (response.data.isSuccessful) {
						this.ratio = response.data.data.config.usdToInbRate;
						this.total = response.data.data.pager.records;
						this.data = response.data.data.pager.rows;
					} else {
						this.loadingState = false;
						this.$Notice.error({ title: response.data.message });
					}
					this.loadingState = false;
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.loadingState = false;
	        	})
			},
			changePage (page) {
				this.loadList(page);
			},
			modifyRatio () {
				this.currentRatio = '';
				this.showModify = true;
			},
			confirmModify () {
				this.$Modal.confirm({
                    content: '<p>确认修改一美元兑换INB的数量为'+this.currentRatio+'吗?</p>',
                    onOk: () => {
                    	this.loadingState = true;
                    	let adminUuid = localStorage.adminUuid;
						let usdToInbRate = this.currentRatio;
						
                    	this.$axios.post('user/update/config', qs.stringify({ adminUuid: adminUuid, usdToInbRate: usdToInbRate }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.ratio = this.currentRatio;
								this.loadingState = false;
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.loadingState = false;
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
		created () {
			this.loadList(1);
		}
	}
</script>

<style scoped>
	.btn-group {
		margin-bottom: 10px;
	}
	.btn-group button.ivu-btn {
		margin-left: 20px !important;
	}
	.page {
		float: right;
		margin-top: 20px;
	}
</style>