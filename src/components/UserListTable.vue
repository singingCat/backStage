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
                    	title: '操作',
                    	key: 'action',
                    	width: 200,
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
                        name: 'name1',
                        createTime: '2018-01-01',
                        identity: '运营人员'
                    },
                    {
                    	id: 'id2',
                        name: 'name2',
                        createTime: '2018-01-01',
                        identity: '普通用户'
                    },
                    {
                    	id: 'id3',
                        name: 'name3',
                        createTime: '2018-01-01',
                        identity: '运营人员'
                    },
                    {
                    	id: 'id4',
                        name: 'name4',
                        createTime: '2018-01-01',
                        identity: '普通用户'
                    }
                ]
			}
		},
		methods: {
			/*查看*/
			show (index) {
                this.$Modal.success({
                    title: `${this.data[index].name}的主要信息`,
                    content: `用户名：${this.data[index].name}<br>创建时间：${this.data[index].createTime}<br>身份：${this.data[index].identity}`
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
            }
		}
	}
</script>

<style>
</style>