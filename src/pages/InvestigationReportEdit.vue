<template>
	<div>
		<Form :model="formItem" :label-width="100">
			<FormItem label="报告名称:">
	            <Input v-model="formItem.reportName" placeholder="请输入报告名称"></Input>
	       	</FormItem>
	        <FormItem label="提交人:">
	            <Input v-model="formItem.submitter" placeholder="请输入提交人"></Input>
	        </FormItem>
	        <FormItem label="提交人身份:">
	            <Select v-model="formItem.userType">
	            	<Option value="1">分析师</Option>
	            	<Option value="2">管理员</Option>
	            </Select>
	        </FormItem>
	        <FormItem label="白皮书:">
	            <Input v-model="formItem.whitePapper" placeholder="请输入白皮书"></Input>
	        </FormItem>
	        <FormItem label="区块站:">
	            <Input v-model="formItem.blockStation" placeholder="请输入区块站"></Input>
	        </FormItem>
	        <FormItem label="电报群:">
	            <Input v-model="formItem.telegraphGroup" placeholder="请输入电报群"></Input>
	        </FormItem>
	        <FormItem label="电报人数:">
	            <Input v-model="formItem.telegraphNumber" placeholder="请输入电报人数"></Input>
	        </FormItem>
	        <FormItem label="twitter地址:">
	            <Input v-model="formItem.twitterAddress" placeholder="请输入twitter地址"></Input>
	        </FormItem>
	        <FormItem label="twitter粉丝数:">
	            <Input v-model="formItem.twitterFans" placeholder="请输入twitter粉丝数"></Input>
	        </FormItem>
	        <FormItem label="微信公众号:">
	            <Input v-model="formItem.WeChatPublicNumber" placeholder="请输入微信公众号"></Input>
	        </FormItem>
	        <FormItem label="微信小程序:">
	            <Input v-model="formItem.WeChatSmallProgram" placeholder="请输入微信小程序"></Input>
	        </FormItem>
	        <FormItem label="上线交易所时间:">
	            <DatePicker type="date" placeholder="上线交易所时间" v-model="formItem.tradeTime"></DatePicker>
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
					reportName: '',		//报告名称
					submitter: '',		//提交人
				},
				defaultList: [
	                {
	                    'name': 'a42bdcc1178e62b4694c830f028db5c0',
	                    'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
	                }
	            ],
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
        	/*console.log(this.$route.params.id);*/
            this.uploadList = this.$refs.upload.fileList;
        }
	}
</script>

<style>
</style>