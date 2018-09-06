<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的内容">
				<Select v-model="searchType" slot="prepend" style="width: 90px">
		            <Option value="uuid">uuid</Option>
		            <Option value="nickName">昵称</Option>
		            <Option value="userName">姓名</Option>
		        </Select>
				<Button slot="append" icon="md-search" @click="search"></Button>
			</Input>
		</ButtonGroup>
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
		<div class="page">
			<Page :total="total" :current="1" show-total @on-change="changePage"></Page>
		</div>
		<Modal
	        v-model="showOffLine"
	        title="取消认证"
	        @on-ok="offLineConfirm">
	        <p>取消认证原因:</p>
	        <Select v-model="walletType">
	        	<Option value="1"></Option>
	        	<Option value="2"></Option>
	        </Select>
	    </Modal>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				columns: [
					{
						title: 'uuid',
						key: 'uuid'
					},
					{
						title: '用户logo',
						render: (h,params) => {
                    		return h('Img', {
                    			attrs: {
                    				src: params.row.headImageUrl,
                    				style: 'width: 30px;'
                    			}
                    		})
                    	}
					},
					{
						title: '用户昵称',
						key: 'nickName'
					},
					{
						title: '状态',
						key: 'status',
						render: (h, params) => {
							let status = params.row.status;
							switch (status) {
								case 1: status = '正常'; break;
								case 2: status = '拉黑'; break;
								default: break;
							}
							return h('div', status);
						}
					},
					{
						title: 'INB数量',
						key: 'inbNumber'
					},
					{
						title: '答题时间',
						render: (h, params) => {
							
						}
					},
					{
						title: '操作',
						width: 200,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                        	this.show(params.row);
                                        }
                                    }
                                }, '查看个人认证'),
                                /*h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                        	
                                        }
                                    }
                                }, '答题详情'),*/
								h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                    	display: params.row.certificationType != 7?'none':'inline-block'
                                    },
                                    on: {
                                        click: () => {
                                        	this.offLine(params.index, params.row.uid);
                                        }
                                    }
                                }, '取消认证')
							]);
						}
					}
				],
				searchType: '',
				searchContent: '',
				loadingState: false,
				total: 0,
				data: [{uid: 1}],
				certificationStatus: ''
			}
		},
		methods: {
			loadList (page) {
				this.loadingState = true;
				let url = 'user/panel/lists?page='+page+'&pageSize=10';
				if (this.searchType !== '') {
					url = 'user/panel/lists?page='+page+'&pageSize=10&' + 
					this.searchType + '=' + this.searchContent;
				}
           		this.$axios.get(url)
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
			search () {
				this.loadList(1);
			},
			changePage (page) {
				this.loadList(page);
			},
			/*statusChange (status) {
				this.loadList(1);
			},*/
			show (row) {
				this.$Modal.success({
                    title: row.userCertification.name + '的个人认证信息',
                    width: 600,
                    content: '性别：' + (row.userCertification.gender == 1? '男': '女') + '<br>' + 
                    	(row.userCertification.type == 1?'身份证号':'护照号') + ':' +
                    	row.userCertification.idNumber + '<br>' +
                    	'手机号:' + row.userCertification.phoneNumber + '<br>' + 
                    	'身份证正面:' + '<br>' + row.userCertification.urlFront + '<br>' +
                    	'身份证反面:' + '<br>' + row.userCertification.urlOpposite + '<br>' +
                    	'认证视频:' + '<br>' + row.userCertification.urlVideo
                })
			},
			offLine (index, uid) {
				this.$Modal.confirm({
                    content: `确认取消该用户的认证吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/panel/refuse', qs.stringify({ userUuid: userUuid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[index].status = 2;
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
			}
		},
		mounted () {
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
		width: 290px;
	}
	.page {
		float: right;
		margin-top: 20px;
	}
</style>