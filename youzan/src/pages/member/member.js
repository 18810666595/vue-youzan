
//使用vue-router
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router)

//引入路由组件
import member from './components/member.vue';
import address from './components/address.vue';
import all from './components/all.vue';
import form from './components/form.vue';

//创建router实例
let routes = [{        //配置路由路径与对应的组件
  path: '/',
  component: member
},{
  // redirect: '',
  path: '/address',
  component: address,
  children: [{
    path: '',
    redirect: 'all' //路由重定向
  },{
    path: 'all',
    name: 'all',
    component: all
  },{
    path: 'from',
    name: 'form',    //命名路由，多层级链接时候，不用写多级路径了
    component: form
  }]
}]

let router = new Router({   //创建router实例
  routes
})

//根组件注入
new Vue({
  el: '#app',
  router
})
