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
                                            
                                        }
                                    }
                                }, '认证资料')
                            ]);
                    	}
                    }
                ],
                data: [
	                {
	                	uuid: 123456,
	                	nickName: 'name',
	                	type: 1,
	                	createdTime: '2018-01-01'
	                }
                ],					//渲染的数据
                loadingState: false,		//表格读取状态
                total: 0,					//查询出的数据总条数
                defaultType: '1',			//默认搜索的全部
				searchType: 'uuid',			//搜索类型
				searchContent: '',			//搜索的内容
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
</style>