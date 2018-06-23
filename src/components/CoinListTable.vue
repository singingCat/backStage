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
		<Modal
	        v-model="editCoinShow"
	        title="编辑数币"
	        @on-ok="handleConfirm">
	        <Form :model="formItem" :label-width="100">
		        <FormItem label="数币简称:" prop="symbolName">
		            <Input v-model="formItem.symbolName" placeholder="请输入数币简称"></Input>
		        </FormItem>
		        <FormItem label="名称(英文):" prop="nameEnUs">
		            <Input v-model="formItem.nameEnUs" placeholder="请输入英文名称"></Input>
		        </FormItem>
		        <FormItem label="名称(中文):" prop="nameZhCn">
		            <Input v-model="formItem.nameZhCn" placeholder="请输入中文名称"></Input>
		        </FormItem>
		        <FormItem label="状态:" prop="status">
		            <Select v-model="formItem.status">
		            	<Option value="1">没有ICO</Option>
		            	<Option value="2">ICO进行中</Option>
		            	<Option value="3">ICO结束</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="BTC价格:">
		            <Input v-model="formItem.priceBtc" placeholder="请输入BTC价格"></Input>
		        </FormItem>
		        <FormItem label="ETH价格:">
		            <Input v-model="formItem.priceEth" placeholder="请输入ETH价格"></Input>
		        </FormItem>
		        <FormItem label="USD价格:">
		            <Input v-model="formItem.price" placeholder="请输入USD价格"></Input>
		        </FormItem>
		        <FormItem label="数币简介:">
		            <Input v-model="formItem.introduction" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入数币简介"></Input>
		        </FormItem>
		        <FormItem label="流通量:">
		            <Input v-model="formItem.circulatingSupply" placeholder="请输入流通量"></Input>
		        </FormItem>
		        <FormItem label="总供应量:">
		            <Input v-model="formItem.totalSupply" placeholder="请输入总供应量"></Input>
		        </FormItem>
		        <FormItem label="最大供应量:">
		            <Input v-model="formItem.maxSupply" placeholder="请输入最大供应量"></Input>
		        </FormItem>
		        <FormItem label="logoUrl:">
		            <Input v-model="formItem.logoUrl" placeholder="请输入logoUrl"></Input>
		        </FormItem>
			</Form>
	    </Modal>
	    
	    <div class="text-center" style="margin-top: 100px">空投列表</div>
	    <ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="addAirdrop">新增空投</Button>
			<Input class="searchBox" size="small" v-model.trim="airdropSearchContent" placeholder="要搜索的内容" style="width: 280px;">
				<Select v-model="airdropSearchType" slot="prepend" style="width: 80px">
		            <Option value="coinName">数币名称</Option>
		            <Option value="coinId">数币ID</Option>
		            <Option value="getType">空投类型</Option>
		        </Select>
				<Button slot="append" icon="search" @click="airdropSearch"></Button>
			</Input>
		</ButtonGroup>
		<Table border :columns="airdropColumns" :data="airdropData" :loading="airdropLoadingState"></Table>
		<div class="page">
			<Page :total="airdropTotal" :current="1" show-total @on-change="airdropChangePage"></Page>
		</div>
		<Modal
	        v-model="addAirdropShow"
	        title="新增空投"
	        @on-ok="addAirdropconfirm">
	        <Form :model="airdropFormItem" :label-width="100">
		        <FormItem label="数币名称:">
		            <Input v-model="airdropFormItem.coinName" placeholder="请输入数币名称"></Input>
		        </FormItem>
		        <FormItem label="奖励数量:">
		            <Input v-model="airdropFormItem.reward" placeholder="请输入奖励数量"></Input>
		        </FormItem>
		        <FormItem label="奖励类型:">
		            <Select v-model="airdropFormItem.getType">
						<Option value="1">新用户</Option>
						<Option value="2">社区</Option>
						<Option value="3">发款</Option>
						<Option value="4">KYC</Option>
						<Option value="5">其它</Option>
					</Select>
		        </FormItem>
		        <FormItem label="开始时间:">
		            <DatePicker type="date" placeholder="开始时间" v-model="airdropFormItem.validFromTime"></DatePicker>
		        </FormItem>
		        <FormItem label="结束时间:">
		            <DatePicker type="date" placeholder="结束时间" v-model="airdropFormItem.validToTime"></DatePicker>
		        </FormItem>
		        <FormItem label="空投描述:">
		            <Input v-model="airdropFormItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入空投描述"></Input>
		        </FormItem>
		        <FormItem label="空投入口:">
		            <Input v-model="airdropFormItem.entrance" placeholder="请输入空投入口"></Input>
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
						type: 'index',
						width: 60,
						fixed: 'left',
						align: 'center',
					},
					{
						title: 'uid',
						key: 'uid',
						width: 60
					},
                    {
                        title: '数币名称',
                        key: 'symbolName',
                        width: 100
                    },
                    {
                    	title: 'Logo',
                    	key: 'logoUrl',
                    	width: 80,
                    	render: (h,params) => {
                    		return h('Img', {
                    			attrs: {
                    				src: params.row.logoUrl,
                    				style: 'width: 30px;'
                    			}
                    		})
                    	}
                    },
                    {
                        title: '状态',
                        key: 'status',
                        width: 100,
                        render: (h,params) => {
                        	let status = params.row.status;
                        	switch(status){
                        		case 1: status = '没有ICO'; break;
                        		case 2: status = 'ICO进行中'; break;
                        		case 3: status = 'ICO结束'; break;
                        		case 4: status = '已上交易所'; break;
                        		default: break;
                        	}
                        	return h('div', status);
                        }
                    },
                   	{
                   		title: '流通量',
                   		key: 'circulatingSupply',
                   		width: 120
                   	},
                   	{
                   		title: '最大供应量',
                   		key: 'maxSupply',
                   		width: 120
                   	},
                   	{
                   		title: '总供应量',
                   		key: 'totalSupply',
                   		width: 120
                   	},
                    {
                    	title: '操作',
                    	key: 'action',
                    	width: 420,
                    	fixed: 'right',
                    	align: 'center',
                    	render: (h, params) => {
                    		return h('div', [
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
                                            this.airdropSearchType = 'coinId';
                                            this.airdropSearchContent = params.row.uid;
                                            this.loadAirdropList(1);
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
                                        	if (params.row.status == 4) {
                                        		this.$Notice.warning({ title: '已上交易所不能编辑' });
                                        	} else {
                                        		this.edit(params.index, params.row)
                                        	}
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
                total: 0,
                editCoinShow: false,
                modalType: '',
                currentUid: '',
                formItem: {
					symbolName: '',			
					nameEnUs: '',			
					nameZhCn: '',			
					status: '',			
					priceBtc: '',
					priceEth: '',
					price: '',
					introduction: '',		
					circulatingSupply: '',	
					totalSupply: '',		
					maxSupply: '',			
					logoUrl: ''				
				},
				airdropColumns: [
					{
						type: 'index',
						width: 60,
						fixed: 'left',
						align: 'center'
					},
					{
                        title: 'uid',
                        key: 'uid',
                        width: 60
                   },
                    {
                        title: '数币名称',
                        key: 'coinName',
                        width: 100
                    },
                    {
	                    title: '状态',
	                    key: 'onlineStatus',
	                    width: 130,
	                    render: (h, params) => {
	                        const row = params.row;
	                        const color = row.onlineStatus === 2 ? '#2db7f5' : row.onlineStatus === 3 ? '#f90' : '#ed3f14';
	                        const text = row.onlineStatus === 2 ? '测试中' : row.onlineStatus === 3 ? '已上线' : '已下线';
	
	                        return h('Tag', {
	                            props: {
	                                type: 'dot',
	                                color: color
	                            }
	                        }, text);
	                    }
	                },
                    {
                        title: '奖励类型',
                        key: 'getType',
                        width: 100
                    },
                    {
                        title: '空投详情',
                        width: 100,
                        render: (h, params) => {
	                        return h('Poptip', {
	                            props: {
	                                trigger: 'hover',
	                                content: params.row.description,
	                                placement: 'bottom'
	                            }
	                        }, [
	                            h('Tag', params.row.description)
	                        ]);
	                    }
                    },
                    {
                        title: '空投入口',
                        width: 100,
                        render: (h, params) => {
	                        return h('Poptip', {
	                            props: {
	                                trigger: 'hover',
	                                content: params.row.entrance,
	                                placement: 'bottom'
	                            }
	                        }, [
	                            h('Tag', params.row.entrance)
	                        ]);
	                    }
                    },
                    {
                        title: '空投奖励',
                        key: 'reward',
                        width: 100
                    },
                    {
                        title: '开始日期',
                        key: 'validFromTime',
                        width: 150
                    },
                    {
                        title: '结束日期',
                        key: 'validToTime',
                        width: 150
                    },
                    {
                    	title: '操作',
                    	key: 'action',
                    	width: 140,
                    	fixed: 'right',
                    	align: 'center',
                    	render: (h, params) => {
                    		return h('div', [
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
                                            let adminUuid = parseInt(localStorage.adminUuid);
                                            this.test(params.index, params.row.uid, adminUuid);
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
                                        	let adminUuid = parseInt(localStorage.adminUuid);
                                        	
                                        	if (params.row.onlineStatus == 3) {
                                        		this.offLine(params.index, params.row.uid, adminUuid);
                                        	} else {
                                        		this.onLine(params.index, params.row.uid, adminUuid);
                                        	}
                                        }
                                    }
                                }, params.row.onlineStatus == 3?'下线':'上线')
                            ]);
                    	}
                    }
				],
				airdropData: [],
				airdropSearchType: 'coinName',
				airdropSearchContent: '',
				airdropLoadingState: false,
				airdropTotal: 0,
				addAirdropShow: false,
				airdropFormItem: {
					coinName: '',		//数币名称
					reward: '',			//奖励数量
					getType: '',		//奖励类型
					validFromTime: '',	//开始时间
					validToTime: '',	//结束时间
				}
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
			/*分页*/
			changePage (page) {
           		this.loadList(page);
           	},
           	/*搜索*/
           	search () {
				this.loadList(1);
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
           	/*新增*/
           	add () {
				this.modalType = 'add';
				this.formItem = {
					symbolName: '',			
					nameEnUs: '',			
					nameZhCn: '',			
					status: '',
					priceBtc: '',
					priceEth: '',
					price: '',
					introduction: '',		
					circulatingSupply: '',	
					totalSupply: '',		
					maxSupply: '',			
					logoUrl: ''				
				};
				this.editCoinShow = true;
			},
            /*编辑*/
            edit (index, row) {
            	this.modalType = 'edit';
            	this.currentUid = row.uid;
            	for (let key in row) {
	        		for (let formKey in this.formItem) {
	        			if (key == formKey) {
	        				this.formItem[formKey] = row[key] + '';
	        			}
	        		}
	        	}
            	this.editCoinShow = true;
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
            handleConfirm () {
            	let modalType = this.modalType;
            	if (modalType == 'add') {
            		this.addConfirm();
            	} else if (modalType == 'edit') {
            		this.editConfirm();
            	}
            },
			addConfirm () {
				this.loadingState = true;
            	this.formItem['adminUuid'] = localStorage.adminUuid;
                    	
            	this.$axios.post('coin/add', qs.stringify(this.formItem), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
            	.then((response) => {
            		if (response.data.result == 'success') {
                        this.$Notice.success({ title: '操作成功' });
                        this.loadList(1);
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
            editConfirm () {
            	this.loadingState = true;
            	this.formItem['uid'] = this.currentUid;
            	this.formItem['adminUuid'] = localStorage.adminUuid;
            	
            	this.$axios.post('coin/update', qs.stringify(this.formItem), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
            	.then((response) => {
            		if (response.data.result == 'success') {
                        this.$Notice.success({ title: '操作成功' });
                        this.loadList(1);
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
            /*
             	空投相关方法
             * */
            /*处理数据*/
			handleData () {
				this.airdropData.forEach((item, index) => {
					item.coinName = item.coin.symbolName;
					item.validFromTime = this.formatDate(item.validFromTime);
					item.validToTime = this.formatDate(item.validToTime);
					switch(item.getType)
					{
						case 1:
							item.getType = '新用户';
							break;
						case 2:
							item.getType = '社区';
							break;
						case 3:
							item.getType = '发款';
							break;
						case 4:
							item.getType = 'KYC';
							break;
						case 5:
							item.getType = '其它';
							break;
						default:
							break;
					}
				})
			},
			/*分页*/
           	airdropChangePage (page) {
           		this.loadAirdropList(page);
           	},
           	/*获取空投列表*/
           	loadAirdropList (page) {
           		this.airdropLoadingState = true;
           		let parameter = { page: page, pageSize: 10 };
           		let airdropSearchContent = this.airdropSearchContent;
	        	if (airdropSearchContent != '') {
	        		switch(airdropSearchContent)
	        		{
	        			case '新用户': parameter[this.airdropSearchType] = 1; break;
	        			case '社区': parameter[this.airdropSearchType] = 2; break;
	        			case '发款': parameter[this.airdropSearchType] = 3; break;
	        			case 'KYC': parameter[this.airdropSearchType] = 4; break;
	        			case '其它': parameter[this.airdropSearchType] = 5; break;
	        			default: parameter[this.airdropSearchType] = this.airdropSearchContent; break;
	        		}
           		}
           		this.$axios.post('user/airdrop/list', qs.stringify(parameter),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.airdropData = response.data.data.rows;
						this.airdropTotal = response.data.data.records;
						this.handleData();
					} else {
						this.$Notice.error({ title: response.data.message });
					}
					this.airdropLoadingState = false;
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.airdropLoadingState = false;
	        	})
           	},
           	/*添加空投*/
           	addAirdrop () {
           		this.airdropFormItem = {
           			coinName: '',
					reward: '',
					getType: '',
					validFromTime: '',
					validToTime: ''
           		}
				this.addAirdropShow = true;
			},
			/*确认添加*/
			addAirdropconfirm () {
            	this.airdropFormItem['adminUuid'] = localStorage.adminUuid;
            	this.airdropFormItem.validFromTime = new Date(this.airdropFormItem.validFromTime).getTime();
            	this.airdropFormItem.validToTime = new Date(this.airdropFormItem.validToTime).getTime();
            	
            	this.$axios.post('user/add/airdrop', qs.stringify(this.airdropFormItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
						this.loadAirdropList(1);
					} else {
						this.airdropLoadingState = false;
						this.$Notice.error({ title: response.data.message });
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.airdropLoadingState = false;
	        	})
			},
			/*搜索*/
			airdropSearch () {
				this.loadAirdropList(1);
			},
			/*下线*/
			offLine (index, airdropId, adminUuid) {
				this.$Modal.confirm({
                    content: `确认下线该空投吗?`,
                    onOk: () => {
                    	this.airdropLoadingState = true;
		           		this.$axios.post('user/airdrop/remove', qs.stringify({ airdropId: airdropId, adminUuid: adminUuid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.airdropData[index].onlineStatus = 9;
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: '操作失败' });
							}
							this.airdropLoadingState = false;
			        	})
			        	.catch((error) => {
			        		console.log(error);
			        		this.airdropLoadingState = false;
			        	})
                    }
                });
			},
			/*上线*/
			onLine (index, airdropId, adminUuid) {
				this.$Modal.confirm({
                    content: `确认上线该空投吗?`,
                    onOk: () => {
                    	this.airdropLoadingState = true;
		           		this.$axios.post('user/airdrop/online', qs.stringify({ airdropId: airdropId, adminUuid: adminUuid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.airdropData[index].onlineStatus = 3;
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: response.data.message });
							}
							this.airdropLoadingState = false;
			        	})
			        	.catch((error) => {
			        		console.log(error);
			        		this.airdropLoadingState = false;
			        	})
                    }
                });
			},
			/*测试*/
			test (index, airdropId, adminUuid) {
				this.$Modal.confirm({
                    content: `确认将该空投改为测试状态吗?`,
                    onOk: () => {
                    	this.airdropLoadingState = true;
		           		this.$axios.post('user/airdrop/testing', qs.stringify({ airdropId: airdropId, adminUuid: adminUuid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.airdropData[index].onlineStatus = 2;
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: response.data.message });
							}
							this.airdropLoadingState = false;
			        	})
			        	.catch((error) => {
			        		console.log(error);
			        		this.airdropLoadingState = false;
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
		mounted () {
			this.loadList(1);
			this.loadAirdropList(1);
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
	.text-center {
		text-align: center;
	}
</style>