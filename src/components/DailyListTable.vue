<template>
	<div>
		<template v-for="item in uploadList">
            <Progress 
            	v-if="item.showProgress"
            	:percent="item.percentage" 
            	hide-info 
            	style="margin-bottom: 20px;">
            </Progress>
		</template>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="add">新增</Button>
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的标题">
				<Button slot="append" icon="search" @click="search"></Button>
			</Input>
		</ButtonGroup>
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
		<div class="page">
			<Page :total="total" :current="1" show-total @on-change="changePage"></Page>
		</div>
		<Modal
	        v-model="newsAddShow"
	        title="新增新闻"
	        @on-ok="newsAddConfirm">
	        <Form :model="newsItem" :label-width="100">
	        	<FormItem label="新闻标题:">
	            	<Input v-model="newsItem.title" placeholder="请输入快讯标题"></Input>
		        </FormItem>
		        <FormItem label="等级:">
		            <Select v-model="newsItem.type">
						<Option value="1">一级</Option>
						<Option value="2">二级</Option>
						<Option value="3">三级</Option>
						<Option value="4">四级</Option>
						<Option value="5">五级</Option>
					</Select>
		        </FormItem>
		        <FormItem label="显示时间:">
		            <DatePicker type="datetime" placeholder="请输入显示时间" v-model="newsItem.time"></DatePicker>
		        </FormItem>
		        <FormItem label="内容简介:">
		        	<Input v-model="newsItem.description"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入快讯内容"></Input>
		        </FormItem>
	        </Form>
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
                        key: 'uid',
                        fixed: 'left',
                  },
                    {
                    	title: '标题',
                    	key: 'title',
                    	width: 120
                    },
                    {
                    	title: '类型',
                    	key: 'type',
                    	width: 110,
                    	render: (h, params) => {
                    		let type = params.row.type;
                    		switch (type) {
                    			case 1: type = 'Insight日报'; break;
                    			case 2: type = 'Insight研究院'; break;
                    			case 3: type = '其它'; break;
                    			default: break;
                    		}
                    		return h('div', type);
                    	}
                    },
                    {
                        title: '显示时间',
                        key: '',
                        width: 150,
                        render: (h, params) => {
                        	return h('div', this.formatDate(params.row.time));
                        }
                    },
                    {
                        title: '创建时间',
                        key: '',
                        width: 150,
                        render: (h, params) => {
                        	return h('div', this.formatDate(params.row.createdTime));
                        }
                    },
                    {
                        title: '上线时间',
                        key: '',
                        width: 150,
                        render: (h, params) => {
                        	return h('div', this.formatDate(params.row.onlineTime));
                        }
                    },
                    {
	                    title: '状态',
	                    key: 'onlineStatus',
	                    width: 130,
	                    render: (h, params) => {
	                        const row = params.row;
	                        const color = row.onlineStatus === 1 ? '#000' : row.onlineStatus === 2 ? '#2db7f5' : row.onlineStatus === 3 ? '#f90' : '#ed3f14';
	                        const text = row.onlineStatus === 1 ? '未上线' : row.onlineStatus === 2 ? '测试中' : row.onlineStatus === 3 ? '已上线' : '已下线';
	
	                        return h('Tag', {
	                            props: {
	                                type: 'dot',
	                                color: color
	                            }
	                        }, text);
	                    }
	                },
                    {
                    	title: '浏览量',
                    	key: 'readNumber',
                    	width: 100
                    },
                    {
                    	title: '赞/踩',
                    	width: 100,
                    	render: (h, params) => {
                    		return h('div', params.row.likeNumber + '/' + params.row.unlikeNumber);
                    	}
                    },
                    {
                    	title: '创建人',
                    	width: 120,
                    	render: (h, params) => {
                    		return h('div', params.row.user.nickName);
                    	}
                    },
                    {
                    	title: 'banner图片',
                    	width: 80,
                    	render: (h,params) => {
                    		return h('Img', {
                    			attrs: {
                    				src: params.row.imageUrl,
                    				style: 'width: 30px;'
                    			}
                    		})
                    	}
                    },
                    {
                    	title: '分享图片',
                    	width: 80,
                    	render: (h, params) => {
                    		if (params.row.page) {
                    			return h('Img', {
	                    			attrs: {
	                    				src: params.row.page.share.imageUrl,
	                    				style: 'width: 30px;'
	                    			}
	                    		})
                    		}
                    	}
                    },
                    {
                    	title: '分享标题',
                    	width: 120,
                    	render: (h, params) => {
                    		if (params.row.page) {
                    			return h('div', params.row.page.share.wechatFriendTitle);
                    		}
                    	}
                    },
                    {
                    	title: '分享描述',
                    	width: 120,
                    	render: (h, params) => {
                    		if (params.row.page) {
                    			return h('Poptip', {
		                            props: {
		                                trigger: 'hover',
		                                content: params.row.page.share.wechatFriendDescription,
		                                placement: 'bottom'
		                            }
		                        }, [
		                            h('Tag', params.row.page.share.wechatFriendDescription)
		                        ]);
                    		}
                    	}
                    },
                    {
                    	title: '操作',
                    	key: 'action',
                    	width: 400,
                    	fixed: 'right',
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
                                           
                                        }
                                    }
                                }, '预览'),
                    			h('Upload', {
                                    props: {
                                        ref: 'upload',
                                        action: '/api/news/add/image',
                                        'show-upload-list': false,
                                        'on-success': this.uploadSuccess,
                                        'on-error': this.uploadError,
                                        data: { uid: params.row.uid },
                                        name: 'logo'
                                    },
                                    style: {
                                    	display: 'inline'
                                    }
                                }, [
                                	h('Button', {
                                		props: {
	                                        type: 'primary',
	                                        size: 'small'
	                                   	},
	                                    style: {
	                                        marginRight: '5px'
	                                    }
                                	}, '上传banner')
                                ]),
                                h('Upload', {
                                    props: {
                                        ref: 'upload',
                                        action: '/api/news/add/image',
                                        'show-upload-list': false,
                                        'on-success': this.uploadSuccess,
                                        'on-error': this.uploadError,
                                        data: { uid: params.row.uid },
                                        name: 'share'
                                    },
                                    style: {
                                    	display: 'inline'
                                    }
                                }, [
                                	h('Button', {
                                		props: {
	                                        type: 'primary',
	                                        size: 'small'
	                                   	},
	                                    style: {
	                                        marginRight: '5px'
	                                    }
                                	}, '上传分享图')
                                ]),
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
                                            this.toUpdate(params.row);
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                        	this.test(params.index, params.row.uid);
                                        }
                                    }
                                }, '测试'),
                                h('Button', {
                                    props: {
                                        type: params.row.onlineStatus == 3?'error':'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                        	if (params.row.onlineStatus == 3) {
                                        		this.offLine(params.index, params.row.uid);
                                        	} else {
                                        		this.onLine(params.index, params.row.uid);
                                        	}
                                        }
                                    }
                                }, params.row.onlineStatus == 3?'下线':'上线')
                            ]);
                    	}
                    }
                ],
                data: [],					//渲染的数据
                loadingState: false,		//表格读取状态
                total: 0,					//查询出的数据总条数
				searchContent: '',			//搜索的内容
				uploadList: [],
				newsAddShow: false,
				newsItem: {
					title: '',
					type: '',
					time: '',
					description: ''
				}
			}
		},
		methods: {
			loadList (page) {
				this.loadingState = true;
           		this.$axios.get('news/list?page='+page+'&pageSize=10&title=' + this.searchContent)
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
			add () {
				this.newsAddShow = true;
			},
			search () {
				this.loadList(1);
			},
			changePage (page) {
				this.loadList(page);
			},
			toUpdate (row) {
				this.$router.push({ 
					path: 'dailyEdit/' + row.uid,
					query: { row: row }
				});
			},
			onLine (index, newsId) {
				this.$Modal.confirm({
                    content: `确认上线该日报吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('news/online', qs.stringify({ newsId: newsId }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[index].onlineStatus = 3;
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
			offLine (index, newsId) {
				this.$Modal.confirm({
                    content: `确认下线该日报吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('news/offline', qs.stringify({ newsId: newsId }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[index].onlineStatus = 9;
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
			test (index, newsId) {
				this.$Modal.confirm({
                    content: `确认将该日报改为测试吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('news/test', qs.stringify({ newsId: newsId }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[index].onlineStatus = 2;
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
			uploadSuccess (data) {
				if (data.isSuccessful) {
					this.loadList(1);
					this.$Notice.success({ title: '操作成功' });
				} else {
					this.$Notice.error({ title: response.data.message });
				}
			},
			uploadError (error) {
				this.$Notice.error({ title: error });
			},
			newsAddConfirm () {
				this.newsItem.time = this.newsItem.time.getTime();
				
           		this.$axios.post('news/add', qs.stringify(this.newsItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
						this.loadList(1);
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
			this.$nextTick(() => {
				//this.uploadList = this.$refs.upload.fileList;
				console.log(this.$refs.upload);
			});
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
	.searchBox {
		float: right;
		width: 200px;
		margin-right: 20px;
	}
	.page {
		float: right;
		margin-top: 20px;
	}
</style>