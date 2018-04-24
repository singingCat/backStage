<template>
	<div>
		<CoinActionBar></CoinActionBar>
		<CoinListTable></CoinListTable>
	</div>
</template>

<script>
	import CoinActionBar from '../components/CoinActionBar'
	import CoinListTable from '../components/CoinListTable'
	
	export default {
		data () {
			return {
				
			}
		},
		components: {
			CoinActionBar,
			CoinListTable
		}
	}
</script>

<style>
</style>