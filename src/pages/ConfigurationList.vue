<template>
	<!--<div>
		<InvitationCode :configList="configList"></InvitationCode>
		<Registration :configList="configList" style="margin-top: 20px;"></Registration>
	</div>-->
	<ConfigurationListTable></ConfigurationListTable>
</template>

<script>
	import ConfigurationListTable from '../components/ConfigurationListTable'
	/*import InvitationCode from '../components/InvitationCode'
	import Registration from '../components/Registration'*/
	
	/*export default {
		data () {
			return {
				configList: []
			}
		},
		components: {
			InvitationCode,
			Registration
		},
		methods: {
			initData () {
				this.$axios.get('user/insight/info')
				.then((response) => {
					if (response.data.isSuccessful) {
						let arr = [];
						arr.push(response.data.data);
						this.configList = arr;
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        	})
			}
		},
		mounted () {
			this.initData();
		}
	}*/
	export default {
		components: {
			ConfigurationListTable
		}
	}
</script>

<style>
</style>