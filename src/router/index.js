import Vue from 'vue'
import Router from 'vue-router'
import Appcontent from '@/components/content/content'
import AddElement from '@/components/action/AddElement'
import edit from '@/components/action/edit'
import login from '@/components/auth/login'
import singup from '@/components/auth/singup'
import profile from '@/components/user/profile'
import recipes from '@/components/user/recipes'
import userView from '@/components/user/userViewRecipes'
import addingredient from '@/components/action/addingredient'
import listIngredient from '@/components/content/list'
import firebase from 'firebase'
import style from '@/assets/scss/main.scss'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'app-content',
      props: true,
      component: Appcontent,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/add-element',
      name: 'AddElement',
      component: AddElement,
      props: true,
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/edit/:slug',
      name: 'edit',
      component: edit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/singup',
      name: 'singup',
      component: singup
    },
    {
      path: '/profile/:email',
      name: 'profile',
      component: profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/recipes/:slug',
      name: 'recipes',
      component: recipes,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/recipesUser/:slug',
      name: 'userView',
      component: userView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/addingredient',
      name: 'addingredient',
      component: addingredient,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/list-ingredient',
      name: 'list-ingredient',
      component: listIngredient,
      meta: {
        requiresAuth: true
      }
    },    
  ]
})
router.beforeEach((to,form,next) =>{
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    let user = firebase.auth().currentUser
    if(user){
      next()
    }else{
      next({
        name: 'login'
      })
    }
  }else{
    next()
  }
})
export default router