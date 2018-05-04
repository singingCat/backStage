<template>
	<div>
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
                        title: 'uuid',
                        key: 'uuid'
                    },
                    {
                        title: '用户名',
                        key: 'name'
                    },
                    {
                        title: 'inb数量',
                        key: 'INBAmount'
                    },
                    {
                        title: 'eth交易单号',
                        key: 'ETHNumber'
                    },
                    {
                        title: '钱包地址',
                        key: 'purseAddress'
                    },
                    {
                    	title: '操作',
                    	key: 'action',
                    	width: 150,
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
                                            this.toTradeRecordList(params.index);
                                        }
                                    }
                                }, '交易记录')
                            ]);
                    	}
                    }
                ],
                data: [
                    {
                    	uuid: '111',
                        name: 'name1',
                        INBAmount: '111',
                        ETHNumber: '123123123',
                        purseAddress: '老大手贱弗兰克的家乐福'
                    },
                    {
                    	uuid: '222',
                        name: 'name2',
                        INBAmount: '111',
                        ETHNumber: '123123123',
                        purseAddress: '老大手贱弗兰克的家乐福'
                    },
                    {
                    	uuid: '333',
                        name: 'name3',
                        INBAmount: '111',
                        ETHNumber: '123123123',
                        purseAddress: '老大手贱弗兰克的家乐福'
                    },
                    {
                    	uuid: '444',
                        name: 'name4',
                        INBAmount: '111',
                        ETHNumber: '123123123',
                        purseAddress: '老大手贱弗兰克的家乐福'
                    }
                ]
			}
		},
		methods: {
			toTradeRecordList (index) {
				this.$router.push({ path: 'tradeRecordList/' + this.data[index].uuid })
			}
		}
	}
</script>

<style>
</style>