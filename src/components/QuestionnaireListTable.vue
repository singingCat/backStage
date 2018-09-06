<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="questionnaireAdd">新增问卷</Button>
			<Button type="info" @click="exportQuestionnaire('all')" style="margin-right: 20px;">全部导出</Button>
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的内容">
				<Select v-model="searchType" slot="prepend" style="width: 80px">
		            <Option value="title">问卷名</Option>
		            <Option value="coinName">货币</Option>
		        </Select>
				<Button slot="append" icon="md-search" @click="searchQuestionnaire"></Button>
			</Input>
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
		            	<Option value="3">Panel专属</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="问卷类型:">
		            <Select v-model="questionnaireItem.type2">
		            	<Option value="1">普通问卷</Option>
		            	<Option value="2">pannel问卷</Option>
		            	<Option value="3">社区评级问卷</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="热点类型:">
		        	<Select v-model="questionnaireItem.focusType">
		            	<Option value="1">普通问卷</Option>
		            	<Option value="2">热点问卷</Option>
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
		            	<Option value="3">Panel专属</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="问卷类型:">
		            <Select v-model="questionnaireItem.type2">
		            	<Option value="1">普通问卷</Option>
		            	<Option value="2">pannel问卷</Option>
		            	<Option value="3">社区评级问卷</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="热点类型:">
		        	<Select v-model="questionnaireItem.focusType">
		            	<Option value="1">普通问卷</Option>
		            	<Option value="2">热点问卷</Option>
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
	        	<Option value="4">评分</Option>
	        </Select>
	        <p>排序:</p>
	        <Input v-model="questionOrder"></Input>
	        <p>最小描述</p>
	        <Input v-model="minDescription"></Input>
	        <p>最大描述</p>
	        <Input v-model="maxDescription"></Input>
	        <p>权重</p>
	        <Input v-model="weightsIndex"></Input>
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
	        	<Option value="4">评分</Option>
	        </Select>
	        <p>排序:</p>
	        <Input v-model="questionOrder"></Input>
	        <p>最小描述</p>
	        <Input v-model="minDescription"></Input>
	        <p>最大描述</p>
	        <Input v-model="maxDescription"></Input>
	        <p>权重</p>
	        <Input v-model="weightsIndex"></Input>
	    </Modal>
	    <Modal
	        v-model="addOptionShow"
	        title="新增选项"
	        @on-ok="addOptionConfirm">
	        <p style="margin-bottom: 20px;">问题名: {{currentQuestion}}</p>
	        <p>选项名称(评分题时为等级级别):</p>
	        <Input v-model="optionName"></Input>
	        <p>排序:</p>
	        <Input v-model="optionOrder"></Input>
	        <p>分数</p>
	        <Input v-model="score"></Input>
	    </Modal>
	    <Modal
	        v-model="editOptionShow"
	        title="编辑选项"
	        @on-ok="editOptionConfirm">
	        <p>选项名称(评分题时为等级级别):</p>
	        <Input v-model="optionName"></Input>
	        <p>排序:</p>
	        <Input v-model="optionOrder"></Input>
	        <p>分数</p>
	        <Input v-model="score"></Input>
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
	                    width: 150,
	                    render: (h, params) => {
	                    	return h('div', params.row.publishUser.nickName);
	                    }
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
	                	title: '类型',
	                	width: 100,
	                	key: 'type',
	                	render: (h, params) => {
	                		let type = params.row.type;
	                		switch (type) {
	                			case 1: type = '用户调研'; break;
	                			case 2: type = '企业问询'; break;
	                			case 3: type = 'Panel专属'; break;
	                			default: break;
	                		}
	                		return h('div', type);
	                	}
	                },
	                {
	                	title: '问卷类型',
	                	width: 100,
	                	key: 'type2',
	                	render: (h, params) => {
	                		let type2 = params.row.type2;
	                		switch (type2) {
	                			case 1: type2 = '普通问卷'; break;
	                			case 2: type2 = 'pannel问卷'; break;
	                			case 3: type2 = '社区评级问卷'; break;
	                			default: break;
	                		}
	                		return h('div', type2);
	                	}
	                },
	                {
	                	title: '热点类型',
	                	width: 100,
	                	key: 'focusType',
	                	render: (h, params) => {
	                		let focusType = params.row.focusType;
	                		switch (focusType) {
	                			case 1: focusType = '普通问卷'; break;
	                			case 2: focusType = '热点问卷'; break;
	                			default: break;
	                		}
	                		return h('div', focusType);
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
	                    width: 80,
	                    render: (h, params) => {
	                    	return h('div', params.row.totalNumber - params.row.doneNumber);
	                    }
	                },
	                {
	                	title: '总数',
	                	key: 'totalNumber',
	                	width: 80
	                },
	                {
                    	title: '操作',
                    	key: 'action',
                    	width: 400,
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
                                            this.toQuestionShow(params.row.uid, params.row.questions);
                                            //console.log(params.row.questions);
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
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.copy(params.row.uid);
                                        }
                                    }
                                }, '复制'),
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
                                            this.exportQuestionnaire(params.row.uid);
                                        }
                                    }
                                }, '导出'),
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
                                            this.testQuestionnaire(params.index, params.row.uid);
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
                total: 0,				//问卷总数
                searchType: '',			//搜索类型
                searchContent: '',		//搜索内容
                exportData: [],			//待导出数据
                currentPage: 1,			//当前页
                questionnaireItem: {
					name: '',			//问卷名称
					founderUuid: '',	//创建人uuid
					description: '',	//描述
					type: '',			//类型
					type2: '',			//问卷类型
					focusType: '',		//热点类型
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
                        		case 4: optionType = '评分'; break;
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
                                        	this.maxDescription = params.row.maxDescription;
                                        	this.minDescription = params.row.minDescription;
                                        	this.weightsIndex = params.row.weightsIndex;
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
	                	title: '分数',
	                	key: 'score'
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
                                        	this.score = params.row.score;
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
                maxDescription: '',
                minDescription: '',
                weightsIndex: '',
                optionName: '',
                optionOrder: '',
                currentQuestionType: '',
                currentOptionUid: '',
                currentQuestionnaire: '',
                currentQuestion: '',
                questionMinDesc: '',
                questionMaxDesc: '',
                score: ''
			}
		},
		methods: {
			/*获取问卷列表*/
           	loadList (page) {
           		this.loadingState = true;
           		let args = {
           			page: page,
           			pageSize: 10
           		};
           		if (this.searchType !== '') {
           			args[this.searchType] = this.searchContent;
           		}
           		this.$axios.post('user/questionnaire/lists', qs.stringify(args), 
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
           		this.currentPage = page;
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
					item.validFromTime = this.formatDate(item.validFromTime);
					item.validToTime = this.formatDate(item.validToTime);
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
			/*时间格式化*/
			formatDateToDay (timestamp) {
				let date = new Date(timestamp);
		        let Y = date.getFullYear() + '-';
		        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		        let D = (	date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
		        return Y+M+D;
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
					focusType: '',
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
					type2: row.type2 + '',
					focusType: row.focusType + '',
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
				this.questionnaireItem['uid'] = this.questionnaireId;
            	this.questionnaireItem.validFromTime = parseInt(new Date(this.questionnaireItem.validFromTime).getTime());
            	this.questionnaireItem.validToTime = parseInt(new Date(this.questionnaireItem.validToTime).getTime());
            	
            	this.$axios.post('user/questionnaire/update', qs.stringify(this.questionnaireItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
						this.loadList(this.currentPage);
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
           	searchQuestionnaire () {
				this.loadList(1);
			},
			/*新增问题*/
			questionAdd () {
				if (this.questionnaireId == '') {
					this.$Notice.warning({ title: '请先选择问卷' });
				} else {
					this.questionName = '';
					this.questionType = '';
					this.questionOrder = '';
					this.minDescription = '';
					this.maxDescription = '';
					this.weightsIndex = '';
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
					this.score = '';
					this.addOptionShow = true;
				}
			},
			/*新增问卷确认*/
			addQuestionnaireConfirm () {
				this.loadingState = true;
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
				formItem['questionnaireId'] = this.questionnaireId;
				formItem['title'] = this.questionName;
				formItem['optionType'] = this.questionType;
				formItem['showOrder'] = this.questionOrder;
				formItem['maxDescription'] = this.maxDescription;
				formItem['minDescription'] = this.minDescription;
				formItem['weightsIndex'] = this.weightsIndex;
				
				this.$axios.post('user/question/add', qs.stringify(formItem), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
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
				formItem['title'] = this.questionName;
				formItem['optionType'] = this.questionType;
				formItem['showOrder'] = this.questionOrder;
				formItem['uid'] = this.questionUid;
				formItem['maxDescription'] = this.maxDescription;
				formItem['minDescription'] = this.minDescription;
				formItem['weightsIndex'] = this.weightsIndex;
				
           		this.$axios.post('user/question/update', qs.stringify(formItem), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					console.log(response.data);
					if (response.data.isSuccessful) {
						this.$Notice.success({ title: '操作成功' });
						this.loadQuestionList(this.questionnaireId);
					} else {
						this.$Notice.error({ title: response.data.message });
						this.questionLoadingState = false;
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
				formItem['questionId'] = this.questionUid;
				formItem['content'] = this.optionName;
				formItem['showOrder'] = this.optionOrder;
				formItem['optionType'] = this.currentQuestionType;
				formItem['score'] = this.score;
				
				this.$axios.post('user/option/add', qs.stringify(formItem), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					console.log(response.data);
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
				formItem['uid'] = this.currentOptionUid;
				formItem['content'] = this.optionName;
				formItem['showOrder'] = this.optionOrder;
				formItem['optionType'] = this.currentQuestionType;
				formItem['score'] = this.score;
				
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
			/*问卷测试*/
			testQuestionnaire (index, questionnaireId) {
				this.$Modal.confirm({
                    content: `确认将该问卷转为测试吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/questionnaire/testing', qs.stringify({ questionnaireId: questionnaireId }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.data[index].onlineStatus = 2;
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
			},
			/*复制问卷*/
			copy (questionnaireId) {
				this.$Modal.confirm({
                    content: `确认复制该问卷吗?`,
                    onOk: () => {
                    	this.loadingState = true;
		           		this.$axios.post('user/copy/questionnaire', qs.stringify({ questionnaireId: questionnaireId }),
		           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
						.then((response) => {
							if(response.data.isSuccessful){
								this.loadList(1);
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
			/*导出CSV*/
			exportQuestionnaire (arg) {
				let args = arg;
				let url = 'questionnaire/export';
				let name = 'all_' + this.formatDateToDay(new Date()) + '.csv';
				if (args !== 'all') {
					url = 'questionnaire/export?questionnaireId=' + args;
					name = args + '_' + this.formatDateToDay(new Date()) + '.csv';
				}
				
				this.$axios.get(url)
				.then((response) => {
					if (response.data.isSuccessful) {
						this.exportData = response.data.data;
						this.downloadCSV({ filename: name });
					} else {
						this.$Notice.error({ title: response.data.message });
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        	})
			},
			convertArrayOfObjectsToCSV (args) {
				let result, ctr, keys, columnDelimiter, lineDelimiter, data;

		        data = args.data || null;
		        if (data == null || !data.length) {
		            return null;
		        }
		
		        columnDelimiter = args.columnDelimiter || ',';
		        lineDelimiter = args.lineDelimiter || '\n';
		
		        keys = Object.keys(data[0]);
		
		        result = '';
		        result += keys.join(columnDelimiter);
		        result += lineDelimiter;
		
		        data.forEach(function(item) {
		            ctr = 0;
		            keys.forEach(function(key) {
		                if (ctr > 0) result += columnDelimiter;
		
		                result += item[key];
		                ctr++;
		            });
		            result += lineDelimiter;
		        });
		
		        return result;
			},
			downloadCSV (args) {
				let data, filename, link;

		        let csv = this.convertArrayOfObjectsToCSV({
		            data: this.exportData
		        });
		        if (csv == null) return;
		
		        filename = args.filename || 'export.csv';
		
		        if (!csv.match(/^data:text\/csv/i)) {
		            csv = 'data:text/csv;charset=utf-8,' + csv;
		        }
		        data = encodeURI(csv);
		
		        link = document.createElement('a');
		        link.setAttribute('href', data);
		        link.setAttribute('download', filename);
		        link.click();
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
		width: 280px;
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