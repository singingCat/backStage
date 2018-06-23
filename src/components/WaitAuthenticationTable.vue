<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Select size="small" class="selectType" v-model="defaultType" @on-change="typeChange(defaultType)">
				<Option value="1">全部</Option>
				<Option value="2">个人</Option>
				<Option value="3">分析师</Option>
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
	        <P>姓名: {{currentAuthData.nickName}}</P>
	        <P>姓名: {{currentAuthData.nickName}}</P>
	        <P>姓名: {{currentAuthData.nickName}}</P>
	        <P>姓名: {{currentAuthData.nickName}}</P>
	        <P>图片: </P>
	        <div class="pictures">
	        	<a v-for="item in currentAuthData.imgs" :href="item" target="_blank"><img :src="item"/></a>
	        </div>
	    </Modal>
		<Modal
	        v-model="showRefuseReason"
	        title="请选择拒绝原因"
	        @on-ok="refuseAuthentication">
	        <p>拒绝原因:</p>
	        <Select v-model="refuseReason">
	        	<Option value="1">信息不全</Option>
	        	<Option value="2">此身份证号码已被占用</Option>
	        	<Option value="3">此手机号码已被占用</Option>
	        	<Option value="4">证件信息不清晰</Option>
	        	<Option value="5">证件信息错误</Option>
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
						type: 'index',
						width: 60,
						align: 'center'
					},
					{
                        title: 'uuid',
                        key: 'uuid'
                   },
                    {
                        title: '用户名',
                        key: 'nickName'
                    },
                    {
                        title: '申请认证类别',
                        key: 'type'
                    },
                    {
                        title: '申请时间',
                        key: 'createdTime'
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
                                            let type = params.row.type;
                                            let index = params.index;
                                            if (type == 1) {
                                            	//this.checkPersonal(index);
                                            	this.currentAuthData = params.row;
                                            	this.showAuthData = true;
                                            } else if (type == 2) {
                                            	this.checkAnalyst(index);
                                            }
                                        }
                                    }
                                }, '认证资料'),
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
                                            this.passAuthentication(params.index);
                                        }
                                    }
                                }, '通过验证'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.showRefuseReason = true;
                                        }
                                    }
                                }, '拒绝认证')
                            ]);
                    	}
                    }
                ],
                data: [
	                {
	                	uuid: 123456,
	                	nickName: 'name',
	                	type: 1,
	                	createdTime: '2018-01-01',
	                	imgs: [
	                		'https://i.loli.net/2017/08/21/599a521472424.jpg',
	                		'https://i.loli.net/2017/08/21/599a521472424.jpg',
	                		'https://i.loli.net/2017/08/21/599a521472424.jpg',
	                		'https://i.loli.net/2017/08/21/599a521472424.jpg',
	                		'https://i.loli.net/2017/08/21/599a521472424.jpg'
	                	]
	                },
	                {
	                	uuid: 123456,
	                	nickName: 'name',
	                	type: 2,
	                	createdTime: '2018-01-01',
	                	imgs: [
	                		'https://i.loli.net/2017/08/21/599a521472424.jpg',
	                		'https://i.loli.net/2017/08/21/599a521472424.jpg',
	                		'https://i.loli.net/2017/08/21/599a521472424.jpg',
	                		'https://i.loli.net/2017/08/21/599a521472424.jpg'
	                	]
	                }
                ],					//渲染的数据
                loadingState: false,		//表格读取状态
                total: 0,					//查询出的数据总条数
                defaultType: '1',			//默认搜索的全部
				searchType: 'uuid',			//搜索类型
				searchContent: '',			//搜索的内容
				showRefuseReason: false,	//显示拒绝弹窗
				refuseReason: '1',			//拒绝原因
				showAuthData: false,		//显示认证资料
				currentAuthData: ''			//当前认证资料
			}
		},
		methods: {
            /*分页*/
           	changePage (page) {
           		this.loadList(page);
           	},
           	/*获取列表*/
           	loadList (page) {
           		
           	},
           	/*筛选*/
			typeChange (defaultType) {
				console.log(defaultType);
			},
			/*搜索*/
			search () {
				
			},
			/*查看个人申请资料*/
			checkPersonal (index) {
				this.$Modal.success({
                    title: `${this.data[index].userName}的认证资料`,
                    content: `姓名：${this.data[index].name}<br>
                    		国家：${this.data[index].country}<br>
                    		手机号码：${this.data[index].phoneNubmer}<br>
                    		身份证号码：${this.data[index].IDCard}<br>
                    		证件照: <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" style="width: 100%;">`
                })
			},
			/*查看分析师申请资料*/
			checkAnalyst (index) {
				alert('分析师');
			},
			/*通过验证*/
			passAuthentication (index) {
				this.$Modal.confirm({
                    content: `确认通过昵称为${this.data[index].nickName}用户的验证吗?`,
                    onOk: () => {
                    	
                    }
                });
			},
			/*拒绝认证*/
			refuseAuthentication () {
				alert(this.refuseReason);
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
		margin-right: 20px;
	}
</style>