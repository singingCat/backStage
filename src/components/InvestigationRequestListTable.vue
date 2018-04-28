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
                        title: 'uuid',
                        key: 'uuid'
                    },
                    {
                        title: '请求企业',
                        key: 'company'
                    },
                    {
                        title: '请求标题',
                        key: 'requestTitle'
                    },
                    {
                        title: '要求详情',
                        key: 'particulars'
                    },
                    {
                        title: '调研奖励',
                        key: 'reward'
                    },
                    {
                        title: '请求时间',
                        key: 'requestTime',
                        sortable: true
                    },
                    {
                    	title: '操作',
                    	width: 240,
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
                                }, '请求详情'),
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
                                            this.toReceiptList(params.index)
                                        }
                                    }
                                }, '接单详情'),
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
                    	company: 'com1',
                    	requestTitle: 'title1',
                    	particulars: '少了点街坊邻居老大手贱佛坚朗五金额分离焦虑电视剧了开房记录看',
                        reward: '10',
                        requestTime: '2018-01-01'
                    },
                    {
                    	uuid: '222',
                    	company: 'com2',
                    	requestTitle: 'title2',
                    	particulars: '少了点街坊邻居老大手贱佛坚朗五金额分离焦虑电视剧了开房记录看',
                        reward: '20',
                        requestTime: '2018-01-02'
                    },
                    {
                    	uuid: '333',
                    	company: 'com3',
                    	requestTitle: 'title3',
                    	particulars: '少了点街坊邻居老大手贱佛坚朗五金额分离焦虑电视剧了开房记录看',
                        reward: '30',
                        requestTime: '2018-01-03'
                    },
                    {
                    	uuid: '444',
                    	company: 'com4',
                    	requestTitle: 'title4',
                    	particulars: '少了点街坊邻居老大手贱佛坚朗五金额分离焦虑电视剧了开房记录看',
                        reward: '40',
                        requestTime: '2018-01-04'
                    }
                ]
			}
		},
		methods: {
			/*查看*/
			show (index) {
                this.$Modal.success({
                    title: `${this.data[index].requestTitle}的主要信息`,
                    content: `调研请求奖励INB数量：123<br>调研请求需求分析师等级：123<br>调研请求需求分析师星级：123<br>所需要语言: 123<br>是否公开: 123<br>请求调研份数需求: 123<br>请求调研开始时间: 123<br>请求调研结束时间: 123<br>调研状态: 123<br>免费查看份数: 123<br>免费查看剩余份数: 123<br>付费查看金额: 123`
                })
            },
            /*查看接单详情*/
           	toReceiptList (index) {
           		this.$router.push({ path: 'orderTakingList/' + this.data[index].uuid })
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