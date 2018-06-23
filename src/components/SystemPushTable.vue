<template>
	<div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="create">创建</Button>
		</ButtonGroup>
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
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '被发送人',
                        key: 'pushedPeople'
                    },
                    {
                        title: '发送时间',
                        key: 'createdTime',
                        render: (h,params) => {
                        	let createdTime = params.row.createdTime;
                        	createdTime = this.formatDate(createdTime);
                        	return h('div', createdTime);
                        }
                    }/*,
                    {
                        title: '是否推送',
                        key: 'whetherToPush'
                    }*/
                ],
                data: [],					//渲染的数据
                loadingState: false,		//表格读取状态
                total: 0,					//查询出的数据总条数
			}
		},
		methods: {
            /*分页*/
           	changePage (page) {
           		this.loadList(page);
           	},
           	/*获取列表*/
           	loadList (page) {
           		this.loadingState = true;
           		this.$axios.get('user/message/system/list?page='+page+'&pageSize=10')
				.then((response) => {
					console.log(response.data.data);
					if (response.data.isSuccessful) {
						this.data = response.data.data.rows;
						this.total = response.data.data.records;
						this.loadingState = false;
					}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		this.loadingState = false;
	        	})
           	},
			/*创建推送*/
			create () {
				this.$router.push({ name: 'systemPushCreate' });
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
		mounted: function () {
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
</style>