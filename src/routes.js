/* jshint esversion: 6 */ 
import Login from './views/Login.vue';
import NotFound from './views/404.vue';
import Home from './views/Home.vue';
import Main from './views/Main.vue';
import echarts from './views/charts/echarts.vue';
import UserList from './views/user/UserList.vue';
import DealList from './views/deal/DealList.vue';
import StockList from './views/stock/StockList.vue';
import ProductList from './views/product/ProductList.vue';
import ExampleList from './views/ex/ExampleList.vue';
//权限菜单
import AccessUser from './views/access/AccessUser.vue';
import AccessRole from './views/access/AccessRole.vue';
import AccessMenu from './views/access/AccessMenu.vue';
// 风控模型报表
import RiskModelMonitor from './views/analysis/RiskModelMonitor.vue';


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true,
        meta : false
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '账单管理',
    //     // iconCls: 'el-icon-message',//图标样式class
    //     children: [
    //         { path: '/tbc', component: Tbc, name: '待确认账单' },
    //         { path: '/form4', component: Form4, name: '账单详情', hidden: true },
    //         { path: '/edit', component: Edit, name: '账单详情', hidden: true },
    //         { path: '/borrow', component: Borrow, name: '借入账单' },
    //         { path: '/lend', component: Lend, name: '借出账单' },
    //         // { path: '/beoverdue', component: Beoverdue, name: '逾期账单' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '抵押',
    //     // iconCls: 'fa fa-id-card-o',
    //     children: [
    //         { path: '/ongoing', component: Ongoing, name: '抵押进行中' },
    //         { path: '/bill', component: Bill, name: '抵押账单' },
    //         { path: '/send', component: Send, name: '抵押寄送' },
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '账号管理',
    //     // iconCls: 'fa fa-id-card-o',
    //     children: [
    //         { path: '/userorg', component: AccessUser, name: '用户管理' },
    //         { path: '/roleorg', component: AccessRole, name: '角色管理' },
    //         { path: '/menuorg', component: AccessMenu, name: '权限管理' },
    //     ]
    // },
    {
        path: '/',
        component: Home,
        name: '风控模型监控',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/riskModelMonitor', component: RiskModelMonitor, name: '风控模型监控' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;