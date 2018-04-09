import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import main from '@/pages/main'
import home from '@/components/home'
import first from '@/components/first'
import second from '@/components/second'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: main,
      children: [
      	{
      		path: '',
      		component: home
      	},
      	{
      		path: '/first',
      		component: first
      	},
      	{
      		path: '/second',
      		component: second
      	}
      ]
    },
    {
    	path: '/login',
    	name: 'login',
    	component: login
    },
    {
    	path: '/403',
	    name: 'error-403',
	    meta: {
	        title: '403-权限不足'
	    },
	    component: resolve => { require(['@/pages/error-page/403.vue'], resolve); }
    },
    {
    	path: '/500',
	    meta: {
	        title: '500-服务端错误'
	    },
	    name: 'error-500',
	    component: resolve => { require(['@/pages/error-page/500.vue'], resolve); }
    },
    {
    	path: '/*',
	    name: 'error-404',
	    meta: {
	        title: '404-页面不存在'
	    },
	    component: resolve => { require(['@/pages/error-page/404.vue'], resolve); }
    }
  ]
})