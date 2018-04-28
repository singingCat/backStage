import Main from '@/pages/Main'

//登录
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录'
    },
    component: resolve => { require(['@/pages/Login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/pages/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@//pages/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/pages/error-page/500.vue'], resolve); }
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
	{
		path: '',
		name: 'main',
		title: '首页',
		redirect: 'home',
		component: Main,
		children: [
			{ path: 'home', title: '工作台', name: 'home', component: () => import('@/pages/Home.vue') }
		]
	},
	{
		path: '/coin',
	    name: 'coin',
	    title: '数币管理',
	    redirect: '/coin/coinList',
	    component: Main,
	    children: [
	        { path: 'coinList', title: '数币信息', name: 'coinList', component: () => import('@/pages/CoinList.vue') },
	        { path: 'coinAdd', title: '新增数币', name: 'coinAdd', component: () => import('@/pages/CoinEdit.vue') },
	        { path: 'coinEdit/:id', title: '数币编辑', name: 'coinEdit', component: () => import('@/pages/CoinEdit.vue') },
	        { path: 'commentList', title: '评论列表', name: 'commentList', component: () => import('@/pages/CommentList.vue') }
	    ]
   	},
   	{
   		path: '/user',
   		name: 'user',
   		title: '用户管理',
   		redirect: '/user/userList',
   		component: Main,
   		children: [
   			{ path: 'userList', title: '基本信息', name: 'userList', component: () => import('@/pages/UserList.vue') },
   			{ path: 'userAdd', title: '新增用户', name: 'userAdd', component: () => import('@/pages/UserEdit.vue') },
   			{ path: 'UserEdit/:id', title: '基本信息', name: 'userEdit', component: () => import('@/pages/UserEdit.vue') }
   		]
   	},
   	{
   		path: '/investigation',
   		name: 'investigation',
   		title: '调研',
   		redirect: '/investigation/requestList',
   		component: Main,
   		children: [
   			{ path: 'requestList', title: '请求列表', name: 'requestList', component: () => import('@/pages/InvestigationRequestList.vue') },
   			{ path: 'orderTakingList/:id', title: '接单列表', name: 'orderTakingList', component: () => import('@/pages/OrderTakingList.vue') }
   		]
   	},
   	{
   		path: '/purse',
   		name: 'purse',
   		title: '钱包管理',
   		redirect: '/purse/userPurseList',
   		component: Main,
   		children: [
   			{ path: 'userPurseList', title: '用户钱包', name: 'userPurseList', component: () => import('@/pages/UserPurseList.vue') },
   			{ path: 'userPurseEdit/:uuid', title: '钱包编辑', name: 'userPurseEdit', component: () => import('@/pages/UserPurseEdit.vue') },
   			{ path: 'tradeRecordList/:uuid', title: '交易记录列表', name: 'tradeRecordList', component: () => import('@/pages/TradeRecordList.vue') },
   			{ path: 'TradeRecordEdit/:uuid', title: '交易记录编辑', name: 'TradeRecordEdit', component: () => import('@/pages/TradeRecordEdit.vue') },
   		]
   	}
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
	loginRouter,
	...appRouter,
	page500,
    page403,
    page404
]