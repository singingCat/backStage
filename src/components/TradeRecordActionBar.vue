<template>
	<ButtonGroup size="small" class="btn-group">
		<Input class="searchBox" size="small" v-model="searchContent" placeholder="要搜索的用户uuid">
			<Button slot="append" icon="search" @click="search"></Button>
		</Input>
	</ButtonGroup>
</template>

<script>
	export default {
		data () {
			return {
				searchContent: ''
			}
		},
		methods: {
			search () {
				this.$Message.info('执行搜索功能');
			}
		}
	}
</script>

<style scoped>
	.btn-group {
		margin-bottom: 10px;
		width: 100%;
	}
	.searchBox {
		float: right;
		width: 200px;
	}
</style>