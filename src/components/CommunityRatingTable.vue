<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的内容">
				<Select v-model="searchType" slot="prepend" style="width: 90px">
					<Option value="">发起人uuid</Option>
		            <Option value="">项目方名称</Option>
		            <Option value="">项目方账号</Option>
		            <Option value="">数币缩写</Option>
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
	        	<FormItem label="项目方名称+数币缩写:">
		            <Input v-model="formItem.symbolName" placeholder="请输入项目方名称+数币缩写"></Input>
		        </FormItem>
		        <FormItem label="开始时间:">
		            <DatePicker type="date" placeholder="开始时间" v-model="formItem.validFromTime"></DatePicker>
		        </FormItem>
		        <FormItem label="结束时间:">
		            <DatePicker type="date" placeholder="结束时间" v-model="formItem.validToTime"></DatePicker>
		        </FormItem>
		        <FormItem label="期数:">
		            <Input v-model="formItem.symbolName" placeholder="请输入项目方名称+数币缩写"></Input>
		        </FormItem>
		        <FormItem label="完成奖励:">
		            <Input v-model="formItem.symbolName" placeholder="请输入完成奖励"></Input>
		        </FormItem>
		        <FormItem label="最大参与人数:">
		            <Input v-model="formItem.symbolName" placeholder="请输入最大参与人数"></Input>
		        </FormItem>
		        <FormItem label="最小参与人数:">
		            <Input v-model="formItem.symbolName" placeholder="请输入最小参与人数"></Input>
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
						title: '发起人uuid',
						key: '',
						width: 100
					},
					{
						title: '项目方logo',
						key: '',
						width: 100
					},
					{
						title: '项目方名称+数币缩写',
						key: '',
						width: 100
					},
					{
						title: '项目方insight账号',
						key: '',
						width: 100
					},
					{
						title: '期数',
						key: '',
						width: 100
					},
					{
						title: '完成奖励',
						key: '',
						width: 100
					},
					{
						title: '开始时间',
						key: '',
						width: 150
					},
					{
						title: '结束时间',
						key: '',
						width: 150
					},
					{
						title: '剩余INB数量',
						key: '',
						width: 100
					},
					{
						title: '期望交易所',
						key: '',
						width: 100
					},
					{
						title: '微信',
						key: '',
						width: 100
					},
					{
						title: '手机号',
						key: '',
						width: 100
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
						title: '总参与人数',
						key: '',
						width: 100
					},
					{
						title: '最大参与人数',
						key: '',
						width: 100
					},
					{
						title: '最小参与人数',
						key: '',
						width: 100
					},
					{
						title: '操作',
						width: 200,
						align: 'center',
						fixed: 'right',
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
                                            this.showEdit = true;
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
				searchType: '',
				searchContent: '',
				loadingState: false,
				total: '',
				data: [{uid: 1}],
				showEdit: false,
				formItem: {
					
				}
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
	}
	.page {
		float: right;
		margin-top: 20px;
	}
</style>