<template>
	<div>
		<Form :model="formItem" :label-width="100">
			<FormItem label="用户INB数量:">
	            <Input v-model="formItem.INBAmount" placeholder="请输入INB数量"></Input>
	        </FormItem>
	        <FormItem label="ETH交易单号:">
	            <Input v-model="formItem.ETHNumber" placeholder="请输入ETH交易单号"></Input>
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
					INBAmount: '',
					ETHNumber: ''
				}
			}
		}
	}
</script>

<style>
</style>