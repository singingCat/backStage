<template>
	<ButtonGroup size="small" class="btn-group">
		<Button type="primary" @click="add">新增</Button>
	</ButtonGroup>
</template>

<script>
	export default {
		data () {
			return {
				
			}
		},
		methods: {
			add () {
				this.$Message.info('新增')
			}
		}
	}
</script>

<style scoped>
	.btn-group {
		margin-bottom: 10px;
		width: 100%;
	}
	.btn-group button.ivu-btn {
		float: right;
	}
</style>