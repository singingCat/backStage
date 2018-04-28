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
                        title: '调研内容',
                        key: 'content'
                    },
                    {
                        title: '分析师',
                        key: 'analyst'
                    },
                    {
                        title: '接单时间',
                        key: 'orderTakingTime'
                    },
                    {
                        title: '状态',
                        key: 'status'
                    },
                    {
                        title: '企业反馈',
                        key: 'feedBack'
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
                        content: 'content1',
                        analyst: 'name1',
                        orderTakingTime: '2018-01-01',
                        status: '未完成',
                        feedBack: '未反馈'
                    },
                    {
                    	id: '222',
                        content: 'content2',
                        analyst: 'name2',
                        orderTakingTime: '2018-01-01',
                        status: '未完成',
                        feedBack: '未反馈'
                    },
                    {
                    	id: '333',
                        content: 'content3',
                        analyst: 'name3',
                        orderTakingTime: '2018-01-01',
                        status: '完成',
                        feedBack: '已反馈'
                    },
                    {
                    	id: '444',
                        content: 'content4',
                        analyst: 'name4',
                        orderTakingTime: '2018-01-01',
                        status: '完成',
                        feedBack: '已反馈'
                    }
                ]
			}
		},
		methods: {
			/*查看*/
			show (index) {
                this.$Modal.success({
                    title: `${this.data[index].content}的主要信息`,
                    content: `调研内容：${this.data[index].content}<br>分析师: ${this.data[index].analyst}<br>接单时间: ${this.data[index].orderTakingTime}<br>状态: ${this.data[index].status}<br>企业反馈: ${this.data[index].feedBack}`
                })
            },
            /*删除*/
            remove (index) {
                this.$Modal.confirm({
                    render: (h, params) => {
                    	return h('div', [
                    		h('P', {
                    			style: {
                    				marginBottom: '10px'
                    			}
                    		}, '请选择删除理由'),
                    		h('Select', {
                            props: {
                                value: '1'
                            },
                            style: {
                            	width: '150px'
                            },
                            on: {
                                'on-change': (event) => {
                                	console.log(event);
                                }
                            }
                        },
                     	[
					        h('Option',{  
					            props: {  
					                value: '1'  
					            }  
					        },'管理员删除'),  
					        h('Option',{  
					            props: {  
					                value: '2'  
					            }  
					        },'政治敏感'),
					        h('Option',{  
					            props: {  
					                value: '3'  
					            }  
					        },'垃圾营销'),
					        h('Option',{  
					            props: {  
					                value: '4'  
					            }  
					        },'信息污秽'),
					        h('Option',{  
					            props: {  
					                value: '5'  
					            }  
					        },'虚假信息')
					    ])
                    	])
                    },
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