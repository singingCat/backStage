<template>
	<div>
		<Table border :columns="columns" :data="data"></Table>
		<Modal
	        v-model="showOff"
	        @on-ok="ok">
	        <P style="margin-bottom: 10px">请选择下线理由</P>
	        <Select 
	        	v-model="reason"
	        	@on-ok="ok"
	        	style="width: 150px">
	        	<Option value="1">管理员删除</Option>
	        	<Option value="2">政治敏感</Option>
	        	<Option value="3">垃圾营销</Option>
	        	<Option value="4">信息污秽</Option>
	        	<Option value="5">虚假信息</Option>
	        </Select>
	   	</Modal>
	</div>
</template>

<script>
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
                        title: '报告名称',
                        key: 'company'
                    },
                    {
                        title: '提交人',
                        key: 'requestTitle'
                    },
                    {
                        title: '提交人身份',
                        key: 'reward'
                    },
                    {
                        title: '报告价格',
                        key: 'requestTime',
                        sortable: true
                    },
                    {
                        title: '发布企业',
                        key: 'particulars'
                    },
                    {
                    	title: '操作',
                    	width: 240,
                    	align: 'center',
                    	render: (h, params) => {
                    		var that = this;
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '所在调研请求详情'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            //this.remove(params.index)
                                            this.offLine(params.index);
                                        }
                                    }
                                }, '上线')
                            ]);
                    	}
                    }
                ],
                data: [
                    {
                    	uuid: '111',
                    	company: 'com1',
                    	requestTitle: 'title1',
                    	particulars: '少了点街坊邻居老',
                        reward: '10',
                        requestTime: '2018-01-01'
                    },
                    {
                    	uuid: '222',
                    	company: 'com2',
                    	requestTitle: 'title2',
                    	particulars: '少了点街坊邻居老',
                        reward: '20',
                        requestTime: '2018-01-02'
                    },
                    {
                    	uuid: '333',
                    	company: 'com3',
                    	requestTitle: 'title3',
                    	particulars: '少了点街坊邻居老大手',
                        reward: '30',
                        requestTime: '2018-01-03'
                    },
                    {
                    	uuid: '444',
                    	company: 'com4',
                    	requestTitle: 'title4',
                    	particulars: '少了点街坊邻视剧了开房记录看',
                        reward: '40',
                        requestTime: '2018-01-04'
                    }
                ],
                showOff: false,
                currentIndex: '',
                reason: '1'
			}
		},
		methods: {
			/*查看*/
			show (index) {
                this.$Modal.success({
                    title: `${this.data[index].requestTitle}的主要信息`,
                    content: `调研请求奖励INB数量：123<br>调研请求需求分析师等级：123<br>调研请求需求分析师星级：123<br>所需要语言: 123<br>是否公开: 123<br>请求调研份数需求: 123<br>请求调研开始时间: 123<br>请求调研结束时间: 123<br>调研状态: 123<br>免费查看份数: 123<br>免费查看剩余份数: 123<br>付费查看金额: 123`
                })
            },
            /*查看接单详情*/
           	toReceiptList (index) {
           		this.$router.push({ path: 'orderTakingList/' + this.data[index].uuid })
           	},
            /*下线确认弹窗*/
            offLine (index) {
            	this.currentIndex = index;
            	this.showOff = true;
            },
            /*确认下线*/
            ok () {
            	this.$Message.info(this.currentIndex);
            	this.$Message.info(this.reason);
            }
		}
	}
</script>

<style>
</style>