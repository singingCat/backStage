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
                        title: 'uuid',
                        key: 'uuid'
                    },
                    {
                        title: '用户名',
                        key: 'name'
                    },
                    {
                        title: '交易类型',
                        key: 'tradeType'
                    },
                    {
                        title: '交易金额',
                        key: 'tradeAmount'
                    },
                    {
                        title: '交易号',
                        key: 'tradeNumber'
                    },
                    {
                        title: '交易时间',
                        key: 'tradeTime'
                    },
                    {
                        title: '经办人',
                        key: 'agent'
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
                                }, '查看')
                            ]);
                    	}
                    }
                ],
                data: [
                    {
                    	uuid: '111',
                    	name: 'nam1',
                        tradeType: '提币',
                        tradeAmount: '$10.2',
                        tradeNumber: '123123123',
                        tradeTime: '2018-01-01',
                        agent: '拉克丝'
                    },
                    {
                    	uuid: '222',
                    	name: 'nam2',
                        tradeType: '充值',
                        tradeAmount: '$10.2',
                        tradeNumber: '123123123',
                        tradeTime: '2018-01-02',
                        agent: '拉克丝'
                    },
                    {
                    	uuid: '333',
                    	name: 'nam3',
                        tradeType: '奖励',
                        tradeAmount: '$10.2',
                        tradeNumber: '123123123',
                        tradeTime: '2018-01-03',
                        agent: '拉克丝'
                    },
                    {
                    	uuid: '444',
                    	name: 'nam4',
                        tradeType: '提币',
                        tradeAmount: '$10.2',
                        tradeNumber: '123123123',
                        tradeTime: '2018-01-04',
                        agent: '拉克丝'
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
           	changePage () {
           		
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