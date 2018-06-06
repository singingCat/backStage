<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="add">新增</Button>
			<Input class="searchBox" size="small" v-model="searchContent" placeholder="要搜索的货币名称...">
				<Button slot="append" icon="search" @click="search"></Button>
			</Input>
		</ButtonGroup>
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
		<div class="page">
			<Page :total="total" :current="1" show-total @on-change="changePage"></Page>
		</div>
	</div>
</template>

<script>
	import qs from 'qs'
	
	export default {
		data () {
			return {
				columns: [
					{
						type: 'index',
						width: 60,
						align: 'center'
					},
					{
						title: 'uid',
						key: 'uid'
					},
                    {
                        title: '数币名称',
                        key: 'symbolName'
                    },
                    {
                        title: '最新价格',
                        key: 'price'
                    },
                    {
                        title: '状态',
                        key: 'status'
                    },
                    {
                    	title: '空投状态',
                    	key: 'airdropStatus'
                    },
                    {
                    	title: '操作',
                    	key: 'action',
                    	width: 500,
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '主要信息'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.showBase(params.index)
                                        }
                                    }
                                }, '基本信息'),
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
                                            
                                        }
                                    }
                                }, '空投信息'),
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
                                            this.toCommentList();
                                        }
                                    }
                                }, '评论列表'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            
                                        }
                                    }
                                }, '团队列表'),
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
                                        	this.edit(params.index, params.row)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                    	}
                    }
                ],
                data: [],
                searchContent: '',		//搜索的内容
                loadingState: false,
                total: 0
			}
		},
		methods: {
			/*获取列表*/
			loadList (page) {
				this.loadingState = true;
				let parameter = { page: page, pageSize: 10 };
           		let searchContent = this.searchContent;
           		if (searchContent != '') {
           			parameter['name'] = searchContent;
           		}
           		
           		this.$axios.post('coin//name/list', qs.stringify(parameter),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.data = response.data.data.rows;
						this.total = response.data.data.total;
						this.handleData();
						this.loadingState = false;
					} else {
						this.loadingState = false;
						this.$Notice.error({ title: response.data.message });
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.loadingState = false;
	        	})
			},
			/*处理数据*/
			handleData () {
				this.data.forEach((item, index) => {
					switch(item.status)
					{
						case 1: item.status = '已上市'; break;
						case 2: item.status = 'ICO'; break;
						default: break;
					}
					switch(item.airdropStatus)
					{
						case 1: item.airdropStatus = '无空投'; break;
						case 2: item.airdropStatus = '正在空投'; break;
						default: break;
					}
				})
			},
			/*分页*/
			changePage (page) {
           		this.loadList(page);
           	},
           	/*搜索*/
           	search () {
				this.loadList(1);
			},
			/*主要信息*/
			show (index) {
                this.$Modal.success({
                    title: `${this.data[index].symbolName}的主要信息`,
                    content: `logo：<img src="${this.data[index].logoUrl}" style="width: 30px;vertical-align: text-top;"><br>
                    		流通量：${this.data[index].circulatingSupply}<br>
                    		最大供应量：${this.data[index].maxSupply}<br>
                    		总供应量：${this.data[index].totalSupply}`
                })
            },
            /*基本信息*/
           	showBase (index) {
                this.$Modal.warning({
                    title: `${this.data[index].name}的基本信息`,
                    content: `数币：${this.data[index].name}<br>价格：${this.data[index].price}<br>类型：${this.data[index].type}`
                })
            },
            /*评论列表*/
           	toCommentList () {
           		this.$router.push({ name: 'commentList' })
           	},
            /*编辑*/
            edit (index, row) {
            	this.$router.push({ path: 'coinEdit/' + this.data[index].uid, query: { row: row } })
            },
            /*删除*/
            remove (index) {
            	this.$Modal.confirm({
                    content: '<p>确认删除吗?</p>',
                    onOk: () => {
                    	this.data.splice(index, 1);
                    }
                });
            },
            add () {
				this.$router.push({ name: 'coinAdd' })
			},
			typeChange (defaultType) {
				console.log(defaultType);
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