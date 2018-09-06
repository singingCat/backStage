<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="add">新增</Button>
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的名称">
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
	        	<FormItem label="banner名称:">
		            <Input v-model="formItem.name" placeholder="请输入banner名称"></Input>
		        </FormItem>
		        <FormItem label="类型:">
		            <Select v-model="formItem.type">
		            	<Option value="1">开屏</Option>
		            	<Option value="2">banner位</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="开始显示时间:">
		            <DatePicker type="date" placeholder="开始显示时间" v-model="formItem.validFromTime"></DatePicker>
		        </FormItem>
		        <FormItem label="结束显示时间:">
		            <DatePicker type="date" placeholder="结束显示时间" v-model="formItem.validToTime"></DatePicker>
		        </FormItem>
		        <FormItem label="上线时间:">
		            <DatePicker type="date" placeholder="上线时间" v-model="formItem.onlineTime"></DatePicker>
		        </FormItem>
		        <FormItem label="创建时间:">
		            <DatePicker type="date" placeholder="创建时间" v-model="formItem.createTime"></DatePicker>
		        </FormItem>
		        <FormItem label="是否可以跳过:">
		            <RadioGroup v-model="formItem.whetherToSkip">
				        <Radio label="1">是</Radio>
				        <Radio label="2">否</Radio>
				    </RadioGroup>
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
						title: 'banner名称',
						key: '',
						width: 100
					},
					{
						title: '状态',
						key: '',
						width: 100
					},
					{
						title: '类型',
						key: '',
						width: 100
					},
					{
						title: 'banner图片',
						key: '',
						width: 100
					},
					{
						title: '开始显示时间',
						key: '',
						width: 150
					},
					{
						title: '结束显示时间',
						key: '',
						width: 150
					},
					{
						title: '上线时间',
						key: '',
						width: 100
					},
					{
						title: '创建时间',
						key: '',
						width: 100
					},
					{
						title: '是否可以跳过',
						key: '',
						width: 100
					},
					{
						title: '操作',
						width: 240,
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
                                        	this.showEdit = true;
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
		width: 200px;
		margin-right: 20px;
	}
	.page {
		float: right;
		margin-top: 20px;
	}
</style>