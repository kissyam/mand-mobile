import Vue from 'vue'
import Router from 'vue-router'
import Home from '../Home'
import Error from '../Error'
import Routes from '../../../public/route'

Vue.use(Router)
let routeIndex = 0
const routeCategoryByLang = {
  'zh-CN': [],
  'en-US': [],
}
Routes.map((item, index) => {
  item.meta = item.meta || {}
  if (~item.path.indexOf('en-US')) {
    routeCategoryByLang['en-US'].push(item)
    item.meta.index = routeCategoryByLang['en-US'].length - 1
  } else {
    routeCategoryByLang['zh-CN'].push(item)
    item.meta.index = routeCategoryByLang['zh-CN'].length - 1
  }
  return item
})

const routes = [
  ...Routes,
  {path: '/en-US/home', component: Home, meta: {noMenu: true}},
  {path: '/zh-CN/home', component: Home, meta: {noMenu: true}},
  {path: '/', redirect: '/en-US/home'},
  {path: '*', component: Error, meta: {noMenu: true}},
]

const router = new Router({
  mode: 'hash',
  base: window.mbConfig.routePrefix,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = (to.meta.text
    ? `${to.meta.text}-${window.mbConfig.title}`
    : window.mbConfig.title).replace(/<[^>]+>/g, '')
  next()
})

router.afterEach((to, from) => {
  if (to.query.anchor) {
    setTimeout(() => {
      window.jumpAnchor(to.query.anchor)
    }, 500)
  }
})

window.$routes = routeCategoryByLang

export default router
