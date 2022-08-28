import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import HomeScreen from "@/views/HomeScreen.vue";


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: HomeScreen
    },
    {
        path: '/config/',
        component: () => import('@/views/SessionConfig.vue'),
    },
    {
        path: '/config/tasting-items/',
        component: () => import('@/views/AddTastingItems.vue'),
    },
    {
        path: '/join/',
        component: () => import('@/views/SessionScreen.vue'),
    },
    {
        path: '/tasting/',
        component: () => import('@/views/TastingScreen.vue'),
    },
    {
        path: '/success/:tastingSessionCode',
        component: () => import('@/views/SubmitSuccess.vue'),
        props: true
    },
    {
        path: '/tabs/',
        component: TabsPage,
        children: [
            {
                path: '',
                redirect: '/tabs/tab1'
            },
            {
                path: 'tab1',
                component: () => import('@/views/Tab1Page.vue')
            },
            {
                path: 'tab2',
                component: () => import('@/views/Tab2Page.vue')
            },
            {
                path: 'tab3',
                component: () => import('@/views/Tab3Page.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.afterEach((to, from) => {
    const toDepth = to.path.substring(1).split('/').length
    const fromDepth = from.path.substring(1).split('/').length
    to.meta.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})

export default router
