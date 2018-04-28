<template>
  	<div class="layout">
	    <Layout :style="{minHeight: '100vh'}">
        	<Sider collapsible :collapsed-width="78" v-model="isCollapsed">
	        	<Menu :open-names="['1', '2', '3', '4']" :active-name="currentMenu" theme="dark" width="auto" :class="menuitemClasses" @on-select="onChange">
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
			            <!--<MenuItem name="systemPush">
			            	<Icon type="ios-paperplane"></Icon>
			            	<span>系统推送</span>
			            </MenuItem>
			            <MenuItem name="userAuthentication">
			            	<Icon type="ios-body"></Icon>
			            	<span>用户认证</span>
			            </MenuItem>-->
		            </Submenu>
		            <Submenu name="3">
			            <template slot="title">
			            	<Icon type="ios-paper"></Icon>
			            	<span>调研管理</span>
			            </template>
			            <MenuItem name="requestList">
			            	<Icon type="ios-list"></Icon>
			            	<span>请求列表</span>
			            </MenuItem>
		            </Submenu>
		            <Submenu name="4">
			            <template slot="title">
			            	<Icon type="social-yen"></Icon>
			            	<span>钱包管理</span>
			            </template>
			            <MenuItem name="userPurseList">
			            	<Icon type="social-usd"></Icon>
			            	<span>用户钱包</span>
			            </MenuItem>
			            <MenuItem name="rechargeRecord">
			            	<Icon type="android-clipboard"></Icon>
			            	<span>充值记录</span>
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
		            <BreadcrumbItem to="/home">首页</BreadcrumbItem>
		            <BreadcrumbItem v-for="(item, index) in routeList" :key="index" :to="item.path">{{item.name}}</BreadcrumbItem>
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
	const pathName = {
		'coin': '数币管理',
		'coinList': '数币信息',
		'coinEdit': '数币编辑',
		'user': '用户管理',
		'userList': '基本信息',
		'userAdd': '新增用户',
		'userEdit': '用户编辑',
		'investigation': '调研管理',
		'requestList': '请求列表',
		'orderTakingList': '接单列表',
		'purse': '钱包管理',
		'userPurseList': '用户钱包',
		'userPurseEdit': '钱包编辑',
		'tradeRecordList': '交易记录列表',
		'tradeRecordEdit': '交易记录编辑'
	}
	
	export default {
	  	name: 'App',
  		data () {
	  		return {
	  			isCollapsed: false,
	  			currentMenu: '',
	  			routeList: ''
	  		}
	  	},
	  	created () {
	  		
	  	},
	  	mounted () {
	  		this.linkage();
	  		this.calcPath();
	  	},
	  	components: {
	  		UserInfo
	  	},
	  	methods: {
  			onChange (name) {
  				this.$router.push({name: name})
  			},
  			linkage () {	//菜单联动,后期需要调整下
  				let route = this.$route.path;
				let index = route.lastIndexOf('/') + 1;
				let currentMenu = route.slice(index);
				this.currentMenu = currentMenu;
  			},
  			calcPath () {	//动态面包屑路径处理
  				let currentPath = this.$route.path;
  				let pathArray = _.drop(currentPath.split('/'));
  				let routeList = [];
  				if(Number(pathArray[pathArray.length - 1]) || pathArray[pathArray.length - 1] === 'home'){
  					pathArray.length -= 1;
  				}
  				_.forEach(pathArray, (name, index) => {
  					let path = _.join(_.take(pathArray, index + 1), '/');
  					let last = _.last(path.split('/'));
  					if(index === pathArray.length - 1) {
  						routeList.push({'path': '', 'name': pathName[last]});
  					} else {
  						routeList.push({'path': '/' + path, 'name': pathName[last]});
  					}
  				});
  				this.routeList = routeList;
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
				this.calcPath();
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