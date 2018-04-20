<template>
  	<div class="layout">
	    <Layout :style="{minHeight: '100vh'}">
        	<Sider collapsible :collapsed-width="78" v-model="isCollapsed">
	        	<Menu :open-names="['1']" active-name="" theme="dark" width="auto" :class="menuitemClasses" accordion @on-select="onChange">
		            <Submenu name="1">
			            <template slot="title">
			            	<Icon type="ios-paper"></Icon>
			            	<span>数币管理</span>
			            </template>
			            <Menu-item name="coinList">
			            	<Icon type="ios-paper"></Icon>
			            	<span>数币信息</span>
			            </Menu-item>
			            <MenuItem name="comment">
			            	<Icon type="ios-paper"></Icon>
			            	<span>评论管理</span>
			            </MenuItem>
			            <MenuItem name="team">
			            	<Icon type="ios-paper"></Icon>
			            	<span>团队管理</span>
			            </MenuItem>
			            <MenuItem name="publicOffering">
			            	<Icon type="ios-paper"></Icon>
			            	<span>公募信息</span>
			            </MenuItem>
			            <MenuItem name="airDrop">
			            	<Icon type="ios-paper"></Icon>
			            	<span>空投信息</span>
			            </MenuItem>
		            </Submenu>
		            <!--<Submenu name="2">
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
	            	</Submenu>-->
		            <!--<MenuItem name="3-1">
			            <Icon type="ios-navigate"></Icon>
			            <span>Option 1</span>
		            </MenuItem>-->
		            <!--<template v-for="item in routerList">
		            	<Submenu v-if="item.children.length > 1" :name="item.name" :key="item.name">
		            		<template slot="title">
			                    <Icon :type="ios-paper"></Icon>
			                    <span class="layout-text">{{ item.title }}</span>
			                </template>
			                <template v-for="child in item.children">
			                    <MenuItem :name="child.name" :key="'menuitem' + child.name">
			                        <Icon :type="ios-paper" :key="'icon' + child.name"></Icon>
			                        <span :key="'title' + child.name">{{ child.title }}</span>
			                    </MenuItem>
			                </template>
		            	</Submenu>
		            </template>-->
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
		            <div style="min-height: calc( 100vh - 170px )">
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
	  			isCollapsed: false,
	  			routerList: ''	//路由集合
	  		}
	  	},
	  	created () {
	  		
	  	},
	  	mounted () {
	  		
	  	},
	  	components: {
	  		UserInfo
	  	},
	  	methods: {
  			onChange (name) {
  				this.$router.push({name: name})
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