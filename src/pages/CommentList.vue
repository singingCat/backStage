<template>
	<div>
		<CommentActionBar></CommentActionBar>
		<CommentListTable></CommentListTable>
	</div>
</template>

<script>
	import CommentActionBar from '../components/CommentActionBar'
	import CommentListTable from '../components/CommentListTable'
	
	export default {
		data () {
			return {
				
			}
		},
		components: {
			CommentActionBar,
			CommentListTable
		}
	}
</script>

<style>
</style>