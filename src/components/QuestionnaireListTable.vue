<template>
	<div>
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
	                    title: '问卷名称',
	                    key: 'name'
	                },
	                {
	                	title: '发起人',
	                    key: 'publisher'
	                },
	                {
	                	title: '开始时间',
	                    key: 'validFromTime'
	                },
	                {
	                	title: '结束时间',
	                    key: 'validToTime'
	                },
	                {
	                	title: '奖励INB',
	                    key: 'rewardInb'
	                },
	                {
	                	title: '剩余',
	                    key: 'surplus'
	                },
	                {
                    	title: '操作',
                    	key: 'action',
                    	width: 180,
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
                                            this.toCompletedList(params.row.uid, params.row.questions);
                                        }
                                    }
                                }, '已完成'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.toQuestionShow(params.row.uid, params.row.questions);
                                        }
                                    }
                                }, '问卷详情')
                            ]);
                    	}
                    }
                ],
                data: [],
                loadingState: false,	//表格读取状态
                total: 0
			}
		},
		methods: {
			/*获取列表*/
           	loadList (page) {
           		this.loadingState = true;
           		this.$axios.post('user/questionnaire/lists', qs.stringify({ page: page, pageSize: 10 }), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if (response.data.isSuccessful) {
						this.data = response.data.data.rows;
						this.total = response.data.data.total;
						this.handleData();
						this.loadingState = false;
					}
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
			/*进入已完成列表*/
			toCompletedList (uid, questions) {
				this.$router.push({ path: 'completedList/' + uid, query: { questions: questions } });
			},
			/*进入问题显示页*/
			toQuestionShow (uid, questions) {
				this.$router.push({ path: 'questionShow/' + uid, query: { questions: questions } });
			},
			/*数据处理*/
			handleData () {
				this.data.forEach((item, index) => {
					item.publisher = item.publishUser.nickName;
					item.validFromTime = this.formatDate(item.validFromTime);
					item.validToTime = this.formatDate(item.validToTime);
					item.surplus = item.doneNumber + '/' + item.totalNumber;
				});
			},
			/*时间格式化*/
			formatDate (timestamp) {
				let date = new Date(timestamp);
		        let Y = date.getFullYear() + '-';
		        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		        let D = (	date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
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
	.page {
		float: right;
		margin-top: 20px;
	}
</style>