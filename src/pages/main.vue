<template>
  	<div class="layout">
	    <Layout :style="{minHeight: '100vh'}">
        	<Sider collapsible :collapsed-width="78" v-model="isCollapsed">
	        	<Menu :open-names="['1', '2']" :active-name="currentMenu" theme="dark" width="auto" :class="menuitemClasses" @on-select="onChange">
		            <Submenu name="1">
			            <template slot="title">
			            	<Icon type="social-bitcoin"></Icon>
			            	<span>数币管理</span>
			            </template>
			            <MenuItem name="coinList">
			            	<Icon type="information-circled"></Icon>
			            	<span>数币信息</span>
			            </MenuItem>
			            <!--<MenuItem name="comment">
			            	<Icon type="chatbubbles"></Icon>
			            	<span>评论管理</span>
			            </MenuItem>
			            <MenuItem name="team">
			            	<Icon type="ios-people"></Icon>
			            	<span>团队管理</span>
			            </MenuItem>
			            <MenuItem name="publicOffering">
			            	<Icon type="social-yen"></Icon>
			            	<span>公募信息</span>
			            </MenuItem>
			            <MenuItem name="airDrop">
			            	<Icon type="plane"></Icon>
			            	<span>空投信息</span>
			            </MenuItem>-->
		            </Submenu>
		            <Submenu name="2">
			            <template slot="title">
			            	<Icon type="person"></Icon>
			            	<span>用户管理</span>
			            </template>
			            <MenuItem name="userList">
			            	<Icon type="happy"></Icon>
			            	<span>基本信息</span>
			            </MenuItem>
			            <MenuItem name="purseManagement">
			            	<Icon type="social-yen"></Icon>
			            	<span>钱包管理</span>
			            </MenuItem>
			            <MenuItem name="systemPush">
			            	<Icon type="ios-paperplane"></Icon>
			            	<span>系统推送</span>
			            </MenuItem>
			            <MenuItem name="userAuthentication">
			            	<Icon type="ios-body"></Icon>
			            	<span>用户认证</span>
			            </MenuItem>
		            </Submenu>
	        	</Menu>
        	</Sider>
		    <Layout>
		        <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)', height: '60px'}">
		        	<UserInfo/>
		        </Header>
		        <Content :style="{padding: '0 16px 16px'}">
		        <Breadcrumb :style="{margin: '16px 0'}">
		            <Breadcrumb-item to="/home">首页</Breadcrumb-item>
		        </Breadcrumb>
		        <Card>
		            <div style="min-height: calc( 100vh - 200px )">
						<router-view/>
		            </div>
		        </Card>
		        </Content>
		    </Layout>
		</Layout>
	</div>
</template>

<script>
	import UserInfo from '../components/UserInfo'
	
	let _ = require('lodash')
	
	export default {
	  	name: 'App',
  		data () {
	  		return {
	  			isCollapsed: false,
	  			currentMenu: ''
	  		}
	  	},
	  	created () {
	  		this.linkage();
	  	},
	  	mounted () {
	  		
	  	},
	  	components: {
	  		UserInfo
	  	},
	  	methods: {
  			onChange (name) {
  				this.$router.push({name: name})
  			},
  			linkage () {		//菜单联动,后期需要调整下
  				let route = this.$route.path;
				let index = route.lastIndexOf('/') + 1;
				let currentMenu = route.slice(index);
				this.currentMenu = currentMenu;
  			}
	  	},
	  	computed: {
			menuitemClasses: function () {
		    	return [
	        		'menu-item',
	        		this.isCollapsed ? 'collapsed-menu' : ''
	    		]
	    	}
		},
		watch: {
			$route () {
				this.linkage();
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