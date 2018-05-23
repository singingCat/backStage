<template>
	<Table border :columns="columns" :data="data"></Table>
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
						title: 'uid',
						key: 'uid'
					},
                    {
                        title: '调研名称',
                        key: 'name'
                    },
                    {
                        title: '分析师',
                        key: 'nickName'
                    },
                    {
                        title: '接单时间',
                        key: 'orderTime'
                    },
                    {
                        title: '状态',
                        key: 'status'
                    }
                ],
                data: []
			}
		},
		methods: {
			/*数据处理*/
			handleData () {
				this.data.forEach((item, index) => {
					item.name = this.$route.query.name;
					item.nickName = item.user.nickName;
					item.orderTime = this.formatDate(item.orderTime);
					/*状态*/
					switch(item.status)
					{
						case 1:
							item.status = '已发布';
							break;
						case 2:
							item.status = '已接单';
							break;
						case 3:
							item.status = '已完成';
							break;
						case 4:
							item.status = '已过期';
							break;
						case 5:
							item.status = '已取消';
							break;
						default:
							break;
					}
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
		mounted: function () {	
			this.data = this.$route.query.taskAcceptList;
			this.handleData();
		}
	}
</script>

<style>
</style>