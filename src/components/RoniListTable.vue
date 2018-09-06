<template>
	<div>
		<div class="text-center">RONI generate列表</div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="generate">生成</Button>
			<Select size="small" class="selectType" v-model="defaultRoniGenType" @on-change="roniGenTypeChange">
				<Option value="">全部</Option>
				<Option value="1">1h</Option>
				<Option value="2">12h</Option>
				<Option value="3">24h</Option>
			</Select>
		</ButtonGroup>
		<Table border highlight-row :columns="roniGenColumns" :data="roniGenData" :loading="roniGenLoadingState" @on-current-change="changeRoniGenerate"></Table>
		<div class="page">
			<Page :total="roniGenTotal" :current="1" show-total @on-change="roniGenChangePage"></Page>
		</div>
		<Modal
	        v-model="generateShow"
	        title="重新生成"
	        @on-ok="handleConfirm">
	        <Form :model="formItem" :label-width="50">
		        <FormItem label="类型:">
		            <Select v-model="formItem.type">
		            	<Option value="1">1H</Option>
		            	<Option value="2">12H</Option>
		            	<Option value="3">24H</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="时间:">
		            <Select v-model="formItem.time">
		            	<Option value="0">生成当前的RoniGenerate和Roni</Option>
		            	<Option value="-1">生成上期的RoniGenerate和Roni</Option>
		            	<Option value="-2">生成上上期的RoniGenerate和Roni</Option>
		            	<Option value="-3">生成上上上期的RoniGenerate和Roni</Option>
		            </Select>
		        </FormItem>
			</Form>
	    </Modal>
	    <div class="text-center" style="margin-top: 100px">RONI列表</div>
	    <ButtonGroup size="small" class="btn-group">
	    	<Button type="primary" @click="showAllRoniList">显示全部</Button>
			<Select size="small" class="selectType" v-model="defaultRoniType" @on-change="roniTypeChange">
				<Option value="">全部</Option>
				<Option value="1">1h</Option>
				<Option value="2">12h</Option>
				<Option value="3">24h</Option>
			</Select>
		</ButtonGroup>
		<Table border :columns="roniColumns" :data="roniData" :loading="roniLoadingState"></Table>
		<div class="page">
			<Page :total="roniTotal" :current="1" show-total @on-change="roniChangePage"></Page>
		</div>
	</div>
</template>

<script>
	import qs from 'qs'
	
	export default {
		data () {
			return {
				roniGenColumns: [
					{
						title: 'uid',
						key: 'uid'
					},
					{
						title: '名称',
						key: 'name'
					},
					{
						title: '期数',
						key: 'period'
					},
					{
						title: '期号',
						key: 'periodIndex'
					},
					{
						title: '币数量',
						key: 'coinNumber'
					},
					{
						title: '类型',
						key: 'type',
						render: (h, params) => {
							let type = params.row.type;
							switch (type) {
								case 1: type = '1h'; break;
								case 2: type = '12h'; break;
								case 3: type = '24h'; break;
								default: break;
							}
							return h('div', type);
						}
					},
					{
						title: '状态',
						key: 'status',
						render: (h, params) => {
							let status = params.row.status;
							switch (status) {
								case 1: status = '开盘中'; break;
								case 2: status = '等待结果'; break;
								case 3: status = '已结束'; break;
								case 4: status = '已发送'; break;
								default: break;
							}
							return h('div', status);
						}
					},
					{
						title: '开始投票时间',
						key: 'voteFromTime',
						render: (h, params) => {
							return h('div', this.formatDate(params.row.voteFromTime));
						}
					},
					{
						title: '结束投票时间',
						key: 'voteToTime',
						render: (h, params) => {
							return h('div', this.formatDate(params.row.voteToTime));
						}
					},
					{
						title: '开始等待时间',
						key: 'waitFromTime',
						render: (h, params) => {
							return h('div', this.formatDate(params.row.waitFromTime));
						}
					},
					{
						title: '结束等待时间',
						key: 'waitToTime',
						render: (h, params) => {
							return h('div', this.formatDate(params.row.waitToTime));
						}
					}
                ],
                roniGenData: [{uid: 1}],
                roniGenLoadingState: false,
                roniGenTotal: 0,
                generateShow: false,
                defaultRoniGenType: '',
                currentRoniGenId: '',
                formItem: {
					type: '1',
					time: '0'
				},
				roniColumns: [
					{
                        title: 'uid',
                        key: 'uid',
                        width: 70,
                        fixed: 'left'
                    },
                    {
                        title: '期数',
                        key: 'period',
                        width: 110
                    },
                    {
                        title: '期号',
                        key: 'periodIndex',
                        width: 70
                    },
                    {
                        title: '结果',
                        key: 'result',
                        width: 70
                    },
                    {
                        title: '类型',
                        key: 'type',
                        width: 70,
                        render: (h, params) => {
							let type = params.row.type;
							switch (type) {
								case 1: type = '1h'; break;
								case 2: type = '12h'; break;
								case 3: type = '24h'; break;
								default: break;
							}
							return h('div', type);
						}
                    },
                    {
                        title: '状态',
                        key: 'status',
                        width: 80,
                        render: (h, params) => {
							let status = params.row.status;
							switch (status) {
								case 1: status = '开盘中'; break;
								case 2: status = '等待结果'; break;
								case 3: status = '已结束'; break;
								case 4: status = '已发送'; break;
								default: break;
							}
							return h('div', status);
						}
                    },
                    {
                        title: '开始价格',
                        key: 'startPrice',
                        width: 90
                    },
                    {
                        title: '结束价格',
                        key: 'endPrice',
                        width: 90
                    },
                    {
                        title: '看好率',
                        key: 'roni',
                        width: 80
                    },
                    {
                        title: '看好币总数',
                        key: 'bullishInb',
                        width: 80
                    },
                    {
                        title: '看好人总数',
                        key: 'bullishUserNumber',
                        width: 80
                    },
                    {
                        title: '看跌币总数',
                        key: 'bearishInb',
                        width: 80
                    },
                    {
                        title: '看跌人总数',
                        key: 'bearishUserNumber',
                        width: 80
                    },
                    {
                        title: '总币数',
                        key: 'totalInb',
                        width: 80
                    },
                    {
                        title: '总人数',
                        key: 'totalUserNumber',
                        width: 80
                    },
                    {
                        title: '币名称',
                        width: 80,
                        render: (h, params) => {
                        	return h('div', params.row.coin.symbolName);
                        }
                    },
                    {
						title: '开始投票时间',
						key: 'voteFromTime',
						render: (h, params) => {
							return h('div', this.formatDate(params.row.voteFromTime));
						},
						width: 150
					},
					{
						title: '结束投票时间',
						key: 'voteToTime',
						render: (h, params) => {
							return h('div', this.formatDate(params.row.voteToTime));
						},
						width: 150
					},
					{
						title: '开始等待时间',
						key: 'waitFromTime',
						render: (h, params) => {
							return h('div', this.formatDate(params.row.waitFromTime));
						},
						width: 150
					},
					{
						title: '结束等待时间',
						key: 'waitToTime',
						render: (h, params) => {
							return h('div', this.formatDate(params.row.waitToTime));
						},
						width: 150
					}
				],
				roniData: [{uid: 1}],
				roniLoadingState: false,
				roniTotal: 0,
				defaultRoniType: '',
			}
		},
		methods: {
			/*获取roni generate列表*/
			loadRoniGenList (page) {
				this.roniGenLoadingState = true;
				this.$axios.get('roni/generate/list?page=' + page + '&pageSize=10&type=' + this.defaultRoniGenType)
				.then((response) => {
					if (response.data.isSuccessful) {
						this.roniGenData = response.data.data.rows;
						this.roniGenTotal = response.data.data.records;
					} else {
						this.$Notice.error({ title: response.data.message });
					}
					this.roniGenLoadingState = false;
	        	})
	        	.catch((error) => {
	        		this.roniGenLoadingState = false;
	        	})
			},
			/*获取roni列表*/
			loadRoniList (page) {
				this.roniLoadingState = true;
				this.$axios.get('roni/list?page=' + page + '&pageSize=10&type=' + this.defaultRoniType + '&roniGenerateId=' + this.currentRoniGenId)
				.then((response) => {
					if (response.data.isSuccessful) {
						console.log(response.data);
						this.roniData = response.data.data.rows;
						this.roniTotal = response.data.data.records;
					} else {
						this.$Notice.error({ title: response.data.message });
					}
					this.roniLoadingState = false;
	        	})
	        	.catch((error) => {
	        		this.roniLoadingState = false;
	        	})
			},
			roniGenChangePage () {
				this.loadRoniGenList(1);
			},
			roniChangePage () {
				this.loadRoniList(1);
			},
			generate () {
				this.generateShow = true;
			},
			handleConfirm () {
				this.roniGenLoadingState = true;
				this.roniLoadingState = true;
           		this.$axios.post('roni/add', qs.stringify(this.formItem), 
            	{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if (response.data.isSuccessful) {
						this.loadRoniGenList(1);
						this.loadRoniList(1);
					} else {
						this.$Notice.error({ title: response.data.message });
						this.roniGenLoadingState = false;
						this.roniLoadingState = false;
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.roniGenLoadingState = false;
					this.roniLoadingState = false;
	        	})
			},
			roniGenTypeChange () {
				this.loadRoniGenList(1);
			},
			roniTypeChange () {
				this.loadRoniList(1);
			},
			changeRoniGenerate (currentRow, oldCurrentRow) {
				this.currentRoniGenId = currentRow.uid;
				this.loadRoniList(1);
			},
			showAllRoniList () {
				this.currentRoniGenId = '';
				this.defaultRoniType = '';
				this.loadRoniList(1);
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
		mounted () {
			this.loadRoniGenList(1);
			this.loadRoniList(1);
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
	.selectType {
		float: right;
		width: 100px;
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