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
        path: '/success/',
        component: () => import('@/views/SubmitSuccess.vue'),
        props: true,
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

export default router
