<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Select size="small" class="selectType" v-model="certificationStatus" @on-change="statusChange(certificationStatus)">
				<Option value="">全部</Option>
				<Option value="1">审核中</Option>
				<Option value="2">审核不通过</Option>
				<Option value="3">审核通过</Option>
			</Select>
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的uuid或昵称">
				<Select v-model="searchType" slot="prepend" style="width: 80px">
		            <Option value="uuid">uuid</Option>
		            <Option value="nickName">昵称</Option>
		        </Select>
				<Button slot="append" icon="md-search" @click="search"></Button>
			</Input>
		</ButtonGroup>
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
		<div class="page">
			<Page :total="total" :current="1" show-total @on-change="changePage"></Page>
		</div>
		<Modal
	        v-model="showAuthData"
	        title="认证资料">
	        <P>真实姓名: {{currentAuthData.name}}</P>
	        <P>性别: {{currentAuthData.gender}}</P>
	        <!--<P>生日: {{currentAuthData.birthday}}</P>-->
	        <P>国家: {{currentAuthData.countryName}}</P>
	        <P>手机号: {{currentAuthData.phoneNumber}}</P>
	        <!--<P>职业: {{currentAuthData.professionType}}</P>-->
	        <!--<P>收入: {{currentAuthData.incomeType}}</P>-->
	        <!--<P>学历: {{currentAuthData.educationType}}</P>-->
	        <!--<P>地域: {{currentAuthData.areaType}}</P>-->
	        <P>{{currentAuthData.type == 1 ? '身份证号' : '护照号'}}: {{currentAuthData.idNumber}}</P>
	        <P>图片: </P>
	        <div class="pictures" style="display: flex; text-align: center;">
	        	<div style="padding-right: 20px;">
	        		<img 
	        			:src="currentAuthData.urlFront"
	        			@click="checkImage(currentAuthData.urlFront)">
	        		<div>证件照正面</div>
	        	</div>
	        	<div style="padding-right: 20px;">
	        		<img 
	        			:src="currentAuthData.urlOpposite"
	        			@click="checkImage(currentAuthData.urlOpposite)">
	        		<div>证件照反面</div>
	        	</div>
	        	<div style="padding-right: 20px;">
	        		<img 
	        			src="https://i.loli.net/2017/08/21/599a521472424.jpg" 
	        			@click="checkVideo(currentAuthData.urlVideo)">
	        		<div>小视频</div>
	        	</div>
	        </div>
	        <p v-if="currentAuthData.status == 2">拒绝原因: {{currentAuthData.refuseType}}</p>
	        <p v-if="currentAuthData.status != 1">审核人: {{currentAuthData.adminUserName}}</p>
	    </Modal>
		<Modal
	        v-model="showRefuseType"
	        title="请选择拒绝原因"
	        @on-ok="refuseAuthentication">
	        <p>拒绝原因:</p>
	        <Select v-model="refuseType">
	        	<Option value="1">证件图片信息与所留证件信息不匹配</Option>
	        	<Option value="3">证件信息不清晰</Option>
	        	<Option value="9">视频画面模糊</Option>
	        	<Option value="10">视频中声音不清晰</Option>
	        	<Option value="11">视频材料不合要求，请仔细阅读拍摄要求</Option>
	        	<Option value="12">视频材料中所述日期与提交审核日期不符</Option>
	        	<Option value="13">很抱歉！由于个人认证流程升级，需要您将Insight更新到最新版本之后再次进行个人认证。</Option>
	        </Select>
	    </Modal>
	    <Modal
	        v-model="showImage"
	        title="查看图片"
	        fullscreen>
	        <img :src="currentImage">
	    </Modal>
	    <Modal
	        v-model="showVideo"
	        title="查看视频"
	        fullscreen>
	        <video :src="currentVideo" controls="controls"></video>
	    </Modal>
	</div>
</template>

<script>
	import qs from 'qs'
	
	export default {
		data () {
			return {
				columns: [
					{
                        title: 'uid',
                        key: 'uid'
                   },
                    {
                        title: '用户名',
                        render: (h, params) => {
                        	let nickName = '';
                        	if (params.row.user) {
                        		nickName = params.row.user.nickName;
                        	}
                        	return h('div', nickName);
                        }
                    },
                    {
                    	title: '真实姓名',
                    	key: 'name'
                    },
                    {
                    	title: 'inb数量',
                    	render: (h, params) => {
                    		let inbNumber = '';
                    		if (params.row.user) {
                    			inbNumber = params.row.user.inbNumber;
                    		}
                    		return h('div', inbNumber);
                    	}
                    },
                    {
                        title: '申请认证类别',
                        key: 'type',
                        render: (h, params) => {
                        	let type = params.row.type;
                        	switch (type) {
                        		case 1: type = '身份证'; break;
                        		case 2: type = '护照'; break;
                        		default: break;
                        	}
                        	return h('div', type);
                        }
                    },
                    {
                        title: '申请时间',
                        key: 'createdTime',
                        render: (h, params) => {
                        	return h('div', this.formatDate(params.row.createdTime));
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                        	let status = params.row.status;
                        	switch (status) {
                        		case 1: status = '审核中'; break;
                        		case 2: status = '审核不通过'; break;
                        		case 3: status = '审核通过'; break;
                        		default: break;
                        	}
                        	return h('div', status);
                        }
                    },
                    {
                    	title: '拒绝认证次数',
                    	key: 'refuseNumber'
                    },
                    {
                    	title: '操作',
                    	key: 'action',
                    	width: 260,
                    	align: 'center',
                    	render: (h, params) => {
                    		return h('div', [
                    			h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.currentAuthData = params.row;
                                            let refuseType = this.currentAuthData.refuseType;
                                            let nickName = '';
                                            if (refuseType) {
                                            	switch (refuseType) {
                                            		case 1: refuseType = '证件图片信息与所留证件信息不匹配'; break;
                                            		case 3: refuseType = '证件信息不清晰'; break;
                                            		case 9: refuseType = '视频画面模糊'; break;
                                            		case 10: refuseType = '视频中声音不清晰'; break;
                                            		case 11: refuseType = '视频材料不合要求，请仔细阅读拍摄要求'; break;
                                            		case 12: refuseType = '视频材料中所述日期与提交审核日期不符'; break;
                                            		case 13: refuseType = '很抱歉！由于个人认证流程升级，需要您将Insight更新到最新版本之后再次进行个人认证。'; break;
                                            		default: break;
                                            	}
                                            }
                                            this.currentAuthData.refuseType = refuseType;
                                            this.currentAuthData.countryName = this.currentAuthData.country.zhName;
                                            if (this.currentAuthData.adminUser) {
                                            	nickName = this.currentAuthData.adminUser['nickName'];
                                            }
                                            this.currentAuthData.adminUserName = nickName;
                                            
                                            let gender = this.currentAuthData.gender;
                                            if (gender) {
                                            	switch (gender) {
                                            		case 1: gender = '男'; break;
                                            		case 2: gender = '女'; break;
                                            		default: break;
                                            	}
                                            }
                                            this.currentAuthData.gender = gender;
                                            
                                            this.currentAuthData.birthday = this.formatDate(this.currentAuthData.birthday);
                                            
                                            let professionType = this.currentAuthData.professionType;
                                            if (professionType) {
                                            	switch (professionType) {
                                            		case 1: professionType = '自由职业者'; break;
                                            		case 2: professionType = '个体经营者'; break;
                                            		case 3: professionType = '互联网行业'; break;
                                            		case 4: professionType = 'IT行业'; break;
                                            		case 5: professionType = '金融行业'; break;
                                            		case 6: professionType = '建筑工程行业'; break;
                                            		case 7: professionType = '机械电气行业'; break;
                                            		case 8: professionType = '汽车行业'; break;
                                            		case 9: professionType = '能源行业'; break;
                                            		case 10: professionType = '生物化工行业'; break;
                                            		case 11: professionType = '交通物流'; break;
                                            		case 12: professionType = '电气电子工业'; break;
                                            		case 13: professionType = '通讯行业'; break;
                                            		case 14: professionType = '微电子行业'; break;
                                            		case 15: professionType = '律师'; break;
                                            		case 16: professionType = '商业服务业'; break;
                                            		case 17: professionType = '媒体文娱行业'; break;
                                            		case 18: professionType = '政府机关行业'; break;
                                            		default: break;
                                            	}
                                            }
                                            this.currentAuthData.professionType = professionType;
                                            
                                            let incomeType = this.currentAuthData.incomeType;
                                            if (incomeType) {
                                            	switch (incomeType) {
                                            		case 1: incomeType = '3000元以下'; break;
                                            		case 2: incomeType = '3001-8000元'; break;
                                            		case 3: incomeType = '8001-15000元'; break;
                                            		case 4: incomeType = '15001-30000元'; break;
                                            		case 5: incomeType = '30001-60000元'; break;
                                            		case 6: incomeType = '60000元以上'; break;
                                            		default: break;
                                            	}
                                            }
                                            this.currentAuthData.incomeType = incomeType;
                                            
                                            let educationType = this.currentAuthData.educationType;
                                            if (educationType) {
                                            	switch (educationType) {
                                            		case 1: educationType = '高中及以下'; break;
                                            		case 2: educationType = '大中专及职业院校'; break;
                                            		case 3: educationType = '本科'; break;
                                            		case 4: educationType = '硕士'; break;
                                            		case 5: educationType = '硕士以上'; break;
                                            	}
                                            }
                                            this.currentAuthData.educationType = educationType;
                                            
                                            let areaType = this.currentAuthData.areaType;
                                            if (areaType) {
                                            	switch (areaType) {
                                            		case 1: areaType = '北京市'; break;
                                            		case 2: areaType = '天津市'; break;
                                            		case 3: areaType = '上海市'; break;
                                            		case 4: areaType = '重庆市'; break;
                                            		case 5: areaType = '河北省'; break;
                                            		case 6: areaType = '山西省'; break;
                                            		case 7: areaType = '辽宁省'; break;
                                            		case 8: areaType = '吉林省'; break;
                                            		case 9: areaType = '黑龙江省'; break;
                                            		case 10: areaType = '江苏省'; break;
                                            		case 11: areaType = '浙江省'; break;
                                            		case 12: areaType = '安徽省'; break;
                                            		case 13: areaType = '福建省'; break;
                                            		case 14: areaType = '江西省'; break;
                                            		case 15: areaType = '山东省'; break;
                                            		case 16: areaType = '河南省'; break;
                                            		case 17: areaType = '湖北省'; break;
                                            		case 18: areaType = '湖南省'; break;
                                            		case 19: areaType = '广东省'; break;
                                            		case 20: areaType = '海南省'; break;
                                            		case 21: areaType = '四川省'; break;
                                            		case 22: areaType = '贵州省'; break;
                                            		case 23: areaType = '云南省'; break;
                                            		case 24: areaType = '陕西省'; break;
                                            		case 25: areaType = '甘肃省'; break;
                                            		case 26: areaType = '青海省'; break;
                                            		case 27: areaType = '台湾省'; break;
                                            		case 28: areaType = '广西壮族自治区'; break;
                                            		case 29: areaType = '内蒙古自治区'; break;
                                            		case 30: areaType = '西藏自治区'; break;
                                            		case 31: areaType = '宁夏回族自治区'; break;
                                            		case 32: areaType = '新疆维吾尔自治区'; break;
                                            		case 33: areaType = '香港特别行政区'; break;
                                            		case 34: areaType = '澳门特别行政区'; break;
                                            		default: break;
                                            	}
                                            }
                                            this.currentAuthData.areaType = areaType; 
                                            
                                        	this.showAuthData = true;
                                        }
                                    }
                                }, '认证资料'),
                    			h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        display: params.row.status != 1?'none':'inline-block'
                                    },
                                    on: {
                                        click: () => {
                                            this.passAuthentication(params.index, params.row.uid);
                                        }
                                    }
                                }, '通过验证'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        display: params.row.status != 1?'none':'inline-block'
                                    },
                                    on: {
                                        click: () => {
                                        	this.currentIndex = params.index;
                                            this.showRefuseType = true;
                                        }
                                    }
                                }, '拒绝认证'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        display: params.row.status != 3?'none':'inline-block'
                                    },
                                    on: {
                                        click: () => {
                                        	this.currentIndex = params.index;
                                            this.showRefuseType = true;
                                        }
                                    }
                                }, '取消认证')
                            ]);
                    	}
                    }
                ],
                data: [],					//渲染的数据
                loadingState: false,		//表格读取状态
                total: 0,					//查询出的数据总条数
                certificationType: '',		//默认搜索的全部
                certificationStatus: '',	//认证状态
				searchType: 'uuid',			//搜索类型
				searchContent: '',			//搜索的内容
				showRefuseType: false,	//显示拒绝弹窗
				refuseType: '1',			//拒绝原因
				showAuthData: false,		//显示认证资料
				currentAuthData: '',		//当前认证资料
				currentIndex: '',			//当前操作数据索引
				showImage: false,
				showVideo: false,
				currentImage: '',
				currentVideo: ''
			}
		},
		methods: {
            /*分页*/
           	changePage (page) {
           		this.loadList(page);
           	},
           	/*获取列表*/
           	loadList (page) {
           		this.loadingState = true;
           		this.$axios.get('user/certification/list?page='+page+'&pageSize=10&' + this.searchType + '=' + this.searchContent + 
           		'&status=' + this.certificationStatus)
				.then((response) => {
					console.log(response.data);
					if (response.data.isSuccessful) {
						this.data = response.data.data.rows;
						this.total = response.data.data.records;
					} else {
						this.$Notice.error({ title: response.data.message });
					}
					this.loadingState = false;
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.loadingState = false;
	        	})
           	},
           	/*筛选*/
			typeChange (certificationType) {
				console.log(certificationType);
			},
			statusChange (certificationStatus) {
				this.loadList(1);
			},
			/*搜索*/
			search () {
				this.loadList(1);
			},
			/*通过验证*/
			passAuthentication (index, certificationId) {
				this.$Modal.confirm({
                    content: `确认通过昵称为${this.data[index].user.nickName}用户的验证吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/certification/pass', qs.stringify({ certificationId: certificationId }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[index].status = 3;
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: response.data.message });
							}
							this.loadingState = false;
			        	})
			        	.catch((error) => {
			        		console.log(error);
			        		this.loadingState = false;
			        	})
                    }
                });
			},
			/*拒绝认证*/
			refuseAuthentication () {
				this.$Modal.confirm({
                    content: `确认拒绝昵称为${this.data[this.currentIndex].user.nickName}用户的验证吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/certification/refuse', qs.stringify({ refuseType: this.refuseType, certificationId: this.data[this.currentIndex].uid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[this.currentIndex].status = 2;
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: response.data.message });
							}
							this.loadingState = false;
			        	})
			        	.catch((error) => {
			        		console.log(error);
			        		this.loadingState = false;
			        	})
                    }
                });
			},
			checkImage (urlImage) {
				this.currentImage = urlImage;
				this.showImage = true;
			},
			checkVideo (urlVideo) {
				if (!urlVideo) {
					this.$Notice.error({ title: '没有视频链接' });
					return;
				}
				this.currentVideo = urlVideo;
				this.showVideo = true;
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
		mounted: function () {
			this.loadList(1);
		}
	}
</script>

<style scoped>
	.btn-group {
		margin-bottom: 10px;
		margin-right: 20px;
		width: 100%;
	}
	.btn-group button.ivu-btn {
		float: right;
	}
	.selectType {
		float: right;
		width: 100px;
		margin-left: 20px;
	}
	.searchBox {
		float: right;
		width: 280px;
	}
	.page {
		float: right;
		margin-top: 20px;
	}
	.pictures {
		display: flex;
		overflow: auto;
	}
	.pictures img {
		width: 100px;
		height: 100px;
		cursor: pointer;
	}
</style>