<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="add">新增</Button>
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的标题">
				<Button slot="append" icon="md-search" @click="search"></Button>
			</Input>
		</ButtonGroup>
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
		<div class="page">
			<Page :total="total" :current="1" show-total @on-change="changePage"></Page>
		</div>
		<Modal
	        v-model="flashAddShow"
	        title="新增快讯"
	        @on-ok="flashAddConfirm">
	        <Form :model="flashItem" :label-width="100">
	        	<FormItem label="快讯标题:">
	            	<Input v-model="flashItem.title" placeholder="请输入快讯标题"></Input>
		        </FormItem>
		        <FormItem label="等级:">
		            <Select v-model="flashItem.level">
						<Option value="1">一级</Option>
						<Option value="2">二级</Option>
						<Option value="3">三级</Option>
						<Option value="4">四级</Option>
						<Option value="5">五级</Option>
					</Select>
		        </FormItem>
		        <FormItem label="显示时间:">
		            <DatePicker type="datetime" placeholder="请输入显示时间" v-model="flashItem.time"></DatePicker>
		        </FormItem>
		        <FormItem label="内容:">
		        	<Input v-model="flashItem.content"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入快讯内容"></Input>
		        </FormItem>
		        <FormItem label="原文链接:">
	            	<Input v-model="flashItem.url" placeholder="请输入原文链接"></Input>
		        </FormItem>
		        <FormItem label="来源:">
		            <Select v-model="flashItem.origin">
						<Option value="1">币世界</Option>
						<Option value="2">币快报</Option>
						<Option value="3">金色财经</Option>
						<Option value="4">币智慧</Option>
						<Option value="5">巴比特</Option>
						<Option value="6">有币</Option>
						<Option value="7">币牛牛</Option>
						<Option value="8">链得得</Option>
						<Option value="9">鸵鸟区块链</Option>
						<Option value="10">链闻</Option>
						<Option value="11">挖链</Option>
						<Option value="12">小葱App</Option>
						<Option value="13">火链财经</Option>
						<Option value="14">支点</Option>
						<Option value="15">币控</Option>
						<Option value="99">其它</Option>
					</Select>
		        </FormItem>
		        <FormItem label="来源:" v-if="flashItem.origin == 99">
	            	<Input v-model="flashItem.otherOrigin" placeholder="请输入来源"></Input>
		        </FormItem>
		        <FormItem label="newsId:">
	            	<Input v-model="flashItem.newsId" placeholder="请输入newsId(选填)"></Input>
		        </FormItem>
	        </Form>
	    </Modal>
	    <Modal
	        v-model="flashUpdateShow"
	        title="编辑快讯"
	        @on-ok="flashUpdateConfirm">
	        <Form :model="flashItem" :label-width="100">
	        	<FormItem label="快讯标题:">
	            	<Input v-model="flashUpdateItem.title" placeholder="请输入快讯标题"></Input>
		        </FormItem>
		        <FormItem label="等级:">
		            <Select v-model="flashUpdateItem.level">
						<Option value="1">一级</Option>
						<Option value="2">二级</Option>
						<Option value="3">三级</Option>
						<Option value="4">四级</Option>
						<Option value="5">五级</Option>
					</Select>
		        </FormItem>
		        <FormItem label="显示时间:">
		            <DatePicker type="datetime" placeholder="请输入显示时间" v-model="flashUpdateItem.time"></DatePicker>
		        </FormItem>
		        <FormItem label="内容:">
		        	<Input v-model="flashUpdateItem.content"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入快讯内容"></Input>
		        </FormItem>
		        <FormItem label="原文链接:">
	            	<Input v-model="flashUpdateItem.url" placeholder="请输入原文链接"></Input>
		        </FormItem>
		        <FormItem label="赞数量:">
	            	<Input v-model="flashUpdateItem.likeNumber" placeholder="请输入赞数量"></Input>
		        </FormItem>
		        <FormItem label="踩数量:">
	            	<Input v-model="flashUpdateItem.unlikeNumber" placeholder="请输入踩数量"></Input>
		        </FormItem>
		        <FormItem label="来源:">
		            <Select v-model="flashUpdateItem.origin">
						<Option value="1">币世界</Option>
						<Option value="2">币快报</Option>
						<Option value="3">金色财经</Option>
						<Option value="4">币智慧</Option>
						<Option value="5">巴比特</Option>
						<Option value="6">有币</Option>
						<Option value="7">币牛牛</Option>
						<Option value="8">链得得</Option>
						<Option value="9">鸵鸟区块链</Option>
						<Option value="10">链闻</Option>
						<Option value="11">挖链</Option>
						<Option value="12">小葱App</Option>
						<Option value="13">火链财经</Option>
						<Option value="14">支点</Option>
						<Option value="15">币控</Option>
						<Option value="99">其它</Option>
					</Select>
		        </FormItem>
		        <FormItem label="来源:" v-if="flashUpdateItem.origin == 99">
	            	<Input v-model="flashUpdateItem.otherOrigin" placeholder="请输入来源"></Input>
		        </FormItem>
		        <FormItem label="newsId:">
	            	<Input v-model="flashUpdateItem.newsId" placeholder="请输入newsId(选填)"></Input>
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
                        title: '快讯标题',
                        key: 'title',
                        width: 120,
                        tooltip: true
                    },
                    {
                        title: '等级',
                        key: 'level',
                        width: 120,
                        render: (h, params) => {
                        	let level = params.row.level;
                        	let color = level === 1 ? '#e52e2d' : level === 2 ? '#eb8b22' : level === 3 ? '#f6db11' : level === 4 ? '#5bbe6c' : '#000';
                        	let text = level === 1 ? '一级' : level === 2 ? '二级' : level === 3 ? '三级' : level === 4 ? '四级' : '五级';
                        	return h('Tag', {
	                            props: {
	                                type: 'dot',
	                                color: color
	                            }
	                        }, text);
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
                    	title: '阅读次数',
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
                        title: '显示时间',
                        width: 150,
                        render: (h, params) => {
                        	return h('div', this.formatDate(params.row.time));
                        }
                    },
                    {
                        title: '上线时间',
                        width: 150,
                        render: (h, params) => {
                        	return h('div', this.formatDate(params.row.onlineTime));
                        }
                    },
                    {
                    	title: '内容',
                    	width: 100,
                    	key: 'content',
                    	tooltip: true
                    },
                    {
                    	title: '来源',
                    	width: 100,
                    	render: (h, params) => {
                    		let origin = params.row.origin;
                    		if (origin == 99) {
                    			origin = params.row.otherOrigin;
                    		} else {
                    			switch (origin) {
                    				case 1: origin = '币世界'; break;
                    				case 2: origin = '币快报'; break;
                    				case 3: origin = '金色财经'; break;
                    				case 4: origin = '币智慧'; break;
                    				case 5: origin = '巴比特'; break;
                    				case 6: origin = '有币'; break;
                    				case 7: origin = '币牛牛'; break;
                    				case 8: origin = '链得得'; break;
                    				case 9: origin = '鸵鸟区块链'; break;
                    				case 10: origin = '链闻'; break;
                    				case 11: origin = '挖链'; break;
                    				case 12: origin = '小葱App'; break;
                    				case 13: origin = '火链财经'; break;
                    				case 14: origin = '支点'; break;
                    				case 15: origin = '币控'; break;
                    				default: break;
                    			}
                    		}
                    		return h('div', origin);
                    	}
                    },
                    {
                    	title: '管理员',
                    	width: 150,
                    	render: (h, params) => {
                    		if (params.row.user) {
                    			return h('div', params.row.user.nickName);
                    		}
                    	}
                    },
                    {
                    	title: 'newsId',
                    	width: 100,
                    	key: 'newsId'
                    },
                    {
                    	title: '操作',
                    	key: 'action',
                    	width: 240,
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
                                            open(params.row.url);
                                        }
                                    }
                                }, '查看原文'),
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
                                        	this.flashUpdateItem.uid = params.row.uid;
                                        	this.flashUpdateItem.title = params.row.title;
                                        	this.flashUpdateItem.level = params.row.level + '';
											this.flashUpdateItem.time = this.formatDate(params.row.time);
											this.flashUpdateItem.content = params.row.content;
											this.flashUpdateItem.url = params.row.url;
											this.flashUpdateItem.likeNumber = params.row.likeNumber;
											this.flashUpdateItem.unlikeNumber = params.row.unlikeNumber;
											if (params.row.origin) {
												this.flashUpdateItem.origin = params.row.origin + '';
											} else {
												this.flashUpdateItem.origin = '';
											}
											if (params.row.otherOrigin) {
												this.flashUpdateItem.otherOrigin = params.row.otherOrigin;
											} else {
												this.flashUpdateItem.origin = '';
											}
											this.flashUpdateItem.newsId = params.row.newsId;
                                            this.flashUpdateShow = true;
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
                data: [{ uid: 1 }],					//渲染的数据
                loadingState: false,			//表格读取状态
                total: 0,					//查询出的数据总条数
				searchContent: '',			//搜索的内容
				flashAddShow: false,
				flashItem: {
					title: '',
					level: '',
					time: '',
					content: '',
					url: '',
					origin: '',
					otherOrigin: '',
					newsId: ''
				},
				flashUpdateShow: false,
				flashUpdateItem: {
					uid: '',
					title: '',
					level: '',
					time: '',
					content: '',
					url: '',
					likeNumber: '',
					unlikeNumber: '',
					origin: '',
					otherOrigin: '',
					newsId: ''
				},
			}
		},
		methods: {
			loadList (page) {
				this.loadingState = true;
           		this.$axios.get('news/flash/list?page='+page+'&pageSize=10&title=' + this.searchContent)
				.then((response) => {
					if (response.data.isSuccessful) {
						console.log(response.data.data.rows);
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
				this.flashItem.time = this.formatDate(new Date().getTime());
				this.flashAddShow = true;
			},
			search () {
				this.loadList(1);
			},
			changePage (page) {
				this.loadList(page);
			},
			onLine (index, newsFlashId) {
				this.$Modal.confirm({
                    content: `确认上线该快讯吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('news/flash/online', qs.stringify({ newsFlashId: newsFlashId }),
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
			offLine (index, newsFlashId) {
				this.$Modal.confirm({
                    content: `确认下线该快讯吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('news/flash/offline', qs.stringify({ newsFlashId: newsFlashId }),
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
			test (index, newsFlashId) {
				this.$Modal.confirm({
                    content: `确认将该快讯改为测试吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('news/flash/test', qs.stringify({ newsFlashId: newsFlashId }),
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
			flashAddConfirm () {
				this.flashItem.time = this.flashItem.time.getTime();
				if (this.flashItem.origin != 99) {
					this.flashItem.otherOrigin = '';
				}
				
           		this.$axios.post('news/flash/add', qs.stringify(this.flashItem),
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
			flashUpdateConfirm () {
				if (this.flashUpdateItem.time.getTime()) {	//有的浏览器得到格式化后的有的浏览器得到格式化前的,怀疑兼容问题
					this.flashUpdateItem.time = this.flashUpdateItem.time.getTime();
				}
				if (this.flashUpdateItem.origin != 99) {
					this.flashUpdateItem.otherOrigin = '';
				}
				
           		this.$axios.post('news/flash/update', qs.stringify(this.flashUpdateItem),
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