import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: [
        {
            path: '/',
            //@ts-ignore
            component: () => import('../views/Home.vue'),
        },
        {
            path: '/dashboard',
            component: () => import('../views/Dashboard.vue'),

        },
        {
            path: '/issuer',
            component: () => import('../views/IssuerDashboard.vue'),

        },
        {
            path: '/register',
            component: () => import('../views/Register.vue')
        },
        {
            path: '/test',
            component: () => import('../views/Test.vue')
        },
        {
            path: '/verify/:shareId?',
            name: 'VerifySharedCredentials',
            component: () => import('../views/Verify.vue')
        },
        {
            path: '/verify',
            name: 'Verify',
            component: () => import('../views/Verify.vue')
        },
        { path: '/:pathMatch(.*)*', component: () => import('../views/NotFound.vue') },
    ]
})
export default router;