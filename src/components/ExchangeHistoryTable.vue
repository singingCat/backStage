<template>
	<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
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
	                    title: '数币名称',
	                    key: 'name'
	                },
	                {
	                    title: '交易单位',
	                    key: 'company'
	                },
	                {
	                	title: '兑换Inb数量',
	                    key: 'inbNumber'
	                },
	                {
	                	title: '发布日期',
	                    key: 'date'
	                }
                ],
                data: [
	                {
	                	name: 'btc',
	                	company: 'qwe',
	                	inbNumber: 200,
	                	date: '2018-01-01'
	                }
                ],
                loadingState: false,	//表格读取状态
			}
		}
	}
</script>

<style>
</style>