<template>
	<div>
		1美元 = {{data[0].usdToInbRate}}Inb
		<ButtonGroup size="small" class="btn-group">
			<Button type="info" @click="modifyRatio">修改比例</Button>
		</ButtonGroup>
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
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
	                	title: '兑换Inb数量',
	                    key: 'exchangeRateEth'
	                },
	                {
	                	title: '更新日期',
	                    key: 'updatedTime'
	                }
                ],
                data: [{usdToInbRate: '-'}],
                loadingState: false,	//表格读取状态
                ratio: 100,
                showModify: false,
                currentRatio: ''
			}
		},
		methods: {
			initData () {
				this.loadingState = true;
				this.$axios.get('user/insight/info')
				.then((response) => {
					if (response.data.isSuccessful) {
						let arr = [];
						arr.push(response.data.data);
						this.data = arr;
						this.handleData();
						this.loadingState = false;
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        	})
			},
			/*处理数据*/
			handleData () {
				this.data.forEach((item, index) => {
					item.updatedTime = this.formatDate(item.updatedTime);
				});
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
								this.data[0].usdToInbRate = this.currentRatio;
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
			this.initData();
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
</style>