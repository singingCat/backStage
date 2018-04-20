<template>
	<div>
		<Form :model="formItem" :label-width="100">
			<FormItem label="数币基本描述:">
	            <Input v-model="formItem.describtion" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入数币的基本描述"></Input>
	        </FormItem>
	        <FormItem label="公募时间:">
                <DatePicker type="date" placeholder="公募开始时间" v-model="formItem.publicOfferingStart"></DatePicker>
				<span> - </span>
           		<DatePicker type="date" placeholder="公募结束时间" v-model="formItem.publicOfferingEnd"></DatePicker>
	        </FormItem>
	        <FormItem label="上线交易所时间:">
	            <DatePicker type="date" placeholder="上线交易所时间" v-model="formItem.tradeTime"></DatePicker>
	        </FormItem>
	        <FormItem label="所在国家:">
	            <Input v-model="formItem.country" placeholder="请输入所在国家"></Input>
	        </FormItem>
	        <FormItem label="官方网站:">
	            <Input v-model="formItem.website" placeholder="请输入官方网站"></Input>
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
	        <FormItem label="logo:">
	        	<div class="demo-upload-list" v-for="item in uploadList">
			        <template v-if="item.status === 'finished'">
			            <img :src="item.url">
			            <div class="demo-upload-list-cover">
			                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
			                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
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
					describtion: '',			//数币基本描述
					imageUrl: '',				//logo
					publicOfferingStart: '',	//公募开始时间
					publicOfferingEnd: '',		//公募结束时间
					tradeTime: '',				//上线交易所时间
					country: '',				//所在国家
					website: '',				//官方网站
					whitePapper: '',			//白皮书
					blockStation: '',			//区块站
					telegraphGroup: '',			//电报群
					telegraphNumber: '',		//电报人数
					twitterAddress: '',			//twitter地址
					twitterFans: '',			//twitter粉丝数
					WeChatPublicNumber: '',		//微信公众号
					WeChatSmallProgram: ''		//微信小程序
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