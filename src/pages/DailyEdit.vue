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
	            <DatePicker type="datetime" placeholder="请输入显示时间" v-model="newsItem.time"></DatePicker>
	        </FormItem>
	        <FormItem label="内容简介:">
	        	<Input v-model="newsItem.description"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入快讯内容"></Input>
	        </FormItem>
	        <FormItem label="赞数量:">
	            <Input v-model="newsItem.likeNumber" placeholder="请输入赞数量(选填)"></Input>
	        </FormItem>
	        <FormItem label="踩数量:">
	            <Input v-model="newsItem.unlikeNumber" placeholder="请输入踩数量(选填)"></Input>
	        </FormItem>
	        <FormItem label="阅读量:">
	            <Input v-model="newsItem.readNumber" placeholder="请输入阅读量(选填)"></Input>
	        </FormItem>
	        <FormItem>
	            <Button type="primary" @click="newsUpdateConfirm">确定修改</Button>
	        </FormItem>
		</Form>
		<Divider>内容+分享信息</Divider>
		<Form :model="pageItem" :label-width="100">
			<FormItem label="微信分享标题:">
	            <Input v-model="pageItem.shareTitle" placeholder="请输入分享标题"></Input>
	        </FormItem>
	        <FormItem label="微信分享描述:">
	            <Input v-model="pageItem.shareDescription"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入分享描述"></Input>
	        </FormItem>
	        <FormItem label="微博分享标题:">
	            <Input v-model="pageItem.weiboContent" placeholder="请输入分享标题"></Input>
	        </FormItem>
			<FormItem label="创建人uuid:">
	            <Input v-model="pageItem.uuid" placeholder="请输入创建人uuid"></Input>
	        </FormItem>
	        <FormItem label="内容:">
	        	<froala :config="config" v-model="pageItem.content"></froala>
	        </FormItem>
	        <FormItem>
	        	<Button type="primary" @click="pageAddConfirm">确定新增</Button>
	            <Button type="primary" @click="pageUpdateConfirm">确定修改</Button>
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
					uid: '',
					title: '',
					type: '',
					time: '',
					description: '',
					likeNumber: '',
					unlikeNumber: '',
					readNumber: ''
				},
				pageItem: {
					newsId: '',
					shareTitle: '',
					shareDescription: '',
					weiboContent: '',
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
				
           		this.$axios.post('news/update', qs.stringify(this.newsItem),
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
			},
			pageAddConfirm () {
           		this.$axios.post('news/page/add', qs.stringify(this.pageItem),
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
			},
			pageUpdateConfirm () {
				this.$axios.post('news/page/update', qs.stringify(this.pageItem),
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
			
			this.newsItem.uid = row.uid;
			this.newsItem.title = row.title;
			this.newsItem.type = row.type + '';
			this.newsItem.time = row.time;
			this.newsItem.description = row.description;
			this.newsItem.likeNumber = row.likeNumber;
			this.newsItem.unlikeNumber = row.unlikeNumber;
			this.newsItem.readNumber = row.readNumber;
			
			this.pageItem.newsId = row.uid;
			if (row.user) {
				this.pageItem.uuid = row.user.uuid;
			}
			if (row.page) {
				this.pageItem.shareTitle = row.page.share.wechatFriendTitle;
				this.pageItem.shareDescription = row.page.share.wechatFriendDescription;
				this.pageItem.weiboContent = row.page.share.weiboContent;
				this.pageItem.content = row.page.content;
			}
		}
	}
</script>
	
<style>
	
</style>