<template>
	<ButtonGroup size="small" class="btn-group">
		<Button type="primary" @click="add">新增</Button>
		<Select size="small" class="selectType" v-model="defaultType" @on-change="typeChange(defaultType)">
			<Option value="test1">全部</Option>
			<Option value="test2">币市</Option>
			<Option value="test3">公募</Option>
			<Option value="test4">空投</Option>
		</Select>
		<Input class="searchBox" size="small" v-model="searchContent" placeholder="要搜索的货币名称...">
			<Button slot="append" icon="search" @click="search"></Button>
		</Input>
	</ButtonGroup>
</template>

<script>
	export default {
		data () {
			return {
				defaultType: 'test1',		//默认搜索的全部
				searchContent: ''		//搜索的内容
			}
		},
		methods: {
			add () {
				this.$router.push({ name: 'coinAdd' })
			},
			search () {
				this.$Message.info('执行搜索功能');
			},
			typeChange (defaultType) {
				console.log(defaultType);
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
	.selectType {
		float: right;
		width: 100px;
		margin-right: 20px;
	}
	.searchBox {
		float: right;
		width: 200px;
		margin-right: 20px;
	}
</style>