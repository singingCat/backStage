<template>
	<ButtonGroup size="small" class="btn-group">
		<!--<Button type="primary" @click="add">新增</Button>-->
		<Select size="small" class="selectType" v-model="defaultType" @on-change="typeChange(defaultType)">
			<Option value="test1">全部</Option>
			<Option value="test2">运营人员</Option>
			<Option value="test3">普通用户</Option>
		</Select>
		<Input class="searchBox" size="small" v-model="searchContent" placeholder="要搜索的用户uuid">
			<Select v-model="searchType" slot="prepend" style="width: 80px">
	            <Option value="uuid">uuid</Option>
	            <Option value="用户名">用户名</Option>
	        </Select>
			<Button slot="append" icon="search" @click="search"></Button>
		</Input>
	</ButtonGroup>
</template>

<script>
	export default {
		data () {
			return {
				defaultType: 'test1',		//默认搜索的全部
				searchType: 'uuid',
				searchContent: ''		//搜索的内容
			}
		},
		methods: {
			add () {
				this.$router.push({ name: 'userAdd' })
			},
			typeChange (defaultType) {
				console.log(defaultType);
			},
			search () {
				
			}
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
	.selectType {
		float: right;
		width: 100px;
		margin-left: 20px;
	}
	.searchBox {
		float: right;
		width: 280px;
	}
</style>