import Vue from 'vue'
import Router from 'vue-router'
import Test from '@/components/Test'
import Users from '@/components/Users'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'test',
      component: Test
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    }
  ]
})
