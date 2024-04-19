import { createRouter, createWebHashHistory } from 'vue-router'
// import { createRouter, createWebHistory } from 'vue-router'
import HrisView from '../views/HrisView.vue'
import PayslipView from '../views/PayslipView.vue'
import LoginView from '../views/LoginView.vue'
import MenuComponent from '../components/MenuComponent.vue'

import History from '../views/HistoryView.vue'
import Profile from '../views/ProfileView.vue'
// import UserList from '../views/UserListView.vue'
import PageNotFound from '../views/PageNotFound.vue'


const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView,
    meta: {
      title: "Login",
      auth: true
    },
    // beforeEnter: (next) => {
    //   if(this.$q.localStorage.getItem('is_login') == true){
    //     next()
    //   }else{
    //     return false
    //   }
    // },
  },
  {
    path: '/menu',
    name: 'menu',
    component: MenuComponent,
    children:[
      {
        path: '/hris',
        name: 'hris',
        component: HrisView,
        meta: {
          title: 'HRIS',
          auth: true
        }
      },
      {
        path: '/payslip',
        name: 'payslip',
        component: PayslipView,
        meta: {
          title: 'Payslip',
          auth: true
        }
      },
      {
        path:'/history',
        name:'history',
        component: History,
        meta: {
          title: 'History',
          auth: true
        }
      },
      {
        path:'/profile',
        name:'profile',
        component: Profile,
        meta: {
          title: 'Profile',
          auth: true
        }
      },
      // {
      //   path: '/user',
      //   name: 'user',
      //   component: UserList,
      //   meta: {
      //     title: 'User List',
      //     auth: true
      //   }
      // },
    ]
  },
  
  
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: PageNotFound,
    meta: {
      title: 'Page Not Found',
      auth: true
    }
  }
  
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  // history: createWebHistory(process.env.BASE_URL),
  // history: createWebHistory(),
  routes
})

router.beforeEach((to,from,next) => {
  document.title = to.meta.title
  if(to.meta.auth === true){
    next()
  }else{
    return false
  }
})



export default router
