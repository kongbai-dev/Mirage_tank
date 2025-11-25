import { createRouter, createWebHistory } from 'vue-router';

import MirageTank from '../views/MirageTank.vue';
import PrismTank from '../views/PrismTank.vue';

const routes = [
    {
        path: '/',
        redirect: '/mirage'
    },
    {
        path: '/mirage',
        name: 'Mirage',
        component: MirageTank
    },
    {
        path: '/prism',
        name: 'Prism',
        component: PrismTank
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;