<template>
	<div>
		<UserActionBar></UserActionBar>
		<UserListTable></UserListTable>
	</div>
</template>

<script>
	import UserActionBar from '../components/UserActionBar'
	import UserListTable from '../components/UserListTable'
	
	export default {
		data () {
			return {
				
			}
		},
		components: {
			UserActionBar,
			UserListTable
		}
	}
</script>

<style>
</style>