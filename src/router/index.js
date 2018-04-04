import Vue from 'vue'
import Router from 'vue-router'
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
    }
  ]
})
