<template>
  	<div class="layout">
	    <Layout :style="{minHeight: '100vh'}">
        	<Sider collapsible :collapsed-width="78" v-model="isCollapsed">
	        	<Menu :open-names="[openNames]" :active-name="currentMenu" accordion theme="dark" width="auto" :class="menuitemClasses" @on-select="onChange">
		            <Submenu name="coin">
			            <template slot="title">
			            	<Icon type="social-bitcoin"></Icon>
			            	<span>数币管理</span>
			            </template>
			            <MenuItem name="coinList">
			            	<Icon type="information-circled"></Icon>
			            	<span>数币信息</span>
			            </MenuItem>
		            </Submenu>
		            <Submenu name="user">
			            <template slot="title">
			            	<Icon type="person"></Icon>
			            	<span>用户管理</span>
			            </template>
			            <MenuItem name="userList">
			            	<Icon type="happy"></Icon>
			            	<span>基本信息</span>
			            </MenuItem>
			            <MenuItem name="waitAuthentication">
			            	<Icon type="ios-body"></Icon>
			            	<span>等待认证</span>
			            </MenuItem>
			            <MenuItem name="systemPush">
			            	<Icon type="ios-paperplane"></Icon>
			            	<span>消息</span>
			            </MenuItem>
		            </Submenu>
		            <Submenu name="investigation">
			            <template slot="title">
			            	<Icon type="ios-paper"></Icon>
			            	<span>调研管理</span>
			            </template>
			            <MenuItem name="requestList">
			            	<Icon type="ios-list"></Icon>
			            	<span>调研列表</span>
			            </MenuItem>
			            <MenuItem name="questionnaireList">
			            	<Icon type="android-clipboard"></Icon>
			            	<span>问卷列表</span>
			            </MenuItem>
		            </Submenu>
		            <Submenu name="purse">
			            <template slot="title">
			            	<Icon type="social-yen"></Icon>
			            	<span>钱包管理</span>
			            </template>
			            <MenuItem name="tradeRecordList">
			            	<Icon type="android-clipboard"></Icon>
			            	<span>交易记录</span>
			            </MenuItem>
		            </Submenu>
		            <Submenu name="exchange">
			            <template slot="title">
			            	<Icon type="social-yen"></Icon>
			            	<span>兑换管理</span>
			            </template>
			            <MenuItem name="exchangeRatio">
			            	<Icon type="android-clipboard"></Icon>
			            	<span>兑换比例</span>
			            </MenuItem>
		            </Submenu>
		            <Submenu name="activity">
			            <template slot="title">
			            	<Icon type="ios-game-controller-b"></Icon>
			            	<span>配置管理</span>
			            </template>
			            <MenuItem name="VersionList">
			            	<Icon type="android-clipboard"></Icon>
			            	<span>版本更新</span>
			            </MenuItem>
			            <MenuItem name="ConfigurationList">
			            	<Icon type="android-clipboard"></Icon>
			            	<span>配置信息</span>
			            </MenuItem>
		            </Submenu>
		            <Submenu name="activity">
			            <template slot="title">
			            	<Icon type="ios-game-controller-b"></Icon>
			            	<span>新闻管理</span>
			            </template>
			            <MenuItem name="newsletterList">
			            	<Icon type="android-clipboard"></Icon>
			            	<span>快讯</span>
			            </MenuItem>
			            <MenuItem name="dailyList">
			            	<Icon type="android-clipboard"></Icon>
			            	<span>新闻</span>
			            </MenuItem>
		            </Submenu>
		            <Submenu name="activity">
			            <template slot="title">
			            	<Icon type="ios-game-controller-b"></Icon>
			            	<span>RONI管理</span>
			            </template>
			            <MenuItem name="roniList">
			            	<Icon type="android-clipboard"></Icon>
			            	<span>RONI列表</span>
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
		'user': '用户管理',
		'userList': '基本信息',
		'commentList': '评论列表',
		'investigation': '调研管理',
		'requestList': '请求列表',
		'purse': '钱包管理',
		'userPurseList': '用户钱包',
		'userPurseEdit': '钱包编辑',
		'tradeRecordList': '交易记录列表',
		'tradeRecordEdit': '交易记录编辑',
		'exchange': '兑换管理',
		'exchangeRatio': '兑换比例',
		'activity': '配置管理',
		'ConfigurationList': '配置信息',
		'questionnaire': '问卷管理',
		'questionnaireList': '问卷列表',
		'completedList': '已完成列表',
		'questionShow': '问卷详情',
		'completedDetail': '答卷明细',
		'questionList': '问题列表',
		'airdrop': '空投管理',
		'waitAuthentication': '等待认证',
		'systemPush': '消息',
		'systemPushCreate': '创建消息',
		'VersionList': '版本更新',
		'news': '新闻管理',
		'newsletterList': '快讯',
		'dailyList': '新闻',
		'roni': 'RONI管理',
		'roniList': 'RONI列表',
		'newsletterAdd': '新增快讯',
		'newsletterEdit': '编辑快讯',
		'dailyAdd': '新增新闻',
		'dailyEdit': '编辑新闻'
	}
	
	export default {
	  	name: 'App',
  		data () {
	  		return {
	  			isCollapsed: false,
	  			currentMenu: '',
	  			openNames: '',
	  			routeList: ''
	  		}
	  	},
	  	created () {
	  		if (!this.cookieHandler.getCookie('token')) {
	  			this.$router.replace({name: 'login'});
	  		}
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
				let openNames = route.split('/')[1];
				this.currentMenu = currentMenu;
				this.openNames = openNames;
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
	.collapsed-menu i{
	    transform: translateX(5px);
	    transition: font-size .2s ease .2s, transform .2s ease .2s;
	    vertical-align: middle;
	    font-size: 22px;
	}
</style>