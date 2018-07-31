<template>
	<div>
		<Form :model="formItem" :label-width="100">
	        <FormItem label="快讯标题:">
	            <Input v-model="formItem.title" placeholder="请输入快讯标题"></Input>
	        </FormItem>
	        <FormItem label="等级:">
	            <Select v-model="formItem.level">
					<Option value="1">一级</Option>
					<Option value="2">二级</Option>
					<Option value="3">三级</Option>
					<Option value="4">四级</Option>
					<Option value="5">五级</Option>
				</Select>
	        </FormItem>
	        <FormItem label="显示时间:">
	            <DatePicker type="date" placeholder="请输入显示时间" v-model="formItem.time"></DatePicker>
	        </FormItem>
	        <FormItem label="创建人uuid:">
	            <Input v-model="formItem.uuid" placeholder="请输入创建人uuid"></Input>
	        </FormItem>
	        <FormItem label="内容:">
	        	<froala :config="config" v-model="formItem.content"></froala>
	        </FormItem>
	        <FormItem>
	            <Button type="primary" @click="confirm">确定</Button>
	        </FormItem>
		</Form>
	</div>
</template>

<script>
	import VueFroala from 'vue-froala-wysiwyg';
	import qs from 'qs';
	
	export default {
		data () {
			return {
				formItem: {
					title: '',
					level: '',
					time: '',
					uuid: '',
					content: ''
				},
				config: {
				  placeholderText: "这里输入快讯内容",
				  imageUploadURL: 'news/editor/image',
				  events : {
				  	'froalaEditor.initialized': (e, editor) => {
				      
				    },
				    'froalaEditor.html.get' : function(e, editor, html) {
				      
				    }
				  }
				}
			}
		},
		methods: {
			confirm () {
				let route = this.$route.name;
				if (route == 'newsletterAdd') {
					this.save();
				} else if (route == 'newsletterEdit') {
					this.update();
				}
			},
			save () {
				this.formItem.time = this.formItem.time.getTime();
				
           		this.$axios.post('news/flash/add', qs.stringify(this.formItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
						this.$router.push({ path: 'newsletterList' });
					} else {
						this.$Notice.error({ title: response.data.message });
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        	})
			},
			update () {
				this.formItem.time = this.formItem.time.getTime();
				this.formItem.uid = this.$route.params.uid;
				
           		this.$axios.post('news/flash/update', qs.stringify(this.formItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
						this.$router.push({ path: '../newsletterList' });
					} else {
						this.$Notice.error({ title: response.data.message });
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        	})
			},
			/*时间格式化*/
			formatDate (timestamp) {
				let date = new Date(timestamp);
		        let Y = date.getFullYear() + '-';
		        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
		        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		        return Y+M+D+h+m+s;
			}
		},
		mounted () {
            let row = this.$route.query.row;
            let route = this.$route.name;
			if (route == 'newsletterEdit') {
				this.formItem.title = row.title;
				this.formItem.level = row.level + '';
				this.formItem.time = this.formatDate(row.time);
				this.formItem.uuid = row.user.uuid;
				this.formItem.content = row.content;
			}
        }
	}
</script>

<style>
	
</style>