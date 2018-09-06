<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的uuid或昵称">
				<Select v-model="searchType" slot="prepend" style="width: 80px">
		            <Option value="uuid">uuid</Option>
		            <Option value="nickName">昵称</Option>
		            <Option value="email">邮箱</Option>
		            <Option value="invitationCode">邀请码</Option>
		            <Option value="ethWalletAddress">eth钱包</Option>
		        </Select>
				<Button slot="append" icon="md-search" @click="search"></Button>
			</Input>
		</ButtonGroup>
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
		<div class="page">
			<Page :total="total" :current="1" show-total @on-change="changePage"></Page>
		</div>
		<Modal
	        v-model="showRecharge"
	        title="INB充值"
	        @on-ok="confirmRecharge">
	        <p>新增INB数量:</p>
	        <Input v-model="inbNumber"></Input>
	        <p>钱包类型:</p>
	        <Select v-model="walletType">
	        	<Option value="1">eth</Option>
	        	<Option value="2">btc</Option>
	        </Select>
	    </Modal>
	    <Modal
	        v-model="showRechargeConfirm"
	        title="确认充值INB"
	        @on-ok="confirmRechargeSecond">
	        	<p style="font-size: 18px;">充值的INB数量: {{ inbNumber }}</p>
	        	<p style="font-size: 18px;">充值前INB数量: {{ beforeRecharge }}</p>
	        	<p style="font-size: 18px;">充值后INB数量: {{ afterRecharge }}</p>
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
                        title: 'uuid',
                        key: 'uuid',
                        width: 150
                   },
                    {
                        title: '昵称',
                        key: 'nickName',
                        width: 150
                    },
                    {
                    	title: '头像',
                    	key: 'headImageUrl',
                    	width: 80,
                    	render: (h,params) => {
                    		return h('Img', {
                    			attrs: {
                    				src: params.row.headImageUrl,
                    				style: 'width: 30px;'
                    			}
                    		})
                    	}
                    },
                    {
                        title: 'INB数量',
                        key: 'inbNumber',
                        width: 100
                    },
                    {
                        title: '注册时间',
                        key: 'registerTime',
                        width: 150,
                        render: (h, params) => {
                        	return h('div', this.formatDate(params.row.registerTime));
                        }
                    },
                    {
                        title: '身份类型',
                        key: 'certificationType',
                        width: 100,
                        render: (h, params) => {
                        	let certificationType = params.row.certificationType;
                        	switch(certificationType){
                        		case 1:	certificationType = '没有认证'; break;
								case 2: certificationType = '个人认证'; break;
								case 6: certificationType = 'Panel和Kyc认证'; break;
								case 10: certificationType = '分析师和Kyc认证'; break;
								case 14: certificationType = '分析师,panel,Kyc认证'; break;
								default: break;
                        	}
                        	return h('div', certificationType);
                        }
                    },
                    {
                    	title: '邀请码',
                    	key: 'invitationCode',
                    	width: 100
                    },
                    {
                    	title: '邮箱',
                    	key: 'email',
                    	width: 150
                    },
                    {
                    	title: '邮箱激活状态',
                    	key: 'emailVerified',
                    	width: 120,
                    	render: (h, params) => {
                    		let emailVerified = params.row.emailVerified;
                    		switch(emailVerified){
                    			case 1: emailVerified = '未激活'; break;
								case 2: emailVerified = '已激活'; break;
								default: break;
                    		}
                    		return h('div', emailVerified);
                    	}
                    },
                    {
                    	title: '邀请人uuid',
                    	width: 120,
                    	render: (h, params) => {
                    		let inviteUserUuid = '';
                    		if (params.row.inviteUser) {
                    			inviteUserUuid = params.row.inviteUser.uuid;
                    		}
                    		return h('div', inviteUserUuid);
                    	}
                    },
                    {
                    	title: '状态',
                    	width: 100,
                    	render: (h, params) => {
                    		let status = params.row.status;
                    		switch (status) {
                    			case 1: status = '正常用户'; break;
                    			case 2: status = '禁言用户'; break;
                    			case 3: status = '下线用户'; break;
                    			default: break;
                    		}
                    		return h('div', status);
                    	}
                    },
                    {
                    	title: '用户级别',
                    	width: 100,
                    	render: (h, params) => {
                    		let adminLevel = params.row.adminLevel;
                    		switch (adminLevel) {
                    			case 0: adminLevel = '正常用户'; break;
                    			case 1: adminLevel = '超级管理员'; break;
                    			case 2: adminLevel = '管理员'; break;
                    			default: break;
                    		}
                    		return h('div', adminLevel);
                    	}
                    },
                    {
                    	title: '操作',
                    	key: 'action',
                    	width: 240,
                    	fixed: 'right',
                    	align: 'center',
                    	render: (h, params) => {
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
                                }, '查看'),
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
                                            this.recharge(params.index);
                                        }
                                    }
                                }, '充值'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                        	if (params.row.status == 3) {
                                        		this.$Notice.warning({ title: '该用户已下线' });
                                        	} else {
                                        		this.remove(params.index);
                                        	}
                                        }
                                    }
                                }, '拉黑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                        	this.banned(params.index, params.row.uuid);
                                        }
                                    }
                                }, '禁言')
                            ]);
                    	}
                    }
                ],
                data: [],					//渲染的数据
                loadingState: true,			//表格读取状态
                total: 0,					//查询出的数据总条数
                defaultType: 'test1',		//默认搜索的全部
				searchType: 'uuid',			//搜索类型
				searchContent: '',			//搜索的内容
				showRecharge: false,		//显示充值模态框
				showRechargeConfirm: false,	//显示充值确认模态框
				currentIndex: '',			//当前操作的索引
				inbNumber: '',				//新增INB数量
				walletType: '1',			//钱包类型
				beforeRecharge: '',			//充值前INB数量
				afterRecharge: ''			//充值后INB数量
			}
		},
		methods: {
			/*查看*/
			show (index) {
                this.$Modal.success({
                    title: `${this.data[index].nickName}的其它信息`,
                    content: `真实姓名：${this.data[index].name}<br>
                    		电话号码：${this.data[index].phoneNubmer}<br>
                    		eth钱包：${this.data[index].ethWalletAddress}<br>
                    		btc钱包：${this.data[index].btcWalletAddress}<br>
                    		neo钱包：${this.data[index].neoWalletAddress}<br>
                    		eos钱包：${this.data[index].eosWalletAddress}<br>
                    		eth充值地址id：${this.data[index].ethExchangeAddressId}<br>
                    		btc充值地址id：${this.data[index].btcExchangeAddressId}<br>
                    		neo充值地址id：${this.data[index].neoExchangeAddressId}<br>
                    		eos充值地址id：${this.data[index].eosExchangeAddressId}<br>`
                })
           },
            /*拉黑*/
            remove (index) {
                this.$Modal.confirm({
                    content: `确认拉黑昵称为${this.data[index].nickName}的用户吗?`,
                    onOk: () => {
                    	let userUuid = this.data[index].uuid;
                    	this.loadingState = true;
		           		this.$axios.post('user/remove', qs.stringify({ userUuid: userUuid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[index].status = 3;
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
            /*禁言*/
            banned (index, userUuid) {
            	this.$Modal.confirm({
                    content: `确认禁言昵称为${this.data[index].nickName}的用户吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/update/status', qs.stringify({ userUuid: userUuid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[index].status = 2;
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
            /*分页*/
           	changePage (page) {
           		this.loadList(page);
           	},
           	/*充值*/
           	recharge (index) {
           		this.inbNumber = '';
               	this.showRecharge = true;
               	this.currentIndex = index;
           	},
           	/*确认充值*/
           	confirmRecharge () {
	        	this.showRechargeConfirm = true;
	        	this.beforeRecharge = this.data[this.currentIndex].inbNumber;
	        	this.afterRecharge = this.beforeRecharge + parseInt(this.inbNumber);
			},
			/*再次确认充值*/
			confirmRechargeSecond () {
				let uuid = this.data[this.currentIndex].uuid;
				let inbNumber = parseInt(this.inbNumber);
				let walletType = parseInt(this.walletType);
				this.loadingState = true;
           		this.$axios.post('user/recharge', qs.stringify({ uuid: uuid, inbNumber: inbNumber, walletType: walletType }),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.data[this.currentIndex].inbNumber += inbNumber;
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
           	/*获取列表*/
           	loadList (page) {
           		this.loadingState = true;
           		this.$axios.get('user/lists?page='+page+'&pageSize=10')
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
           	/*add () {
				this.$router.push({ name: 'userAdd' })
			},
			typeChange (defaultType) {
				console.log(defaultType);
			},*/
			/*搜索*/
			search () {
				let searchType = this.searchType;
				let searchContent = this.searchContent;
				this.loadingState = true;
           		this.$axios.get('user/lists?page=1&pageSize=10'+'&'+searchType+'='+searchContent)
				.then((response) => {
					console.log(response);
					if (response.data.isSuccessful) {
						this.data = response.data.data.rows;
						this.total = response.data.data.total;
						this.handleData();
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
	}
	.page {
		float: right;
		margin-top: 20px;
	}
</style>