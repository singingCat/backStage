<template>
	<div>
		<div class="headTitle">后台管理系统</div>
		<div class="userInfo">
		    <Dropdown class="dropDown" placement="bottom-end">
		        <a href="javascript:void(0)">
		            iview_admin
		            <Icon type="arrow-down-b"></Icon>
		        </a>
		        <DropdownMenu slot="list">
		            <DropdownItem>个人中心</DropdownItem>
		            <DropdownItem divided>退出登录</DropdownItem>
		        </DropdownMenu>
		    </Dropdown>
		    <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg"></Avatar>
		</div>
	</div>
</template>

<script>
	export default {
		
	}
</script>

<style scoped>
	.headTitle {
		font-weight: bold;
		font-size: 20px;
	}
	.userInfo {
		position: absolute;
		top: 0;
		right: 50px;
		height: 60px;
		line-height: 0;
		display: flex;
		align-items: center;
	}
	.dropDown {
		float: right;
		margin-right: 10px;
	}
</style>