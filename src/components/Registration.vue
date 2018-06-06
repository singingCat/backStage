<template>
	<div>
		注册奖励
		<Table border :columns="columns" :data="configList" :loading="loadingState"></Table>
		<Modal
	        v-model="showModify"
	        title="修改奖励"
	        @on-ok="confirmModify">
	        <p>奖励数量:</p>
	        <Input v-model="reward"></Input>
	   </Modal>
	</div>
</template>

<script>
	import qs from 'qs'
	
	export default {
		props: {
			configList: {
				type: Array,
				required: true
			}
		},
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
                        title: '注册奖励',
                        key: 'registerReward'
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
                                        	this.reward = params.row.registerReward;
                                            this.showModify = true;
                                        }
                                    }
                                }, '修改')
                            ]);
                    	}
                    }
                ],				
                loadingState: false,			//表格读取状态
                showModify: false,
                reward: ''
			}
		},
		methods: {
			/*确认修改*/
			confirmModify () {
				this.loadingState = true;
				let adminUuid = localStorage.adminUuid;
				let registerReward = this.reward;
				
           		this.$axios.post('user/update/config', qs.stringify({ adminUuid: adminUuid, registerReward: registerReward }),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.configList[0].registerReward = this.reward;
						this.loadingState = false;
						this.$Notice.success({ title: '操作成功' });
					} else {
						this.loadingState = false;
						this.$Notice.error({ title: '操作失败' });
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.loadingState = false;
	        	})
			}
		}
	}
</script>

<style>
</style>