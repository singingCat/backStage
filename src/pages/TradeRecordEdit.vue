<template>
	<div>
		<Form :model="formItem" :label-width="100">
			<FormItem label="交易类型:">
	            <Select v-model="formItem.tradeType">
					<Option value="test1">提币</Option>
					<Option value="test2">充值</Option>
					<Option value="test3">奖励</Option>
				</Select>
	        </FormItem>
	        <FormItem>
	            <Button type="primary" @click="">确定</Button>
	            <Button type="ghost" @click="" style="margin-left: 8px">重置</Button>
	        </FormItem>
		</Form>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				formItem: {
					tradeType: ''
				}
			}
		}
	}
</script>

<style>
</style>