<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			 <Button type="primary" @click="add">新增</Button>
		</ButtonGroup>
		<Table border :columns="columns" :data="data"></Table>
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
                        title: '数币',
                        key: 'name'
                    },
                    {
                        title: '价格',
                        key: 'price'
                    },
                    {
                        title: '类型',
                        key: 'type'
                    },
                    {
                    	title: '操作',
                    	key: 'action',
                    	width: 300,
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
                                }, '主要信息'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            
                                        }
                                    }
                                }, '基本信息'),
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
                        name: 'BTC',
                        price: 18,
                        type: '币市'
                    },
                    {
                        name: 'ETH',
                        price: 24,
                        type: '公募'
                    },
                    {
                        name: 'BTC',
                        price: 30,
                        type: '空投'
                    },
                    {
                        name: 'ETH',
                        price: 26,
                        type: '空投'
                    }
                ]
			}
		},
		methods: {
			add () {
				this.$router.push({ name: 'coinAdd' })
			},
			show (index) {
                this.$Modal.info({
                    title: 'User Info',
                    content: `Name：${this.data[index].name}<br>Age：${this.data[index].age}<br>Address：${this.data[index].address}`
                })
            },
            remove (index) {
                this.data.splice(index, 1);
            }
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
</style>