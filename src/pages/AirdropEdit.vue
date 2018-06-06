<template>
	<div>
		<Form :model="formItem" :label-width="100">
	        <FormItem label="数币名称:">
	            <Input v-model="formItem.coinName" placeholder="请输入数币名称"></Input>
	        </FormItem>
	        <FormItem label="奖励数量:">
	            <Input v-model="formItem.reward" placeholder="请输入奖励数量"></Input>
	        </FormItem>
	        <FormItem label="奖励类型:">
	            <Select v-model="formItem.getType">
					<Option value="1">新用户</Option>
					<Option value="2">社区</Option>
					<Option value="3">发款</Option>
					<Option value="4">KYC</Option>
					<Option value="5">其它</Option>
				</Select>
	        </FormItem>
	        <FormItem label="开始时间:">
	            <DatePicker type="date" placeholder="开始时间" v-model="formItem.validFromTime"></DatePicker>
	        </FormItem>
	        <FormItem label="结束时间:">
	            <DatePicker type="date" placeholder="结束时间" v-model="formItem.validToTime"></DatePicker>
	        </FormItem>
	        <FormItem label="空投描述:">
	            <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入空投描述"></Input>
	        </FormItem>
	        <FormItem label="空投入口:">
	            <Input v-model="formItem.entrance" placeholder="请输入空投入口"></Input>
	        </FormItem>
	        <FormItem>
	            <Button type="primary" @click="confirm">确定</Button>
	            <!--<Button type="ghost" @click="" style="margin-left: 8px">重置</Button>-->
	        </FormItem>
		</Form>
	</div>
</template>

<script>
	import qs from 'qs'
	
	export default {
		data () {
			return {
				formItem: {
					coinName: '',		//数币名称
					reward: '',			//奖励数量
					getType: '1',		//奖励类型
					validFromTime: '',	//开始时间
					validToTime: '',	//结束时间
				}
			}
		},
		methods: {
			confirm () {
            	this.formItem['adminUuid'] = localStorage.adminUuid;
            	this.formItem.validFromTime = new Date(this.formItem.validFromTime).getTime();
            	this.formItem.validToTime = new Date(this.formItem.validToTime).getTime();
            	
            	this.$axios.post('user/add/airdrop', qs.stringify(this.formItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
						this.$router.push({ path: 'airdropList' });
					} else {
						this.$Notice.error({ title: response.data.message });
					}
	        	})
	        	.catch((error) => {
	        		this.$router.push({ path: '/500' });
	        	})
			}
		}
	}
</script>

<style scoped>
	
</style>