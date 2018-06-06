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
		            <Submenu name="user">
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
		            <Submenu name="investigation">
			            <template slot="title">
			            	<Icon type="ios-paper"></Icon>
			            	<span>调研管理</span>
			            </template>
			            <MenuItem name="requestList">
			            	<Icon type="ios-list"></Icon>
			            	<span>调研列表</span>
			            </MenuItem>
			            <MenuItem name="reportList">
			            	<Icon type="ios-list"></Icon>
			            	<span>报告列表</span>
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
			            <MenuItem name="exchangeHistory">
			            	<Icon type="android-clipboard"></Icon>
			            	<span>修改历史</span>
			            </MenuItem>
		            </Submenu>
		            <Submenu name="activity">
			            <template slot="title">
			            	<Icon type="ios-game-controller-b"></Icon>
			            	<span>活动管理</span>
			            </template>
			            <MenuItem name="ConfigurationList">
			            	<Icon type="android-clipboard"></Icon>
			            	<span>配置列表</span>
			            </MenuItem>
		            </Submenu>
		            <Submenu name="questionnaire">
			            <template slot="title">
			            	<Icon type="ios-game-controller-b"></Icon>
			            	<span>问卷管理</span>
			            </template>
			            <MenuItem name="questionnaireList">
			            	<Icon type="android-clipboard"></Icon>
			            	<span>问卷列表</span>
			            </MenuItem>
		            </Submenu>
		            <Submenu name="airdrop">
			            <template slot="title">
			            	<Icon type="ios-game-controller-b"></Icon>
			            	<span>空投管理</span>
			            </template>
			            <MenuItem name="airdropList">
			            	<Icon type="android-clipboard"></Icon>
			            	<span>空投列表</span>
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
		'coinAdd': '新增数币',
		'coinEdit': '数币编辑',
		'user': '用户管理',
		'userList': '基本信息',
		'userAdd': '新增用户',
		'userEdit': '用户编辑',
		'commentList': '评论列表',
		'investigation': '调研管理',
		'requestList': '请求列表',
		'orderTakingList': '接单列表',
		'reportList': '报告列表',
		'reportEdit': '新增报告',
		'purse': '钱包管理',
		'userPurseList': '用户钱包',
		'userPurseEdit': '钱包编辑',
		'tradeRecordList': '交易记录列表',
		'tradeRecordEdit': '交易记录编辑',
		'exchange': '兑换管理',
		'exchangeRatio': '兑换比例',
		'exchangeHistory': '修改历史',
		'activity': '活动管理',
		'ConfigurationList': '配置列表',
		'questionnaire': '问卷管理',
		'questionnaireList': '问卷列表',
		'completedList': '已完成列表',
		'questionShow': '问卷详情',
		'completedDetail': '答卷明细',
		'airdrop': '空投管理',
		'airdropList': '空投列表',
		'airdropEdit': '新增空投'
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