<template>
	<div>
		<InvestigationReportActionBar></InvestigationReportActionBar>
		<InvestigationReportListTable></InvestigationReportListTable>
	</div>
</template>

<script>
	import InvestigationReportActionBar from '../components/InvestigationReportActionBar'
	import InvestigationReportListTable from '../components/InvestigationReportListTable'
	
	export default {
		data () {
			return {
				
			}
		},
		components: {
			InvestigationReportActionBar,
			InvestigationReportListTable
		}
	}
</script>

<style>
</style>