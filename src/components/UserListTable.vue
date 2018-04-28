<template>
	<div>
		<Table border :columns="columns" :data="data"></Table>
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
                        title: '用户名',
                        key: 'name'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime'
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
                    	id: '111',
                        name: 'name1',
                        createTime: '2018-01-01',
                        identity: '运营人员',
                        identityType: '无'
                    },
                    {
                    	id: '222',
                        name: 'name2',
                        createTime: '2018-01-01',
                        identity: '普通用户',
                        identityType: '分析师'
                    },
                    {
                    	id: '333',
                        name: 'name3',
                        createTime: '2018-01-01',
                        identity: '运营人员',
                        identityType: '企业用户'
                    },
                    {
                    	id: '444',
                        name: 'name4',
                        createTime: '2018-01-01',
                        identity: '普通用户',
                        identityType: '分析师'
                    }
                ]
			}
		},
		methods: {
			/*查看*/
			show (index) {
                this.$Modal.success({
                    title: `${this.data[index].name}的主要信息`,
                    content: `用户名：${this.data[index].name}<br>创建时间：${this.data[index].createTime}<br>身份：${this.data[index].identity}<br>身份类型：${this.data[index].identityType}`
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
		}
	}
</script>

<style scoped>
	.page {
		float: right;
		margin-top: 20px;
	}
</style>