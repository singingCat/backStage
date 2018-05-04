<template>
	<div>
		<TradeRecordActionBar></TradeRecordActionBar>
		<TradeRecordListTable></TradeRecordListTable>
	</div>
</template>

<script>
	import TradeRecordActionBar from '../components/TradeRecordActionBar'
	import TradeRecordListTable from '../components/TradeRecordListTable'
	
	export default {
		data () {
			return {
				
			}
		},
		components: {
			TradeRecordActionBar,
			TradeRecordListTable
		}
	}
</script>

<style>
</style>