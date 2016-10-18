/**
 * Created by katsura on 16-10-6.
 */
import Router from 'vue-router'

/* inject:page start */
import Front from './pages/front/Front.vue'
import TestPage from './pages/testPage/TestPage.vue'
/* inject:page end */


var routes = [{
    path: '/',
    component: Front
  },
  /* inject:route start */
  {
    path: '/front',
    component: Front
  }, {
    path: '/testPage',
    component: TestPage
  }
  /* inject:route end */


]

export default new Router({
  routes
})