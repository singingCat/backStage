// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import VueResource from 'vue-resource'
import VueCountUp from 'vue-countupjs'
import axios from 'axios'
import 'iview/dist/styles/iview.css'
require('animate.css/animate.min.css')

Vue.use(VueResource)
Vue.use(VueCountUp)
Vue.use(iView)

Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

//cookie相关函数
Vue.prototype.cookieHandler = {
	setCookie: (c_name, value, expiredays) => {
		let exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ? "" : ";expires=" + exdate.toGMTString())+ ';path=/'; 
	},
	removeCookie: (name) => {
    Vue.prototype.cookieHandler.setCookie(name, "", -1);
	},
	getCookie: (c_name) => {
		if (document.cookie.length > 0){
		  let c_start = document.cookie.indexOf(c_name + "=");
		  let c_end = '';
		  if (c_start != -1){
		    c_start = c_start + c_name.length + 1;
		    c_end = document.cookie.indexOf(";", c_start);
		    if (c_end == -1){
		    	c_end = document.cookie.length;
		    }
		    return unescape(document.cookie.substring(c_start, c_end));
		  }
		}
		return "";
	}
}

//localStorage相关函数
Vue.prototype.storageHandler = {
	setStorage: (key, value) => {
		localStorage.setItem(key, value);
	},
	removeStorage: () => {
		localStorage.removeItem('nickName');
	}
}

// http request 拦截器
axios.interceptors.request.use(
    config => {
    		let token = Vue.prototype.cookieHandler.getCookie('token');	//从cookie中获取token
        if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 这里写清除token的代码
                    Vue.prototype.cookieHandler.removeCookie('token');
                    Vue.prototype.storageHandler.removeStorage('nickName');
                    console.log('token过期');
                    router.replace({
                        path: 'login',
                        query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
                    })
            }
        }
        return Promise.reject(error.response.data) 
    }
);

router.beforeEach((to, from, next) => {
		let token = Vue.prototype.cookieHandler.getCookie('token');	//从cookie中获取token
		iView.LoadingBar.start();
		if (to.meta.requireAuth) {
			if(token && token != ''){
				next();
			} else {
				next({
						path: '/login',
						query: { redirect: to.fullPath }
				})
			}
		} else {
				next();
		}
});

router.afterEach(route => {
    iView.LoadingBar.finish();
});