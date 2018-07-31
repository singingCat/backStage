<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<!--<Select size="small" class="selectType" v-model="certificationType" @on-change="typeChange(certificationType)">
				<Option value="">全部</Option>
				<Option value="6">个人认证</Option>
				<Option value="3">分析师认证</Option>
			</Select>-->
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
				<Button slot="append" icon="search" @click="search"></Button>
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
	        <P>国家: {{currentAuthData.countryName}}</P>
	        <P>手机号: {{currentAuthData.phoneNumber}}</P>
	        <P>{{currentAuthData.type == 1 ? '身份证号' : '护照号'}}: {{currentAuthData.idNumber}}</P>
	        <P>图片: </P>
	        <div class="pictures" style="display: flex; text-align: center;">
	        	<div style="padding-right: 20px;">
	        		<a :href="currentAuthData.urlFront" target="_blank"><img :src="currentAuthData.urlFront"></a>
	        		<div>证件照正面</div>
	        	</div>
	        	<div style="padding-right: 20px;">
	        		<a :href="currentAuthData.urlHand" target="_blank"><img :src="currentAuthData.urlHand"></a>
	        		<div>证件照手持</div>
	        	</div>
	        	<div style="padding-right: 20px;">
	        		<a :href="currentAuthData.urlOpposite" target="_blank"><img :src="currentAuthData.urlOpposite"></a>
	        		<div>证件照反面</div>
	        	</div>
	        </div>
	        <p v-if="currentAuthData.status == 2">拒绝原因: {{currentAuthData.refuseType}}</p>
	        <p v-if="currentAuthData.status != 1">审核人: {{currentAuthData.adminUser['nickName']}}</p>
	    </Modal>
		<Modal
	        v-model="showRefuseType"
	        title="请选择拒绝原因"
	        @on-ok="refuseAuthentication">
	        <p>拒绝原因:</p>
	        <Select v-model="refuseType">
	        	<Option value="1">证件图片信息与所留证件信息不匹配</Option>
	        	<Option value="2">身份证号码不匹配</Option>
	        	<Option value="3">证件信息不清晰</Option>
	        	<Option value="4">证件信息错误</Option>
	        	<Option value="5">手持身份证与“Insigh+日期”照片不合规定</Option>
	        </Select>
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
                                            if (refuseType) {
                                            	switch (refuseType) {
                                            		case 1: refuseType = '证件图片信息与所留证件信息不匹配'; break;
                                            		case 2: refuseType = '身份证号码不匹配'; break;
                                            		case 3: refuseType = '证件信息不清晰'; break;
                                            		case 4: refuseType = '证件信息错误'; break;
                                            		case 5: refuseType = '手持身份证与“Insigh+日期”照片不合规定'; break;
                                            		default: break;
                                            	}
                                            }
                                            this.currentAuthData.refuseType = refuseType;
                                            this.currentAuthData.countryName = this.currentAuthData.country.zhName;
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
                                }, '拒绝认证')
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
				currentIndex: ''			//当前操作数据索引
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
					if (response.data.isSuccessful) {
						console.log(response.data);
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
	}
</style>