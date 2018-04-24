<template>
	<Table border :columns="columns" :data="data"></Table>
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
                    	width: 500,
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
                                            this.showBase(params.index)
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
                                }, '空投信息'),
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
                                            this.toCommentList();
                                        }
                                    }
                                }, '评论列表'),
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
                                }, '团队列表'),
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
                    	id: 'id1',
                        name: 'BTC',
                        price: 18,
                        type: '币市'
                    },
                    {
                    	id: 'id2',
                        name: 'ETH',
                        price: 24,
                        type: '公募'
                    },
                    {
                    	id: 'id3',
                        name: 'BTC',
                        price: 30,
                        type: '空投'
                    },
                    {
                    	id: 'id4',
                        name: 'ETH',
                        price: 26,
                        type: '空投'
                    }
                ]
			}
		},
		methods: {
			/*主要信息*/
			show (index) {
                this.$Modal.success({
                    title: `${this.data[index].name}的主要信息`,
                    content: `数币：${this.data[index].name}<br>价格：${this.data[index].price}<br>类型：${this.data[index].type}`
                })
            },
            /*基本信息*/
           	showBase (index) {
                this.$Modal.warning({
                    title: `${this.data[index].name}的基本信息`,
                    content: `数币：${this.data[index].name}<br>价格：${this.data[index].price}<br>类型：${this.data[index].type}`
                })
            },
            /*评论列表*/
           	toCommentList () {
           		this.$router.push({ name: 'commentList' })
           	},
            /*编辑*/
            edit (index) {
            	this.$router.push({ path: 'coinEdit/' + this.data[index].id })
            },
            /*删除*/
            remove (index) {
            	this.$Modal.confirm({
                    content: '<p>确认删除吗?</p>',
                    onOk: () => {
                    	this.data.splice(index, 1);
                    }
                });
            }
		}
	}
</script>

<style>
</style>