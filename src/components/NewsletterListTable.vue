<template>
	<div>
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
	        </Form>
	    </Modal>
	    <Modal
	        v-model="flashUpdateShow"
	        title="新增快讯"
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
		        <FormItem label="阅读量:">
	            	<Input v-model="flashUpdateItem.readNumber" placeholder="请输入阅读量"></Input>
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
                        width: 120
                    },
                    {
                        title: '等级',
                        key: 'level',
                        width: 120,
                        render: (h, params) => {
                        	let level = params.row.level;
                        	let color = level === 1 ? 'red' : level === 2 ? 'orange' : level === 3 ? 'yellow' : level === 4 ? 'green' : 'black';
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
                    	render: (h, params) => {
                    		return h('Poptip', {
	                            props: {
	                                trigger: 'hover',
	                                content: params.row.content,
	                                placement: 'bottom'
	                            }
	                        }, [
	                            h('Tag', params.row.content)
	                        ]);
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
											this.flashUpdateItem.readNumber = params.row.readNumber;
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
					url: ''
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
					readNumber: ''
				},
			}
		},
		methods: {
			loadList (page) {
				this.loadingState = true;
           		this.$axios.get('news/flash/list?page='+page+'&pageSize=10&title=' + this.searchContent)
				.then((response) => {
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
			add () {
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
				this.flashUpdateItem.time = this.flashUpdateItem.time.getTime();
				
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