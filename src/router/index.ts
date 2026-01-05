import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import HomeScreen from "@/views/HomeScreen.vue";
import {getSessionKeyFromPreferences} from "@/controller/LocalStorage";
import {fetchTastingSessionAndSaveToLocalStorage} from "@/util/Utils";


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
        path: '/success/:tastingSessionCode',
        component: () => import('@/views/SubmitSuccess.vue'),
        props: true
    },
    {
        path: '/session/',
        component: () => import('@/views/SessionScreen.vue'),
    },
    {
        path: '/session/tasting-items/',
        component: () => import('@/views/TastingItemSelection.vue'),
    },
    {
        path: '/session/join/:sessionId',
        component: () => import('@/views/JoinShortcut.vue'),
        props: true,
    },
    {
        path: '/session/tasting-items/:tastingItemName/',
        component: () => import('@/views/TastingScreen.vue'),
        props: true,
    },
    {
        path: '/session/add/tasting-items/',
        component: () => import('@/views/AddTastingItems.vue'),
    },
    {
        path: '/session/evaluation/',
        component: () => import('@/views/EvaluationItemSelection.vue'),
    },
    {
        path: '/session/evaluation/:evaluationItemName/',
        component: () => import('@/views/EvaluationScreen.vue'),
        props: true
    },
    {
        path: '/session/evaluation/all-items/',
        component: () => import('@/views/CombinedEvaluationItems.vue'),
        props: true
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach(async (to, from) => {
    // Refresh session from Firestore if navigating to session-related routes
    if (to.path.startsWith('/session/') || to.path.startsWith('/success/')) {
        try {
            const sessionKey = await getSessionKeyFromPreferences();
            if (sessionKey) {
                await fetchTastingSessionAndSaveToLocalStorage(sessionKey);
            }
        } catch (error) {
            // No session key - user not in a session, continue navigation
        }
    }
});

router.afterEach((to, from) => {
    const toDepth = to.path.substring(1).split('/').length
    const fromDepth = from.path.substring(1).split('/').length

    if(fromDepth < 3 || toDepth < 3 ){
        to.meta.transitionName = 'no-animation'
    }
    to.meta.transitionName = toDepth <= fromDepth ? 'slide-right' : 'slide-left'
    //TODO
})

export default router
