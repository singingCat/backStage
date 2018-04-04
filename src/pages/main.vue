<template>
  	<div class="layout">
	    <Layout :style="{minHeight: '100vh'}">
        	<Sider collapsible :collapsed-width="78" v-model="isCollapsed">
	        	<Menu open-names="1" active-name="3-1" theme="dark" width="auto" :class="menuitemClasses" accordion>
		            <Submenu name="1">
			            <template slot="title">
			            	<Icon type="ios-paper"></Icon>
			            	<span>内容管理</span>
			            </template>
			            <Menu-item name="1-1">
			            	<Icon type="ios-paper"></Icon>
			            	<span>文章管理</span>
			            </Menu-item>
			            <MenuItem name="1-2">
			            	<Icon type="ios-paper"></Icon>
			            	<span>评论管理</span>
			            </MenuItem>
			            <MenuItem name="1-3">
			            	<Icon type="ios-paper"></Icon>
			            	<span>举报管理</span>
			            </MenuItem>
			            </Submenu>
			            <Submenu name="2">
				            <template slot="title">
				            	<Icon type="ios-paper"></Icon>
				            	<span>内容管理</span>
				            </template>
			            <Menu-item name="2-1">
			            	<Icon type="ios-paper"></Icon>
			            	<span>文章管理</span>
			            </Menu-item>
			            <MenuItem name="2-2">
			            	<Icon type="ios-paper"></Icon>
			            	<span>评论管理</span>
			            </MenuItem>
			            <MenuItem name="2-3">
			            	<Icon type="ios-paper"></Icon>
			            	<span>举报管理</span>
			            </MenuItem>
	            	</Submenu>
		            <MenuItem name="3-1">
			            <Icon type="ios-navigate"></Icon>
			            <span>Option 1</span>
		            </MenuItem>
	        	</Menu>
        	</Sider>
		    <Layout>
		        <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)', height: '60px'}">
		        	<UserInfo/>
		        </Header>
		        <Content :style="{padding: '0 16px 16px'}">
		        <Breadcrumb :style="{margin: '16px 0'}">
		            <Breadcrumb-item to="/">Home</Breadcrumb-item>
		            <Breadcrumb-item to="/first">first</Breadcrumb-item>
		            <Breadcrumb-item>second</Breadcrumb-item>
		        </Breadcrumb>
		        <Card>
		            <div style="height: 600px">
						<router-view/>
		            </div>
		        </Card>
		        </Content>
		    </Layout>
		</Layout>
	</div>
</template>

<script>
	import UserInfo from '../components/userInfo'
	
	export default {
	  name: 'App',
	  data () {
	  	return {
	  		isCollapsed: false
	  	}
	  },
	  components: {
	  	UserInfo
	  },
	  computed: {
			menuitemClasses: function () {
		    return [
	        'menu-item',
	        this.isCollapsed ? 'collapsed-menu' : ''
	    	]
	    }
		}
	}
</script>

<style scoped>
	.layout-con{
	    height: 100%;
	    width: 100%;
	}
	.menu-item span{
	    display: inline-block;
	    overflow: hidden;
	    width: 69px;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    vertical-align: bottom;
	    transition: width .2s ease .2s;
	}
	.menu-item i{
	    transform: translateX(0px);
	    transition: font-size .2s ease, transform .2s ease;
	    vertical-align: middle;
	    font-size: 16px;
	}
	.collapsed-menu span{
	    width: 0px;
	    transition: width .2s ease;
	}
	.collapsed-menu .ivu-icon-ios-arrow-down {
		display: none;
	}
	.collapsed-menu i{
	    transform: translateX(5px);
	    transition: font-size .2s ease .2s, transform .2s ease .2s;
	    vertical-align: middle;
	    font-size: 22px;
	}
</style>