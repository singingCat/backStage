<template>
	<div>
		<Form :model="formItem" :label-width="100">
			<FormItem label="报告名称:">
	            <Input v-model="formItem.name" placeholder="请输入报告名称"></Input>
	       	</FormItem>
	        <FormItem label="报告描述:">
	            <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入报告描述"></Input>
	        </FormItem>
	        <FormItem label="评级:">
	            <Select v-model="formItem.rating">
					<Option value="1">一星</Option>
					<Option value="2">二星</Option>
					<Option value="3">三星</Option>
					<Option value="4">四星</Option>
					<Option value="5">五星</Option>
				</Select>
	        </FormItem>
	        <FormItem label="报告价格:">
	            <Input v-model="formItem.price" placeholder="请输入报告价格"></Input>
	        </FormItem>
	        <FormItem label="所在调研Id:">
	            <Input v-model="formItem.taskId" placeholder="请输入所在调研Id"></Input>
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
					name: '',
					content: '',
					rating: '1',
					price: '',
					taskId: ''
				}
			}
		},
		methods: {
            confirm () {
            	this.formItem['onlineTime'] = new Date().getTime();
            	this.formItem['adminUuid'] = localStorage.adminUuid;
            	
            	this.$axios.post('user/add/report', qs.stringify(this.formItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
						this.$router.push({ path: 'reportList' });
					} else {
						console.log(response)
						this.$Notice.error({ title: '请检查调研Id是否正确' });
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.$router.push({ path: '/500' });
	        	})
            }
        },
        mounted () {
        	
        }
	}
</script>

<style>
</style>