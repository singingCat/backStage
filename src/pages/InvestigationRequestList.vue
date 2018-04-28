<template>
	<div>
		<InvestigationRequestActionBar></InvestigationRequestActionBar>
		<InvestigationRequestListTable></InvestigationRequestListTable>
	</div>
</template>

<script>
	import InvestigationRequestActionBar from '../components/InvestigationRequestActionBar'
	import InvestigationRequestListTable from '../components/InvestigationRequestListTable'
	
	export default {
		data () {
			return {
				
			}
		},
		components: {
			InvestigationRequestActionBar,
			InvestigationRequestListTable
		}
	}
</script>

<style>
</style>