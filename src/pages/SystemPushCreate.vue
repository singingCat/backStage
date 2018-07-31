<template>
	<div>
		<Form :model="formItem" :label-width="100">
	        <FormItem label="标题:">
	            <Input v-model="formItem.title" placeholder="请输入标题"></Input>
	        </FormItem>
	        <FormItem label="消息详情:">
	            <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入消息详情"></Input>
	        </FormItem>
	        <!--<FormItem label="发送至:">
	            <RadioGroup v-model="formItem.sendTo">
			        <Radio label="1">所有用户</Radio>
			        <Radio label="2">选定用户</Radio>
			    </RadioGroup>
	        </FormItem>-->
	        <FormItem label="选定用户uuid:">
	            <Input v-model="formItem.userUuid" placeholder="请输入用户uuid(可多个,以逗号分开)"></Input>
	        </FormItem>
	        <FormItem label="url地址:">
	            <Input v-model="formItem.url" placeholder="请输入url地址"></Input>
	        </FormItem>
	        <FormItem label="问卷id:">
	            <Input v-model="formItem.questionnaireId" placeholder="请输入问卷id"></Input>
	        </FormItem>
	        <FormItem label="报告id:">
	            <Input v-model="formItem.reportId" placeholder="请输入报告id"></Input>
	        </FormItem>
	        <FormItem label="调研id:">
	            <Input v-model="formItem.taskId" placeholder="请输入调研id"></Input>
	        </FormItem>
	        <!--<FormItem label="发送时间:">
	            <RadioGroup v-model="formItem.sendTime">
			        <Radio label="1">立即发送</Radio>
			        <Radio label="2">定时发送</Radio>
			    </RadioGroup>
	        </FormItem>-->
	        <!--<FormItem label="设置发送时间:" v-if="formItem.sendTime == 2">
	            <DatePicker type="date" placeholder="定时发送时间" v-model="formItem.timing"></DatePicker>
	        </FormItem>-->
	        <!--<FormItem label="是否推送:">
	            <RadioGroup v-model="formItem.whetherToPush">
			        <Radio label="1">是</Radio>
			        <Radio label="2">否</Radio>
			    </RadioGroup>
	        </FormItem>-->
	        <FormItem>
	            <Button type="primary" @click="confirm">确定</Button>
	            <Button type="warning" @click="test" style="margin-left: 8px">测试</Button>
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
					title: '',
					content: '',
					userUuid: '',
					url: '',
					questionnaireId: '',
					reportId: '',
					taskId: ''
				}
			}
		},
		methods: {
			confirm () {
				this.formItem['type'] = 2;
           		this.$axios.post('user/message/add/system', qs.stringify(this.formItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
						this.$router.push({ path: 'systemPush' });
					} else {
						this.$Notice.error({ title: response.data.message });
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        	})
			},
			test () {
				this.formItem['type'] = 1;
           		this.$axios.post('user/message/add/system', qs.stringify(this.formItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
					} else {
						this.$Notice.error({ title: response.data.message });
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        	})
			}
		}
	}
</script>

<style>
	
</style>