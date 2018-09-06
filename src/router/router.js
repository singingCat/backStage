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
			{ path: 'home', title: '工作台', name: 'home', meta: { requireAuth: true }, component: () => import('@/pages/Home.vue') }
		]
	},
	{
		path: '/coin',
	    name: 'coin',
	    title: '数币管理',
	    redirect: '/coin/coinList',
	    component: Main,
	    children: [
	        { path: 'coinList', title: '数币信息', name: 'coinList', meta: { requireAuth: true }, component: () => import('@/pages/CoinList.vue') },
	        { path: 'commentList', title: '评论列表', name: 'commentList', meta: { requireAuth: true }, component: () => import('@/pages/CommentList.vue') }
	    ]
   	},
   	{
   		path: '/user',
   		name: 'user',
   		title: '用户管理',
   		redirect: '/user/userList',
   		component: Main,
   		children: [
   			{ path: 'userList', title: '基本信息', name: 'userList', meta: { requireAuth: true }, component: () => import('@/pages/UserList.vue') },
   			{ path: 'userAdd', title: '新增用户', name: 'userAdd', meta: { requireAuth: true }, component: () => import('@/pages/UserEdit.vue') },
   			{ path: 'UserEdit/:id', title: '基本信息', name: 'userEdit', meta: { requireAuth: true }, component: () => import('@/pages/UserEdit.vue') },
   			{ path: 'waitAuthentication', title: '个人认证', name: 'waitAuthentication', meta: { requireAuth: true }, component: () => import('@/pages/WaitAuthentication.vue') },
   			{ path: 'systemPush', title: '系统推送', name: 'systemPush', meta: { requireAuth: true }, component: () => import('@/pages/SystemPush.vue') },
   			{ path: 'systemPushCreate', title: '创建推送', name: 'systemPushCreate', meta: { requireAuth: true }, component: () => import('@/pages/SystemPushCreate.vue') },
   			{ path: 'pannelAuthentication', title: 'pannel认证', name: 'pannelAuthentication', meta: { requireAuth: true }, component: () => import('@/pages/PannelAuthentication.vue') },
   			{ path: 'companyAuthentication', title: '企业认证', name: 'companyAuthentication', meta: { requireAuth: true }, component: () => import('@/pages/CompanyAuthentication.vue') }
   		]
   	},
   	{
   		path: '/investigation',
   		name: 'investigation',
   		title: '调研',
   		redirect: '/investigation/requestList',
   		component: Main,
   		children: [
   			{ path: 'requestList', title: '请求列表', name: 'requestList', meta: { requireAuth: true }, component: () => import('@/pages/InvestigationRequestList.vue') },
   			{ path: 'questionnaireList', title: '问卷管理', name: 'questionnaireList', meta: { requireAuth: true }, component: () => import('@/pages/QuestionnaireList.vue') },
   			{ path: 'completedList/:id', title: '已完成列表', name: 'completedList', meta: { requireAuth: true }, component: () => import('@/pages/CompletedList.vue') },
   			{ path: 'completedDetail/:uuid', title: '查看详情', name: 'completedDetail', meta: { requireAuth: true }, component: () => import('@/pages/CompletedDetail.vue') },
   			{ path: 'questionShow/:uid', title: '查看问题', name: 'questionShow', meta: { requireAuth: true }, component: () => import('@/pages/QuestionShow.vue') },
   			{ path: 'communityRating', title: '社区评级', name: 'communityRating', meta: { requireAuth: true }, component: () => import('@/pages/CommunityRating.vue') }
   		]
   	},
   	{
   		path: '/purse',
   		name: 'purse',
   		title: '交易管理',
   		redirect: '/purse/tradeRecordList',
   		component: Main,
   		children: [
   			{ path: 'tradeRecordList', title: '交易记录列表', name: 'tradeRecordList', meta: { requireAuth: true }, component: () => import('@/pages/TradeRecordList.vue') }
   		]
   	},
   	{
   		path: '/exchange',
   		name: 'exchange',
   		title: '兑换管理',
   		component: Main,
   		children: [
   			{ path: 'exchangeRatio', title: '兑换比例', name: 'exchangeRatio', meta: { requireAuth: true }, component: () => import('@/pages/ExchangeRatio.vue') },
   		]
   	},
   	{
   		path: '/activity',
   		name: 'activity',
   		title: '配置管理',
   		component: Main,
   		children: [
   			{ path: 'ConfigurationList', title: '配置列表', name: 'ConfigurationList', meta: { requireAuth: true }, component: () => import('@/pages/ConfigurationList.vue') },
   			{ path: 'VersionList', title: '版本号列表', name: 'VersionList', meta: { requireAuth: true }, component: () => import('@/pages/VersionList.vue') },
   			{ path: 'BannerList', title: 'banner列表', name: 'BannerList', meta: { requireAuth: true }, component: () => import('@/pages/BannerList.vue') }
   		]
   	},
   	{
   		path: '/news',
   		name: 'news',
   		title: '新闻管理',
   		component: Main,
   		children: [
   			{ path: 'newsletterList', title: '快讯', name: 'newsletterList', meta: { requireAuth: true }, component: () => import('@/pages/NewsletterList.vue') },
   			{ path: 'dailyList', title: '日报', name: 'dailyList', meta: { requireAuth: true }, component: () => import('@/pages/DailyList.vue') },
   			{ path: 'newsletterAdd', title: '新增快讯', name: 'newsletterAdd', meta: { requireAuth: true }, component: () => import('@/pages/NewsletterEdit.vue') },
   			{ path: 'newsletterEdit/:uid', title: '编辑快讯', name: 'newsletterEdit', meta: { requireAuth: true }, component: () => import('@/pages/NewsletterEdit.vue') },
   			{ path: 'dailyAdd', title: '新增快讯', name: 'dailyAdd', meta: { requireAuth: true }, component: () => import('@/pages/DailyEdit.vue') },
   			{ path: 'dailyEdit/:uid', title: '编辑快讯', name: 'dailyEdit', meta: { requireAuth: true }, component: () => import('@/pages/DailyEdit.vue') }
   		]
   	},
   	{
   		path: '/roni',
   		name: 'roni',
   		title: 'RONI管理',
   		component: Main,
   		children: [
   			{ path: 'roniList', title: 'RONI列表', name: 'roniList', meta: { requireAuth: true }, component: () => import('@/pages/RoniList.vue') }
   		]
   	},
   	{
   		path: '/airdrop',
   		name: 'airdrop',
   		title: '空投管理',
   		component: Main,
   		children: [
   			{ path: 'facebookList', title: 'Facebook列表', name: 'facebookList', meta: { requireAuth: true }, component: () => import('@/pages/FacebookList.vue') },
   			{ path: 'twitterList', title: 'Twitter列表', name: 'twitterList', meta: { requireAuth: true }, component: () => import('@/pages/TwitterList.vue') }
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