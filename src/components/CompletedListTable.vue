<template>
	<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
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
	                    key: 'userUuid'
	                },
	                {
	                    title: '用户名',
	                    key: 'nickName'
	                },
	                {
	                	title: '完成时间',
	                    key: 'answerTime'
	                },
	                {
	                	title: '奖励INB',
	                    key: 'rewardInb'
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
                                            this.toCompletedDetail(params.row.uid, params.row.userQuestionAnswers);
                                        }
                                    }
                                }, '查看详情')
                            ]);
                    	}
                    }
                ],
                data: [],
                loadingState: false,	//表格读取状态
                total: 0,
                
			}
		},
		methods: {
			/*获取列表*/
           	loadList (page) {
           		this.loadingState = true;
           		this.$axios.post('user/userQuestionnaire/lists', qs.stringify({ page: page, pageSize: 10, questionnaireId: this.$route.params.id }), 
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
           	/*数据处理*/
			handleData () {
				this.data.forEach((item, index) => {
					item.userUuid = item.user.uuid;
					item.nickName = item.user.nickName;
					item.answerTime = this.formatDate(item.answerTime);
				});
			},
			/*查看详情*/
           	toCompletedDetail (uid, userQuestionAnswers) {
           		this.$router.push({ path: '../completedDetail/' + uid, query: { questions: this.$route.query.questions, userQuestionAnswers: userQuestionAnswers } });
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

<style>
</style>