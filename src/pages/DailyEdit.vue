<template>
	<div>
		<Divider>新闻信息</Divider>
		<Form :model="newsItem" :label-width="100">
	        <FormItem label="标题:">
	            <Input v-model="newsItem.title" placeholder="请输入快讯标题"></Input>
	        </FormItem>
	        <FormItem label="类型:">
	            <Select v-model="newsItem.type">
					<Option value="1">Insight日报</Option>
					<Option value="2">Insight研究院</Option>
					<Option value="3">其它</Option>
				</Select>
	        </FormItem>
	        <FormItem label="显示时间:">
	            <DatePicker type="date" placeholder="请输入显示时间" v-model="newsItem.time"></DatePicker>
	        </FormItem>
	        <FormItem label="内容简介:">
	        	<Input v-model="newsItem.description"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入快讯内容"></Input>
	        </FormItem>
	        <FormItem>
	            <Button type="primary" @click="newsUpdateConfirm">确定修改</Button>
	        </FormItem>
		</Form>
		<Form :model="shareItem" :label-width="100">
			<FormItem label="分享标题:">
	            <Input v-model="shareItem.shareTitle" placeholder="请输入分享标题"></Input>
	        </FormItem>
	        <FormItem label="分享描述:">
	            <Input v-model="shareItem.shareDescription" placeholder="请输入分享描述"></Input>
	        </FormItem>
		</Form>
		<Form :model="pageItem" :label-width="100">
			<FormItem label="创建人uuid:">
	            <Input v-model="pageItem.uuid" placeholder="请输入创建人uuid"></Input>
	        </FormItem>
	        <FormItem label="内容:">
	        	<froala :config="config" v-model="pageItem.content"></froala>
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
				newsItem: {
					title: '',
					type: '',
					time: '',
					description: ''
				},
				shareItem: {
					shareTitle: '',
					shareDescription: '',
				},
				pageItem: {
					uuid: '',
					content: ''
				},
				config: {
				  placeholderText: "Edit Me",
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
			newsUpdateConfirm () {
				this.newsItem.time = this.newsItem.time.getTime();
				
           		this.$axios.post('news/add', qs.stringify(this.newsItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
						this.$router.push({ path: 'dailyList' });
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
			console.log(this.$route.query.row);
			let row = this.$route.query.row;
			let route = this.$route.name;
			if (route == 'dailyEdit') {
				this.newsItem.title = row.title;
				this.newsItem.type = row.type + '';
				this.newsItem.time = this.formatDate(row.time);
				this.newsItem.uuid = row.user.uuid;
				this.newsItem.shareTitle = row.page.share.wechatFriendTitle;
				this.newsItem.shareDescription = row.page.share.wechatFriendDescription;
				this.newsItem.content = row.description;
			}
		}
	}
</script>
	
<style>
	
</style>