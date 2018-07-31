<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="questionnaireAdd">新增问卷</Button>
		</ButtonGroup>
		<Table border highlight-row :columns="columns" :data="data" :loading="loadingState" @on-current-change="changeQuestionnaire"></Table>
		<div style="width: 100%;">
			<div class="page">
				<Page :total="total" :current="1" show-total @on-change="changePage"></Page>
			</div>
		</div>
		<div class="text-center" style="margin-top: 100px">问题列表</div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="questionAdd">新增问题</Button>
		</ButtonGroup>
		<Table border highlight-row :columns="questionColumns" :data="questionData" :loading="questionLoadingState" @on-current-change="changequestion"></Table>
		<div class="text-center" style="margin-top: 50px">选项列表</div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="optionAdd">新增选项</Button>
		</ButtonGroup>
		<Table border :columns="optionColumns" :data="optionData" :loading="optionLoadingState"></Table>
		<Modal
	        v-model="addQuestionnaireShow"
	        title="新增问卷"
	        @on-ok="addQuestionnaireConfirm">
	        <Form :model="questionnaireItem" :label-width="100">
		        <FormItem label="问卷名称:">
		            <Input v-model="questionnaireItem.name" placeholder="请输入问卷名称"></Input>
		        </FormItem>
		        <FormItem label="创建人uuid:">
		            <Input v-model="questionnaireItem.founderUuid" placeholder="请输入创建人uuid"></Input>
		        </FormItem>
		        <FormItem label="描述:">
		            <Input v-model="questionnaireItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述"></Input>
		        </FormItem>
		        <FormItem label="类型:">
		            <Select v-model="questionnaireItem.type">
		            	<Option value="1">用户调研</Option>
		            	<Option value="2">企业问询</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="币种(选填):">
		            <Input v-model="questionnaireItem.coinName" placeholder="请输入币种"></Input>
		        </FormItem>
		        <FormItem label="开始时间:">
		            <DatePicker type="date" placeholder="开始时间" v-model="questionnaireItem.validFromTime"></DatePicker>
		        </FormItem>
		        <FormItem label="结束时间:">
		            <DatePicker type="date" placeholder="结束时间" v-model="questionnaireItem.validToTime"></DatePicker>
		        </FormItem>
		        <FormItem label="奖励INB:">
		            <Input v-model="questionnaireItem.rewardInb" placeholder="请输入奖励INB"></Input>
		        </FormItem>
		        <FormItem label="总数:">
		            <Input v-model="questionnaireItem.totalNumber" placeholder="请输入总数"></Input>
		        </FormItem>
		        <FormItem label="reportID(选填):">
		            <Input v-model="questionnaireItem.reportId" placeholder="请输入所在报告ID"></Input>
		        </FormItem>
			</Form>
	    </Modal>
	    <Modal
	        v-model="editQuestionnaireShow"
	        title="编辑问卷"
	        @on-ok="editQuestionnaireConfirm">
	        <Form :model="questionnaireItem" :label-width="100">
		        <FormItem label="问卷名称:">
		            <Input v-model="questionnaireItem.name" placeholder="请输入问卷名称"></Input>
		        </FormItem>
		        <FormItem label="创建人uuid:">
		            <Input v-model="questionnaireItem.founderUuid" placeholder="请输入创建人uuid"></Input>
		        </FormItem>
		        <FormItem label="描述:">
		            <Input v-model="questionnaireItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述"></Input>
		        </FormItem>
		        <FormItem label="类型:">
		            <Select v-model="questionnaireItem.type">
		            	<Option value="1">用户调研</Option>
		            	<Option value="2">企业问询</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="币种(选填):">
		            <Input v-model="questionnaireItem.coinName" placeholder="请输入币种"></Input>
		        </FormItem>
		        <FormItem label="开始时间:">
		            <DatePicker type="date" placeholder="开始时间" v-model="questionnaireItem.validFromTime"></DatePicker>
		        </FormItem>
		        <FormItem label="结束时间:">
		            <DatePicker type="date" placeholder="结束时间" v-model="questionnaireItem.validToTime"></DatePicker>
		        </FormItem>
		        <FormItem label="奖励INB:">
		            <Input v-model="questionnaireItem.rewardInb" placeholder="请输入奖励INB"></Input>
		        </FormItem>
		        <FormItem label="总数:">
		            <Input v-model="questionnaireItem.totalNumber" placeholder="请输入总数"></Input>
		        </FormItem>
		        <FormItem label="reportID(选填):">
		            <Input v-model="questionnaireItem.reportId" placeholder="请输入所在报告ID"></Input>
		        </FormItem>
			</Form>
	    </Modal>
		<Modal
	        v-model="addQuestionShow"
	        title="新增问题"
	        @on-ok="addQuestionConfirm">
	        <p style="margin-bottom: 20px;">问卷名: {{currentQuestionnaire}}</p>
	        <p>问题名称:</p>
	        <Input v-model="questionName"></Input>
	        <p>类型:</p>
	        <Select v-model="questionType">
	        	<Option value="1">单选</Option>
	        	<Option value="2">多选</Option>
	        	<Option value="3">填空</Option>
	        </Select>
	        <p>排序:</p>
	        <Input v-model="questionOrder"></Input>
	    </Modal>
		<Modal
	        v-model="editQuestionShow"
	        title="编辑问题"
	        @on-ok="editQuestionConfirm">
	        <p>问题名称:</p>
	        <Input v-model="questionName"></Input>
	        <p>类型:</p>
	        <Select v-model="questionType">
	        	<Option value="1">单选</Option>
	        	<Option value="2">多选</Option>
	        	<Option value="3">填空</Option>
	        </Select>
	        <p>排序:</p>
	        <Input v-model="questionOrder"></Input>
	    </Modal>
	    <Modal
	        v-model="addOptionShow"
	        title="新增选项"
	        @on-ok="addOptionConfirm">
	        <p style="margin-bottom: 20px;">问题名: {{currentQuestion}}</p>
	        <p>选项名称:</p>
	        <Input v-model="optionName"></Input>
	        <p>排序:</p>
	        <Input v-model="optionOrder"></Input>
	    </Modal>
	    <Modal
	        v-model="editOptionShow"
	        title="编辑选项"
	        @on-ok="editOptionConfirm">
	        <p>选项名称:</p>
	        <Input v-model="optionName"></Input>
	        <p>排序:</p>
	        <Input v-model="optionOrder"></Input>
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
	                    width: 60
	                },
	                {
	                    title: '问卷名称',
	                    key: 'name',
	                    width: 200
	                },
	                {
	                    title: '创建人uuid',
	                    width: 150,
	                    render: (h, params) => {
	                    	return h('div', params.row.publishUser.uuid);
	                    }
	                },
	                {
	                	title: '发起人',
	                    key: 'publisher',
	                    width: 150
	                },
	                {
	                	title: '管理员昵称',
	                    width: 150,
	                    render: (h, params) => {
	                    	let nickName = '';
	                    	if (params.row.adminUser) {
	                    		nickName = params.row.adminUser.nickName;
	                    	}
	                    	return h('div', nickName);
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
	                	title: '币种',
	                    key: 'coinName',
	                    width: 80,
	                    render: (h, params) => {
	                    	if (params.row.coin) {
	                    		return h('div', params.row.coin.symbolName);
	                    	} else {
	                    		return h('div', '');
	                    	}
	                    }
	                },
	                {
	                	title: '开始时间',
	                    key: 'validFromTime',
	                    width: 150
	                },
	                {
	                	title: '结束时间',
	                    key: 'validToTime',
	                    width: 150
	                },
	                {
	                	title: '奖励INB',
	                    key: 'rewardInb',
	                    width: 100
	                },
	                {
	                	title: '剩余',
	                    key: 'surplus',
	                    width: 80
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
                                            this.toCompletedList(params.row.uid, params.row.questions);
                                        }
                                    }
                                }, '已完成'),
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
                                            //this.toQuestionShow(params.row.uid, params.row.questions);
                                            console.log(params.row.questions);
                                        }
                                    }
                                }, '问卷详情'),
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
                                            this.editQuestionnaire(params.row);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: params.row.onlineStatus == 3?'error':'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                        	let adminUuid = parseInt(localStorage.adminUuid);
                                        	
                                        	if (params.row.onlineStatus == 3) {
                                        		this.offLineQuestionnaire(params.index, params.row.uid, adminUuid);
                                        	} else {
                                        		this.onLineQuestionnaire(params.index, params.row.uid, adminUuid);
                                        	}
                                        }
                                    }
                                }, params.row.onlineStatus == 3?'下线':'上线')
                            ]);
                    	}
                    }
                ],
                data: [],
                loadingState: false,	//表格读取状态
                total: 0,
                questionnaireItem: {
					name: '',			//问卷名称
					founderUuid: '',	//创建人uuid
					description: '',	//描述
					type: '',			//类型
					coinName: '',		//币种
					validFromTime: '',	//开始时间
					validToTime: '',	//结束时间
					rewardInb: '',		//奖励INB
					totalNumber: '',	//总数
					reportId: ''		//所在报告ID
				},
                questionColumns: [
					{
	                    title: 'uid',
	                    key: 'uid'
	                },
	                {
	                    title: '问题名称',
	                    key: 'title'
	                },
	                {
	                	title: '类型',
                        key: 'optionType',
                        render: (h, params) => {
                        	let optionType = params.row.optionType;
                        	switch(optionType){
                        		case 1: optionType = '单选'; break;
                        		case 2: optionType = '多选'; break;
                        		case 3: optionType = '填空'; break;
                        		default: break;
                        	}
                        	return h('div', optionType);
                        }
	                },
	                {
	                    title: '排序',
	                    key: 'showOrder'
	                },
	                {
                    	title: '操作',
                    	key: 'action',
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
                                        	this.questionName = params.row.title;
                                        	this.questionType = params.row.optionType + '';
                                        	this.questionOrder = params.row.showOrder;
                                            this.editQuestionShow = true;
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
                                            this.removeQuestion(params.index, params.row.uid);
                                        }
                                    }
                                }, '删除')
                            ]);
                    	}
                    }
                ],
                questionData: [],
                questionLoadingState: false,
                optionColumns: [
					{
	                    title: 'uid',
	                    key: 'uid'
	                },
	                {
	                    title: '选项名称',
	                    key: 'content'
	                },
	                {
	                    title: '排序',
	                    key: 'showOrder'
	                },
	                {
                    	title: '操作',
                    	key: 'action',
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
                                        	this.currentOptionUid = params.row.uid;
                                        	this.optionName = params.row.content;
                                        	this.optionOrder = params.row.showOrder;
                                            this.editOptionShow = true;
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
                                            this.removeOption(params.index, params.row.uid);
                                        }
                                    }
                                }, '删除')
                            ]);
                    	}
                    }
                ],
                optionData: [],
                optionLoadingState: false,
                addQuestionnaireShow: false,
                addQuestionShow: false,
                addOptionShow: false,
                editQuestionnaireShow: false,
                editQuestionShow: false,
                editOptionShow: false,
                questionnaireId: '',
                questionUid: '',
                questionName: '',
                questionType: '',
                questionOrder: '',
                optionName: '',
                optionOrder: '',
                currentQuestionType: '',
                currentOptionUid: '',
                currentQuestionnaire: '',
                currentQuestion: ''
			}
		},
		methods: {
			/*获取问卷列表*/
           	loadList (page) {
           		this.loadingState = true;
           		this.$axios.post('user/questionnaire/lists', qs.stringify({ page: page, pageSize: 10 }), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if (response.data.isSuccessful) {
						this.data = response.data.data.rows;
						this.total = response.data.data.records;
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
			},
			/*点击问卷*/
			changeQuestionnaire (currentRow, oldCurrentRow) {	//currentRow:当前行数据;oldCurrentRow:上一条数据
				let questionnaireId = currentRow.uid;
				this.questionnaireId = questionnaireId;
				this.questionUid = '';
				this.currentQuestionType = '';
				this.currentQuestionnaire = currentRow.name;
				this.loadQuestionList(questionnaireId);
			},
			/*点击问题*/
			changequestion (currentRow, oldCurrentRow) {
				let questionId = currentRow.uid
				this.questionUid = questionId;
				this.currentQuestionType = currentRow.optionType;
				this.currentQuestion = currentRow.title;
				this.loadOptionList(questionId);
			},
			/*获取问题列表*/
			loadQuestionList (questionnaireId) {
				this.questionLoadingState = true;
				this.$axios.get('user/question/list?questionnaireId=' + questionnaireId)
				.then((response) => {
					if (response.data.isSuccessful) {
						this.optionData = [];
						this.questionData = response.data.data;
						this.questionLoadingState = false;
					}
	        	})
	        	.catch((error) => {
	        		this.questionLoadingState = false;
	        	})
			},
			/*获取选项列表*/
			loadOptionList (questionId) {
				this.optionLoadingState = true;
				this.$axios.get('user/option/list?questionId=' + questionId)
				.then((response) => {
					if (response.data.isSuccessful) {
						this.optionData = response.data.data;
						this.optionLoadingState = false;
					}
	        	})
	        	.catch((error) => {
	        		this.optionLoadingState = false;
	        	})
			},
			/*新增问卷*/
           	questionnaireAdd () {
           		this.questionnaireItem = {
           			name: '',
           			founderUuid: '',
					description: '',
					type: '',
					coinName: '',
					validFromTime: '',
					validToTime: '',
					rewardInb: '',
					totalNumber: '',
					reportId: ''
           		}
           		this.addQuestionnaireShow = true;
           	},
           	/*编辑问卷*/
           	editQuestionnaire (row) {
           		let coinName = '';
           		if (row.coin) {
           			coinName = row.coin.symbolName;
           		}
           		this.questionnaireItem = {
           			name: row.name,
           			founderUuid: row.publishUser.uuid,
					description: row.description,
					coinName: coinName,
					type: row.type + '',
					validFromTime: row.validFromTime,
					validToTime: row.validToTime,
					rewardInb: row.rewardInb,
					totalNumber: row.totalNumber,
					reportId: row.reportId
           		}
           		this.editQuestionnaireShow = true;
           	},
           	/*编辑问卷确认*/
           	editQuestionnaireConfirm () {
           		this.loadingState = true;
				this.questionnaireItem['adminUuid'] = localStorage.adminUuid;
				this.questionnaireItem['uid'] = this.questionnaireId;
            	this.questionnaireItem.validFromTime = parseInt(new Date(this.questionnaireItem.validFromTime).getTime());
            	this.questionnaireItem.validToTime = parseInt(new Date(this.questionnaireItem.validToTime).getTime());
            	
            	this.$axios.post('user/questionnaire/update', qs.stringify(this.questionnaireItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
						this.loadList(1);
					} else {
						this.$Notice.error({ title: response.data.message });
						this.loadingState = false;
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.loadingState = false;
	        	})
           	},
			/*新增问题*/
			questionAdd () {
				if (this.questionnaireId == '') {
					this.$Notice.warning({ title: '请先选择问卷' });
				} else {
					this.questionName = '';
					this.questionType = '';
					this.questionOrder = '';
					this.addQuestionShow = true;
				}
			},
			/*新增选项*/
			optionAdd () {
				if (this.questionUid == '') {
					this.$Notice.warning({ title: '请先选择问题' });
				} else if (this.currentQuestionType == 3) {
					this.$Notice.warning({ title: '填空题不能添加选项' });
				} else {
					this.optionName = '';
					this.optionOrder = '';
					this.addOptionShow = true;
				}
			},
			/*新增问卷确认*/
			addQuestionnaireConfirm () {
				this.loadingState = true;
				this.questionnaireItem['adminUuid'] = localStorage.adminUuid;
            	this.questionnaireItem.validFromTime = parseInt(new Date(this.questionnaireItem.validFromTime).getTime());
            	this.questionnaireItem.validToTime = parseInt(new Date(this.questionnaireItem.validToTime).getTime());
            	
            	this.$axios.post('user/questionnaire/add', qs.stringify(this.questionnaireItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					console.log(response.data);
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
						this.loadList(1);
					} else {
						this.$Notice.error({ title: response.data.message });
						this.loadingState = false;
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.loadingState = false;
	        	})
			},
			/*新增问题确认*/
			addQuestionConfirm () {
				this.questionLoadingState = true;
				let formItem = {};
				formItem['adminUuid'] = localStorage.adminUuid;
				formItem['questionnaireId'] = this.questionnaireId;
				formItem['title'] = this.questionName;
				formItem['optionType'] = this.questionType;
				formItem['showOrder'] = this.questionOrder;
				
				this.$axios.post('user/question/add', qs.stringify(formItem), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					console.log(response.data);
					if (response.data.isSuccessful) {
						this.questionLoadingState = false;
						this.$Notice.success({ title: '操作成功' });
						this.loadQuestionList(this.questionnaireId);
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.questionLoadingState = false;
	        	})
			},
			/*编辑问题确认*/
			editQuestionConfirm () {
				this.questionLoadingState = true;
				let formItem = {};
				formItem['adminUuid'] = localStorage.adminUuid;
				formItem['title'] = this.questionName;
				formItem['optionType'] = this.questionType;
				formItem['showOrder'] = this.questionOrder;
				formItem['uid'] = this.questionUid;
				
           		this.$axios.post('user/question/update', qs.stringify(formItem), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if (response.data.isSuccessful) {
						this.$Notice.success({ title: '操作成功' });
						this.loadQuestionList(this.questionnaireId);
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.questionLoadingState = false;
	        	})
			},
			/*新增选项确认*/
			addOptionConfirm () {
				this.optionLoadingState = true;
				let formItem = {};
				formItem['adminUuid'] = localStorage.adminUuid;
				formItem['questionId'] = this.questionUid;
				formItem['content'] = this.optionName;
				formItem['showOrder'] = this.optionOrder;
				formItem['optionType'] = this.currentQuestionType;
				
				this.$axios.post('user/option/add', qs.stringify(formItem), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if (response.data.isSuccessful) {
						this.$Notice.success({ title: '操作成功' });
						this.loadOptionList(this.questionUid);
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.questionLoadingState = false;
	        	})
			},
			/*编辑选项确认*/
			editOptionConfirm () {
				this.optionLoadingState = true;
				let formItem = {};
				formItem['adminUuid'] = localStorage.adminUuid;
				formItem['uid'] = this.currentOptionUid;
				formItem['content'] = this.optionName;
				formItem['showOrder'] = this.optionOrder;
				formItem['optionType'] = this.currentQuestionType;
				
				this.$axios.post('user/option/update', qs.stringify(formItem), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if (response.data.isSuccessful) {
						this.$Notice.success({ title: '操作成功' });
						this.loadOptionList(this.questionUid);
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.questionLoadingState = false;
	        	})
			},
			/*问卷下线*/
			offLineQuestionnaire (index, questionnaireId, adminUuid) {
				this.$Modal.confirm({
                    content: `确认下线该问卷吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/questionnaire/remove', qs.stringify({ questionnaireId: questionnaireId, adminUuid: adminUuid }),
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
			/*问卷上线*/
			onLineQuestionnaire (index, questionnaireId, adminUuid) {
				this.$Modal.confirm({
                    content: `确认上线该问卷吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/questionnaire/online', qs.stringify({ questionnaireId: questionnaireId, adminUuid: adminUuid }),
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
			/*问题删除*/
			removeQuestion (index, uid) {
				let adminUuid = localStorage.adminUuid;
				
				this.$Modal.confirm({
					content: `确认删除该问题吗?`,
					onOk: () => {
						this.questionLoadingState = true;
		           		this.$axios.post('user/question/delete', qs.stringify({ uid: uid, adminUuid: adminUuid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.questionData.splice(index, 1);
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: response.data.message });
							}
							this.questionLoadingState = false;
			        	})
			        	.catch((error) => {
			        		console.log(error);
			        		this.questionLoadingState = false;
			        	})
					}
				});
			},
			/*选项删除*/
			removeOption (index, uid) {
				let adminUuid = localStorage.adminUuid;
				
				this.$Modal.confirm({
					content: `确认删除该选项吗?`,
					onOk: () => {
						this.optionLoadingState = true;
		           		this.$axios.post('user/option/delete', qs.stringify({ uid: uid, adminUuid: adminUuid }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.optionData.splice(index, 1);
								this.$Notice.success({ title: '操作成功' });
							} else {
								this.$Notice.error({ title: response.data.message });
							}
							this.optionLoadingState = false;
			        	})
			        	.catch((error) => {
			        		console.log(error);
			        		this.optionLoadingState = false;
			        	})
					}
				});
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
	.page {
		float: right;
		margin-top: 20px;
	}
	.text-center {
		text-align: center;
	}
</style>