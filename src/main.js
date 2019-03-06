/* jshint esversion: 6 */ 
import babelpolyfill from 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router';
import store from './vuex/store';
import Vuex from 'vuex';
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes';
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css';

import MenuUtils from '@/utils/MenuUtils';

// Vue.prototype.$path = "http://www.daiyupingzheng.com/systemManager/";
Vue.prototype.$path = "http://192.168.30.7:8004/";
Vue.prototype.$imgPath = "http://www.daiyupingzheng.com:8099/";

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  // mode: 'history',
  mode: 'hash',
  routes
})
let data = JSON.parse(window.sessionStorage.getItem('user'))
if (data){
  //这里是防止用户手动刷新页面，整个app要重新加载,动态新增的路由，会消失，所以我们重新add一次
  let routes = []
  MenuUtils(routes,data)
  router.addRoutes(routes)
  window.sessionStorage.removeItem('isLoadNodes')
}
router.beforeEach((route, redirect, next) => {
  let data = JSON.parse(window.sessionStorage.getItem('user'))
  if(data&&route.path === '/login'){
    //这里不使用router进行跳转，是因为，跳转到登录页面的时候，是需要重新登录，获取数据的，这个时候，会再次向router实例里面add路由规则，
    //而next()跳转过去之后，没有刷新页面，之前的规则还是存在的，但是使用location的话，可以刷新页面，当刷新页面的时候，整个app会重新加载
    //而我们在刷新之前已经把sessionStorage里的user移除了，所以上面的添加路由也不行执行
    window.sessionStorage.removeItem('user');
    window.sessionStorage.removeItem('isLoadNodes');
    window.location.href = '/';
    return false;
  }
  if (!data && route.path !== '/login') {
    next({ path: '/login' })
  } else {
    if (route.path) {
      next()
    } else {
      next({ path: '/404' })
    }
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')