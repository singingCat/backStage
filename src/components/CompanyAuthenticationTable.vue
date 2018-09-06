<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="add">新增</Button>
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的内容">
				<Select v-model="searchType" slot="prepend" style="width: 90px">
		            <Option value="">企业名称</Option>
		            <Option value="">企业项目名称</Option>
		        </Select>
				<Button slot="append" icon="md-search" @click="search"></Button>
			</Input>
		</ButtonGroup>
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
		<div class="page">
			<Page :total="total" :current="1" show-total @on-change="changePage"></Page>
		</div>
		<Modal
	        v-model="showEdit"
	        title="修改"
	        @on-ok="editConfirm">
	        <Form :model="formItem" :label-width="100">
	        	<FormItem label="企业名称:">
		            <Input v-model="formItem.name" placeholder="请输入企业名称"></Input>
		        </FormItem>
		        <FormItem label="企业项目名称:">
		            <Input v-model="formItem.projectName" placeholder="请输入企业项目名称"></Input>
		        </FormItem>
		        <FormItem label="微信:">
		            <Input v-model="formItem.wechat" placeholder="请输入微信"></Input>
		        </FormItem>
		        <FormItem label="手机号:">
		            <Input v-model="formItem.phone" placeholder="请输入手机号"></Input>
		        </FormItem>
		        <FormItem label="邮箱:">
		            <Input v-model="formItem.email" placeholder="请输入邮箱"></Input>
		        </FormItem>
		        <FormItem label="官网:">
		            <Input v-model="formItem.website" placeholder="请输入官网"></Input>
		        </FormItem>
	        </Form>
	    </Modal>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				columns: [
					{
						title: 'uid',
						key: 'uid',
						width: 80
					},
					{
						title: 'uuid',
						key: '',
						width: 100
					},
					{
						title: '企业名称',
						key: '',
						width: 100
					},
					{
						title: '企业项目名称',
						key: '',
						width: 100
					},
					{
						title: 'insight账号昵称',
						key: '',
						width: 100
					},
					{
						title: '通过时间',
						key: '',
						width: 100
					},
					{
						title: '微信',
						key: '',
						width: 150
					},
					{
						title: '手机号',
						key: '',
						width: 150
					},
					{
						title: '邮箱',
						key: '',
						width: 100
					},
					{
						title: '官网',
						key: '',
						width: 100
					},
					{
						title: '剩余INB数量',
						key: '',
						width: 100
					},
					{
						title: '审核人',
						key: '',
						width: 100
					},
					{
						title: '操作',
						width: 240,
						fixed: 'right',
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
                                }, '审核资料'),
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
                                        	this.showEdit = true;
                                        }
                                    }
                                }, '修改'),
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
                                }, params.row.onlineStatus == 3?'取消认证':'通过认证')
							]);
						}
					}
				],
				searchType: '',
				searchContent: '',
				loadingState: false,
				total: '',
				data: [{uid: 1}],
				showEdit: false,
				formItem: {
					name: '',
					projectName: '',
					wechat: '',
					phone: '',
					email: '',
					website: ''
				},
			}
		},
		methods: {
			loadList (page) {
				
			},
			search () {
				this.loadList(1);
			},
			changePage (page) {
				this.loadList(page);
			},
			editConfirm () {
				
			},
			onLine (index, uid) {
				
			},
			offLine (index, uid) {
				
			},
			add () {
				
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
		width: 290px;
		margin-right: 20px;
	}
	.page {
		float: right;
		margin-top: 20px;
	}
</style>