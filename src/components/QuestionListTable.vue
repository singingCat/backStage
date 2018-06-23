<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="add">新增问题</Button>
		</ButtonGroup>
		<Table border :columns="columns" :data="data" :loading="loadingState"></Table>
		<Modal
	        v-model="questionEdit"
	        title="编辑问题"
	        @on-ok="confirm">
	        <p>问题:</p>
	        <Input v-model="title"></Input>
	        <p>类型:</p>
	        <Select v-model="optionType">
	        	<Option value="1">单选</Option>
	        	<Option value="2">多选</Option>
	        	<Option value="3">填空</Option>
	        </Select>
	        <p v-if="optionType != 3">选项:</p>
	        <Input v-model="content" v-if="optionType != 3"></Input>
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
						title: 'uid',
						key: 'uid'
					},
                    {
                        title: '问题',
                        key: 'question'
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
                        title: '选项',
                        key: 'options',
                        render: (h,params) => {
                        	let optionType = params.row.optionType;
                        	if (optionType == 3) {
                        		return h('div', '无');
                        	} else {
                        		return h('Poptip', {
		                            props: {
		                                trigger: 'hover',
		                                content: params.row.options.length,
		                                placement: 'bottom'
		                            }
		                        },[
		                            h('Tag', params.row.options.length),
		                            h('div', {
		                                slot: 'content'
		                            }, [
		                                h('ul', this.data[params.index].options.map(item => {
		                                    return h('li', {
		                                        style: {
		                                            textAlign: 'center',
		                                            padding: '4px'
		                                        }
		                                    }, item);
		                                }))
		                            ])
		                        ]);
                        	}
                        }
                    },
                    {
                    	title: '操作',
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
                                        	this.edit(params.index, params.row)
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
                loadingState: false,
                questionEdit: false,
                title: '',
                optionType: '',
                content: ''
			}
		},
		methods: {
			/*获取列表*/
			loadList (page) {
				
			},
            /*编辑*/
            edit (index, row) {
            	
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
            add () {
				this.questionEdit = true;
			},
			confirm () {
				let question = {
					title: this.title,
					optionType: this.optionType,
					content: this.content
				}
				console.log(question);
			}
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
</style>