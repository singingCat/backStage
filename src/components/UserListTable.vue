<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<!--<Button type="primary" @click="add">新增</Button>-->
			<!--<Select size="small" class="selectType" v-model="defaultType" @on-change="typeChange(defaultType)">
				<Option value="test1">全部</Option>
				<Option value="test2">运营人员</Option>
				<Option value="test3">普通用户</Option>
			</Select>-->
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的uuid或昵称">
				<Select v-model="searchType" slot="prepend" style="width: 80px">
		            <Option value="uuid">uuid</Option>
		            <Option value="nickName">昵称</Option>
		        </Select>
				<Button slot="append" icon="search" @click="search"></Button>
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
						type: 'index',
						width: 60,
						align: 'center'
					},
					{
                        title: 'uuid',
                        key: 'uuid'
                   },
                    {
                        title: '昵称',
                        key: 'nickName'
                    },
                    {
                        title: 'inb数量',
                        key: 'inbNumber'
                    },
                    {
                        title: '创建时间',
                        key: 'createdTime'
                    },
                    {
                        title: '身份类型',
                        key: 'certificationType'
                    },
                    {
                    	title: '操作',
                    	key: 'action',
                    	width: 220,
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
                                    on: {
                                        click: () => {
                                        	if (params.row.certificationType == '已下线') {
                                        		this.$Notice.warning({ title: '该用户已下线' });
                                        	} else {
                                        		this.remove(params.index);
                                        	}
                                        }
                                    }
                                }, '拉黑')
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
			/*处理数据*/
			handleData () {
				this.data.forEach((item, index) => {
					item.createdTime = this.formatDate(item.createdTime);
					item.registerTime = this.formatDate(item.registerTime);
					if (item.inviteUser) {
						item.inviteUserUuid = item.inviteUser.uuid;
					}
					switch(item.certificationType)
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
						case 88:
							item.certificationType = '已下线';
							break;
						case 99:
							item.certificationType = '运营人员';
							break;
						default: 
							break;
					}
					switch(item.emailVerified)
					{
						case 1:
							item.emailVerified = '未激活';
							break;
						case 2:
							item.emailVerified = '已激活';
							break;
						default: item.emailVerified = '未知';
					}
				})
			},
			/*查看*/
			show (index) {
                this.$Modal.success({
                    title: `${this.data[index].userName}的其它信息`,
                    content: `真实姓名：${this.data[index].name}<br>
                    		头像：<img src="${this.data[index].headImageUrl}" style="width: 30px;vertical-align: text-top;"><br>
                    		电话号码：${this.data[index].phoneNubmer}<br>
                    		邮箱：${this.data[index].email}<br>
                    		邮箱激活状态：${this.data[index].emailVerified}<br>
                    		邀请码：${this.data[index].invitationCode}<br>
                    		邀请人uuid: ${this.data[index].inviteUserUuid}<br>
                    		注册时间：${this.data[index].registerTime}<br>
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
								this.data[index].certificationType = '已下线';
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
			},
           	/*获取列表*/
           	loadList (page) {
           		this.loadingState = true;
           		this.$axios.get('user/lists?page='+page+'&pageSize=10')
				.then((response) => {
					if (response.data.isSuccessful) {
						this.data = response.data.data.rows;
						this.total = response.data.data.total;
						this.handleData();
						this.loadingState = false;
					}
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
						this.loadingState = false;
					}
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