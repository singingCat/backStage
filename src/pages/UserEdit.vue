<template>
	<div>
		<Form :model="formItem" :label-width="100">
	        <FormItem label="用户姓名:">
	            <Input v-model="formItem.name" placeholder="请输入用户姓名"></Input>
	        </FormItem>
	        <FormItem label="用户头像:">
	        	<div class="demo-upload-list" v-for="item in uploadList">
			        <template v-if="item.status === 'finished'">
			            <img :src="item.url">
			            <div class="demo-upload-list-cover">
			                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
			            </div>
			        </template>
			        <template v-else>
			            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
			        </template>
			    </div>
	            <Upload
			        ref="upload"
			        :show-upload-list="false"
			        :default-file-list="defaultList"
			        :on-success="handleSuccess"
			        :format="['jpg','jpeg','png']"
			        :max-size="2048"
			        :on-format-error="handleFormatError"
			        :on-exceeded-size="handleMaxSize"
			        :before-upload="handleBeforeUpload"
			        multiple
			        type="drag"
			        action="//jsonplaceholder.typicode.com/posts/"
			        style="display: inline-block;width:58px;">
			        <div style="width: 58px;height:58px;line-height: 58px;">
			            <Icon type="camera" size="20"></Icon>
			        </div>
			    </Upload>
			    <Modal title="View Image" v-model="visible">
			        <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
			    </Modal>
	        </FormItem>
	        <FormItem label="性别:">
	            <RadioGroup v-model="formItem.sex">
	                <Radio label="男">男</Radio>
	                <Radio label="女">女</Radio>
	            </RadioGroup>
	        </FormItem>
	        <FormItem label="用户简介:">
	            <Input v-model="formItem.userSummary" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入用户简介"></Input>
	        </FormItem>
	        <FormItem label="手机号:">
	            <Input v-model="formItem.phoneNumber" placeholder="请输入手机号"></Input>
	        </FormItem>
	        <FormItem label="邮箱:">
	            <Input v-model="formItem.email" placeholder="请输入邮箱"></Input>
	        </FormItem>
	        <FormItem label="生日:">
	            <DatePicker type="date" placeholder="请输入生日" v-model="formItem.birthday"></DatePicker>
	        </FormItem>
	        <FormItem label="INB数量:">
	            <Input v-model="formItem.inbNumber" placeholder="请输入INB数量"></Input>
	        </FormItem>
	        <FormItem label="钱包地址:">
	            <Input v-model="formItem.purseAddress" placeholder="请输入钱包地址"></Input>
	        </FormItem>
	        <FormItem label="注册时间:">
	            <DatePicker type="date" placeholder="请输入注册时间" v-model="formItem.signUpTime"></DatePicker>
	        </FormItem>
	        <FormItem label="国家:">
	            <Input v-model="formItem.country" placeholder="请输入国家"></Input>
	        </FormItem>
	        <FormItem label="来源:">
	            <Select v-model="formItem.origin">
					<Option value="test1">手机号</Option>
					<Option value="test2">邮箱</Option>
					<Option value="test3">微博</Option>
					<Option value="test3">微信</Option>
				</Select>
	        </FormItem>
	        <FormItem label="认证种类:">
	            <Select v-model="formItem.authType">
					<Option value="test1">无</Option>
					<Option value="test2">企业认证</Option>
					<Option value="test3">分析师认证</Option>
				</Select>
	        </FormItem>
	        <FormItem label="限制行为:">
	            <Select v-model="formItem.limitBehavior">
					<Option value="test1">无</Option>
					<Option value="test2">拉黑</Option>
					<Option value="test3">不许评论</Option>
				</Select>
	        </FormItem>
	        
		</Form>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				formItem: {
					name: '',			//姓名
					avatar: '',			//头像
					sex: '',			//性别
					userSummary: '',	//用户简介
					phoneNumber: '',	//手机号
					email: '',			//邮箱
					birthday: '',		//生日
					inbNumber: '',		//INB数量
					purseAddress: '',	//钱包地址
					signUpTime: '',		//注册时间
					country: '',		//国家
					origin: '',			//来源
					authType: '',		//认证种类
					limitBehavior: ''	//限制行为
				},
				defaultList: [{
					'name': 'a42bdcc1178e62b4694c830f028db5c0',
                    'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
				}],
				imgName: '',
	            visible: false,
				uploadList: []
			}
		},
		methods: {
			handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 2;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
            }
		},
		mounted () {
            this.uploadList = this.$refs.upload.fileList;
        }
	}
</script>

<style scoped>
	.demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>