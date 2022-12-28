import {createRouter, createWebHistory} from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import MovieDetail from '../views/MovieDetail.vue'
import Bookmark from '../views/Bookmark.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
    { path: '/', component: Dashboard },
    { path: '/register', component: Register },
    { path: '/login', name:'Login', component: Login },
    { path: '/movie-detail/:movieId', component: MovieDetail },
    { path: '/bookmark', component: Bookmark },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes, // short for `routes: routes`
})


router.beforeEach((to, from, next) => {

    const notLoggedIn = !localStorage.getItem('access_token')

    if(to.path === '/bookmark' && notLoggedIn) next({name: 'Login'})
    else next()
})

export default router