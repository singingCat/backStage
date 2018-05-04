<template>
	<div>
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
		<div class="page">
			<Page :total="100" :current="1" show-total @on-change="changePage"></Page>
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
                        key: 'uuid'
                    },
                    {
                        title: '用户名',
                        key: 'userName'
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
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                        	this.edit(params.index)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                    	}
                    }
                ],
                data: [
                    {
                    	uuid: '111',
                        userName: 'name1',
                        nickName: 'nick1',
                        createdTime: '2018-01-01',
                        certificationType: 1,
                        inbNumber: 100
                    },
                    {
                    	uuid: '222',
                        userName: 'name2',
                        nickName: 'nick2',
                        createdTime: '2018-01-01',
                        certificationType: 2,
                        inbNumber: 100
                    },
                    {
                    	uuid: '333',
                        userName: 'name3',
                        nickName: 'nick3',
                        createdTime: '2018-01-01',
                        certificationType: 3,
                        inbNumber: 100
                    },
                    {
                    	uuid: '444',
                        userName: 'name4',
                        nickName: 'nick4',
                        createdTime: '2018-01-01',
                        certificationType: 4,
                        inbNumber: 100
                    },
                    {
                    	uuid: '555',
                        userName: 'name5',
                        nickName: 'nick5',
                        createdTime: '2018-01-01',
                        certificationType: 5,
                        inbNumber: 100
                    }
                ],
                loadingState: false
			}
		},
		methods: {
			/*计算认证类型和激活状态*/
			calcType () {
				this.data.forEach((item, index) => {
					let type = item.certificationType;
					let verified = item.emailVerified;
					if (type) {
						switch(type)
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
							default: item.certificationType = '未知'
						}
					}
					if (verified) {
						switch(verified)
						{
							case 1:
								item.emailVerified = '未激活';
								break;
							case 2:
								item.emailVerified = '已激活';
								break;
							default: item.emailVerified = '未知';
						}
					}
				})
			},
			/*查看*/
			show (index) {
                this.$Modal.success({
                    title: `${this.data[index].userName}的其它信息`,
                    content: `真实姓名：${this.data[index].name}<br>
                    		密码：${this.data[index].password}<br>
                    		头像：${this.data[index].headImageUrl}<br>
                    		电话号码：${this.data[index].phoneNubmer}<br>
                    		邮箱：${this.data[index].email}<br>
                    		邮箱激活状态：${this.data[index].emailVerified}<br>
                    		邀请码：${this.data[index].invitationCode}<br>
                    		邀请人id：${this.data[index].invitedByUserId}<br>
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
            /*编辑*/
            edit (index) {
            	this.$router.push({ path: 'userEdit/' + this.data[index].id })
            },
            /*删除*/
            remove (index) {
                this.$Modal.confirm({
                    content: '<p>确认删除吗?</p>',
                    onOk: () => {
                    	this.data.splice(index, 1);
                    }
                });
            },
            /*分页*/
           	changePage (index) {
           		console.log(index);
           	},
           	/*充值*/
           	recharge (index) {
           		let inputVal = '';
           		this.$Modal.confirm({
                    render: (h) => {
                    	return h('div', [
                    		h('P', {
                    			style: {
                    				marginBottom: '10px'
                    			}
                    		}, '新增INB数量'),
                    		h('Input', {
                    			props: {
	                                value: this.data[index].name
	                            },
	                            on: {
	                                input: (val) => {
	                                    inputVal = val;
	                                }
	                            }
                    		}),
                    		h('P', {
                    			style: {
                    				marginBottom: '10px',
                    				marginTop: '10px'
                    			}
                    		}, 'ETH交易单号'),
                    		h('Input', {
                    			props: {
	                                
                            	}
                    		})
                    	])
                    },
                    onOk: () => {
                    	console.log(inputVal);
                    }
                });
           	}
		},
		mounted: function () {
			this.calcType();
		}
	}
</script>

<style scoped>
	.page {
		float: right;
		margin-top: 20px;
	}
</style>