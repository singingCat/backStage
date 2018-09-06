<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="success" @click="modifyReward('vote24hInb')">修改投票额(24h)</Button>
			<Button type="info" @click="modifyReward('vote12hInb')">修改投票额(12h)</Button>
			<Button type="warning" @click="modifyReward('vote1hInb')">修改投票额(1h)</Button>
			<Button type="error" @click="modifyReward('facebook')">修改facebook奖励</Button>
			<Button type="warning" @click="modifyReward('twitter')">修改twitter奖励</Button>
			<Button type="info" @click="modifyReward('telegram')">修改telegram奖励</Button>
			<Button type="success" @click="modifyReward('注册')">修改注册奖励</Button>
			<Button type="primary" @click="modifyReward('邀请')">修改邀请奖励</Button>
		</ButtonGroup>
		<Table border :columns="columns" :data="configList" :loading="loadingState"></Table>
		<Modal
	        v-model="showModify"
	        :title="modifyTitle"
	        @on-ok="confirmModify">
	        <p>奖励数量:</p>
	        <Input v-model="reward"></Input>
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
                        title: '邀请奖励',
                        key: 'inviteReward'
                    },
                    {
                        title: '注册奖励',
                        key: 'registerReward'
                    },
                    {
                        title: 'telegram奖励',
                        key: 'telegramReward'
                    },
                    {
                        title: 'twitter奖励',
                        key: 'twitterReward'
                    },
                    {
                        title: 'facebook奖励',
                        key: 'facebookReward'
                    },
                    {
                    	title: 'roni投票额(1h)',
                    	key: 'vote1hInb'
                    },
                    {
                    	title: 'roni投票额(12h)',
                    	key: 'vote12hInb'
                    },
                    {
                    	title: 'roni投票额(24h)',
                    	key: 'vote24hInb'
                    },
                ],
				configList: [],
				showModify: false,
				loadingState: false,
				modifyTitle: '',
				currentCategory: '',
				reward: ''
			}
		},
		methods: {
			initData () {
				this.loadingState = true;
				
				this.$axios.get('user/insight/info?page=1&pageSize=10')
				.then((response) => {
					console.log(response.data);
					if (response.data.isSuccessful) {
						let arr = [];
						arr.push(response.data.data.config);
						this.configList = arr;
					} else {
						this.$Notice.error({ title: response.data.message });
					}
					this.loadingState = false;
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.loadingState = false;
	        	})
			},
			modifyReward (category) {
				this.modifyTitle = '修改' + category + '奖励';
				switch (category) {
					case '邀请': this.currentCategory = 'invite'; this.reward = this.configList[0].inviteReward; break;
					case '注册': this.currentCategory = 'register'; this.reward = this.configList[0].registerReward; break;
					case 'telegram': this.currentCategory = 'telegram'; this.reward = this.configList[0].telegramReward; break;
					case 'twitter': this.currentCategory = 'twitter'; this.reward = this.configList[0].twitterReward; break;
					case 'facebook': this.currentCategory = 'facebook'; this.reward = this.configList[0].facebookReward; break;
					case 'vote1hInb': this.currentCategory = 'vote1hInb'; this.reward = this.configList[0].vote1hInb; break;
					case 'vote12hInb': this.currentCategory = 'vote12hInb'; this.reward = this.configList[0].vote12hInb; break;
					case 'vote24hInb': this.currentCategory = 'vote24hInb'; this.reward = this.configList[0].vote24hInb; break;
					default: break;
				}
				this.showModify = true;
			},
			confirmModify () {
				this.loadingState = true;
				let formItem = {};
				formItem['adminUuid'] = localStorage.adminUuid;
				switch (this.currentCategory) {
					case 'invite': formItem['inviteReward'] = this.reward; break;
					case 'register': formItem['registerReward'] = this.reward; break;
					case 'telegram': formItem['telegramReward'] = this.reward; break;
					case 'twitter': formItem['twitterReward'] = this.reward; break;
					case 'facebook': formItem['facebookReward'] = this.reward; break;
					case 'vote1hInb': formItem['vote1hInb'] = this.reward; break;
					case 'vote12hInb': formItem['vote12hInb'] = this.reward; break;
					case 'vote24hInb': formItem['vote24hInb'] = this.reward; break;
					default: break;
				}
				
           		this.$axios.post('user/update/config', qs.stringify(formItem),
           		{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((response) => {
					if(response.data.isSuccessful){
						this.$Notice.success({ title: '操作成功' });
						this.initData();
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
		},
		mounted () {
			this.initData();
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
		margin-left: 5px !important;
	}
</style>